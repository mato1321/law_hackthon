import subprocess
import sys
import os
from pathlib import Path
import shutil
import platform
import time

class AnalysisService:
    """契約分析服務 - 呼叫 AI 模組"""
    
    def __init__(self):
        self.ai_dir = Path(__file__).parent. parent. parent. parent / "AI"
        self.law_main_path = self.ai_dir / "law_main.py"
        self.python_executable = self._get_ai_python()
        self.ai_contracts_dir = self.ai_dir / "contracts"
        self. ai_contracts_dir.mkdir(exist_ok=True)
        
        if not self.law_main_path.exists():
            raise Exception(f"找不到 AI 模組: {self.law_main_path}")
        
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
            print(f"🐍 使用 AI venv Python: {python_path}")
            return str(python_path)
        else:
            print(f"⚠️ 找不到 AI venv，使用系統 Python")
            return sys.executable
    
    async def analyze_contract(self, contract_text_path: str) -> str:
        """執行契約分析"""
        print(f"🔍 開始分析契約: {contract_text_path}")
        
        try:
            # 步驟 1: 複製契約到 AI 資料夾
            contract_filename = Path(contract_text_path).name
            ai_contract_path = self.ai_contracts_dir / contract_filename
            shutil.copy2(contract_text_path, ai_contract_path)
            print(f"📋 契約已複製到: {ai_contract_path}")
            
            # 步驟 2: 執行 AI 分析
            # 🎯 關鍵：傳遞契約檔案路徑作為命令列參數
            cmd = [
                self.python_executable,      # Python 執行檔
                str(self.law_main_path),     # law_main.py
                str(ai_contract_path)        # 🔧 契約檔案路徑 (sys.argv[1])
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
                raise Exception(f"AI 分析失敗，返回碼: {result. returncode}")
            
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
                
                print(f"⏳ 等待報告生成...  ({i+1}/10)")
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
            raise Exception(f"契約分析失敗: {str(e)}")
    
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