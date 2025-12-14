import subprocess
import sys
import os
from pathlib import Path
import shutil
import platform
import time
import re
from datetime import datetime

class AnalysisService:
    """契約分析服務 - 呼叫 AI 模組"""
    
    def __init__(self):
        self.ai_dir = Path(__file__).parent.parent.parent.parent / "AI"
        self.law_main_path = self.ai_dir / "law_main.py"
        self.python_executable = self._get_ai_python()
        self.ai_contracts_dir = self.ai_dir / "contracts"
        self.ai_contracts_dir.mkdir(exist_ok=True)
        
        if not self.law_main_path.exists():
            raise Exception(f"找不到 AI 模組:  {self.law_main_path}")
        
        print(f"✅ AI 模組路徑: {self.ai_dir}")
        print(f"✅ Python 執行檔: {self.python_executable}")
    
    def _get_ai_python(self) -> str:
        """取得 AI venv 的 Python 執行檔路徑"""
        venv_dir = self.ai_dir / "venv"
        
        if platform.system() == "Windows":
            python_path = venv_dir / "Scripts" / "python.exe"
        else:
            python_path = venv_dir / "bin" / "python"
        
        if python_path.exists():
            print(f"🐍 使用 AI venv Python:  {python_path}")
            return str(python_path)
        else:
            print(f"⚠️ 找不到 AI venv，使用系統 Python")
            return sys.executable
    
    async def analyze_contract(self, contract_text_path: str, language: str = 'zh-TW') -> str:
        """執行契約分析（支援多語言）"""
        print(f"🔍 開始分析契約: {contract_text_path}, 語言: {language}")
        
        try:
            # 步驟 1: 複製契約到 AI 資料夾
            contract_filename = Path(contract_text_path).name
            ai_contract_path = self.ai_contracts_dir / contract_filename
            shutil.copy2(contract_text_path, ai_contract_path)
            print(f"📋 契約已複製到:  {ai_contract_path}")
            
            # 步驟 2: 執行 AI 分析（傳遞語言參數）
            cmd = [
                self.python_executable,      # Python 執行檔
                str(self.law_main_path),     # law_main.py
                str(ai_contract_path),       # 契約檔案路徑
                language                     # 🎯 語言參數
            ]
            
            print(f"🚀 執行命令: {' '.join(cmd)}")
            
            result = subprocess.run(
                cmd,
                cwd=str(self.ai_dir),
                capture_output=False,
                timeout=600,
                stdout=None,
                stderr=None
            )
            
            # 檢查執行狀態
            if result.returncode != 0:
                print(f"❌ AI 分析失敗，返回碼: {result.returncode}")
                raise Exception(f"AI 分析失敗，返回碼: {result.returncode}")
            
            print(f"✅ AI 執行完成")
            
            # 步驟 3: 等待並檢查報告
            report_path = self.ai_dir / "report.txt"
            
            for i in range(10):
                if report_path.exists():
                    file_size = report_path.stat().st_size
                    print(f"📄 找到報告: {report_path} (大小: {file_size} bytes)")
                    
                    if file_size > 100:  # 確保報告有內容
                        break
                    else:
                        print(f"⚠️ 報告檔案過小，繼續等待...")
                
                print(f"⏳ 等待報告生成...({i+1}/10)")
                time.sleep(1)
            
            if not report_path.exists():
                raise Exception("找不到分析報告檔案 report.txt")
            
            if report_path.stat().st_size < 100:
                raise Exception("報告檔案過小或為空")
            
            return str(report_path)
            
        except subprocess.TimeoutExpired:
            print("❌ AI 分析超時（超過 10 分鐘）")
            raise Exception("AI 分析超時")
        except Exception as e:
            print(f"❌ 分析過程失敗: {e}")
            raise Exception(f"契約分析失敗:  {str(e)}")
    
    async def get_report_content(self, report_path: str) -> str:
        """讀取報告內容"""
        try: 
            with open(report_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            if not content or len(content) < 100:
                raise Exception("報告內容過短或為空")
            
            print(f"✅ 成功讀取報告，長度: {len(content)} 字元")
            return content
        except Exception as e:
            raise Exception(f"無法讀取報告: {str(e)}")
    
    async def parse_report_to_json(self, report_content: str, language: str, timestamp: int, extracted_text: str, contract_filename: str) -> dict:
        """解析報告為結構化 JSON（支援多語言）"""
        print(f"📊 解析報告為 JSON 格式...")
        
        try:
            # 提取違規項目
            violations = []
            violation_pattern = r'【違規項目\s*(\d+)】(.*?)(?=【違規項目|\n=|$)'
            matches = re.findall(violation_pattern, report_content, re.DOTALL)
            
            for idx, (violation_num, content) in enumerate(matches, 1):
                # 提取各個部分
                original_match = re.search(r'1\.\s*違法條款原文[: ：](.*?)(?=2\.|$)', content, re.DOTALL)
                laws_match = re.search(r'2\.\s*違反法規[: ：](.*?)(?=3\.|$)', content, re.DOTALL)
                reason_match = re.search(r'3\.\s*違法原因[:：](.*?)(?=4\.|$)', content, re.DOTALL)
                suggestion_match = re.search(r'4\.\s*修改建議[:：](.*?)(?=$|---)', content, re.DOTALL)
                
                original_text = original_match.group(1).strip() if original_match else ''
                violated_laws_str = laws_match.group(1).strip() if laws_match else ''
                
                # 分割法規（用；或\n分割）
                violated_laws = [l.strip() for l in re.split(r'[；\n]', violated_laws_str) if l.strip()]
                
                violation = {
                    'id': idx,
                    'originalText': original_text[: 200],  # 限制長度
                    'violatedLaws': violated_laws[: 3],    # 最多 3 個法規
                    'reason': reason_match.group(1).strip()[:300] if reason_match else '',
                    'suggestion': suggestion_match.group(1).strip()[:300] if suggestion_match else '',
                }
                violations.append(violation)
            
            # 提取相關法條
            related_laws = []
            laws_section_match = re.search(r'本次審查參考法規條文.*?\n={10,}(.*?)$', report_content, re.DOTALL)
            
            if laws_section_match: 
                laws_content = laws_section_match.group(1)
                law_pattern = r'(\d+)\.\s*【問題】(.*?)【法規依據】(.*?)(?:罰則|來源)(.*?)(?=\n\d+\.|$)'
                law_matches = re.findall(law_pattern, laws_content, re.DOTALL)
                
                for idx, (num, question, basis, penalty_and_source) in enumerate(law_matches[: 5], 1):
                    # 分離罰則和來源
                    penalty_match = re.search(r'罰則[: ：](.*?)(?:來源|【|$)', penalty_and_source, re.DOTALL)
                    source_match = re.search(r'來源[:：]\s*(\S+)', penalty_and_source)
                    
                    related_law = {
                        'id':  idx,
                        'question': question.strip()[:150],
                        'lawBasis': basis.strip()[:200],
                        'penalty': penalty_match.group(1).strip()[:200] if penalty_match else '',
                        'explanation': '',
                        'source': source_match.group(1).strip() if source_match else 'new_law.json',
                    }
                    related_laws.append(related_law)
            
            # 判斷嚴重程度
            total_violations = len(violations)
            if total_violations == 0:
                severity = 'low'
                overall_status = 'compliant'
            elif total_violations <= 2:
                severity = 'medium'
                overall_status = 'non-compliant'
            else: 
                severity = 'high'
                overall_status = 'non-compliant'
            
            # 多語言標題
            titles = {
                'zh-TW': '外籍勞工聘僱契約審查報告',
                'en': 'Foreign Worker Employment Contract Review Report',
                'id': 'Laporan Tinjauan Kontrak Pekerja Asing',
                'vi': 'Báo cáo Xem xét Hợp đồng Lao động Nước ngoài',
                'tl': 'Ulat sa Pagsusuri ng Kontrata sa Trabaho ng Dayuhan',
                'th': 'รายงานการตรวจสอบสัญญาจ้างแรงงานต่างชาติ',
            }
            
            structured_report = {
                'report_id': f'report-{timestamp}',
                'extracted_text_length': len(extracted_text),
                'language': language,
                'title': titles.get(language, titles['zh-TW']),
                'review_date': datetime.now().strftime('%Y-%m-%d'),
                'contract_file': contract_filename,
                'contract_length': len(extracted_text),
                'violations': violations,
                'related_laws': related_laws,
                'summary': {
                    'total_violations': total_violations,
                    'severity_level': severity,
                    'overall_status': overall_status,
                },
                'download_url': f'/api/contracts/download/report-{timestamp}.txt',
            }
            
            print(f"✅ 報告解析完成：{total_violations} 個違規項目，{len(related_laws)} 條相關法規")
            return structured_report
            
        except Exception as e:
            print(f"❌ 報告解析失敗: {e}")
            # 返回基本結構避免完全失敗
            return {
                'report_id': f'report-{timestamp}',
                'extracted_text_length':  len(extracted_text),
                'language': language,
                'title': '審查報告',
                'review_date': datetime.now().strftime('%Y-%m-%d'),
                'contract_file': contract_filename,
                'contract_length': len(extracted_text),
                'violations': [],
                'related_laws': [],
                'summary': {
                    'total_violations': 0,
                    'severity_level': 'unknown',
                    'overall_status': 'error',
                },
                'download_url': f'/api/contracts/download/report-{timestamp}.txt',
            }