import subprocess
import sys
import os
from pathlib import Path
import shutil

class AnalysisService:
    """契約分析服務 - 呼叫 AI 模組"""
    
    def __init__(self):
        # AI 模組的路徑
        self.ai_dir = Path(__file__).parent. parent. parent. parent / "AI"
        self. law_main_path = self.ai_dir / "law_main.py"
        
        # AI 模組的契約資料夾
        self.ai_contracts_dir = self.ai_dir / "contracts"
        self.ai_contracts_dir. mkdir(exist_ok=True)
        
        # 檢查 AI 模組是否存在
        if not self.law_main_path.exists():
            raise Exception(f"找不到 AI 模組: {self.law_main_path}")
        
        print(f"✅ AI 模組路徑: {self.ai_dir}")
    
    async def analyze_contract(self, contract_text_path: str) -> str:
        """
        執行契約分析
        
        Args:
            contract_text_path: 後端的契約文字檔路徑
            
        Returns:
            報告檔案路徑
        """
        print(f"🔍 開始分析契約: {contract_text_path}")
        
        try:
            # 步驟 1: 複製契約文字檔到 AI 的 contracts 資料夾
            contract_filename = Path(contract_text_path).name
            ai_contract_path = self.ai_contracts_dir / contract_filename
            shutil.copy2(contract_text_path, ai_contract_path)
            print(f"📋 契約已複製到 AI 模組: {ai_contract_path}")
            
            # 步驟 2: 執行 Python AI 分析腳本
            result = subprocess. run(
                [sys.executable, str(self.law_main_path)],
                cwd=str(self.ai_dir),  # 在 AI 資料夾下執行
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            
            # 檢查執行狀態
            if result.returncode != 0:
                print(f"❌ AI 分析失敗:")
                print(f"STDOUT: {result.stdout}")
                print(f"STDERR: {result.stderr}")
                raise Exception(f"AI 分析失敗: {result.stderr}")
            
            print(f"✅ AI 分析完成")
            print(f"輸出: {result.stdout}")
            
            # 步驟 3: 找到生成的報告
            report_path = self.ai_dir / "report.txt"
            if not report_path.exists():
                raise Exception("找不到分析報告檔案")
            
            return str(report_path)
            
        except Exception as e:
            print(f"❌ 分析過程失敗: {e}")
            raise Exception(f"契約分析失敗: {str(e)}")
    
    async def get_report_content(self, report_path: str) -> str:
        """讀取報告內容"""
        try:
            with open(report_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        except Exception as e:
            raise Exception(f"無法讀取報告: {str(e)}")