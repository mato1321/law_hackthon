from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
import pytesseract
from PIL import Image
import platform
import sys

from app. routes import contract

# ============================================================================
# 🎯 強制設定 Tesseract 路徑 - Windows
# ============================================================================
# 在導入 pytesseract 後立即設定
TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# 檢查路徑是否存在
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.pytesseract_cmd = TESSERACT_PATH
    print(f"✅ Tesseract 路徑已設定:  {TESSERACT_PATH}")
else:
    print(f"❌ 找不到 Tesseract:  {TESSERACT_PATH}")
    print("請確保路徑正確或修改 TESSERACT_PATH 變數")
    sys.exit(1)  # 停止執行

# 驗證 Tesseract
try:
    version = pytesseract.get_tesseract_version()
    print(f"✅ Tesseract 版本驗證成功: {version}")
except Exception as e:
    print(f"❌ Tesseract 驗證失敗: {str(e)}")
    sys.exit(1)

# 建立必要的資料夾
for folder in ['uploads', 'contracts', 'reports']:
    Path(folder).mkdir(exist_ok=True)
    print(f"✅ 資料夾已確認: {folder}")

app = FastAPI(
    title="外籍勞工契約審查系統 API",
    description="上傳契約圖片/PDF，自動進行 OCR 和法規分析",
    version="1.0.0"
)

# 🎯 CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 靜態檔案服務
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

# 註冊路由
app.include_router(contract.router, prefix="/api/contracts", tags=["contracts"])

@app.get("/")
async def root():
    return {
        "message": "外籍勞工契約審查系統 API",
        "version": "1.0.0",
        "status":  "running",
        "tesseract_path": TESSERACT_PATH,
        "tesseract_found": os.path.exists(TESSERACT_PATH),
    }

@app.get("/health")
async def health_check():
    """健康檢查 - 包含 Tesseract 狀態"""
    tesseract_available = False
    tesseract_version = None
    
    try: 
        tesseract_version = pytesseract.get_tesseract_version()
        tesseract_available = True
    except Exception as e:
        tesseract_available = False
        print(f"❌ Tesseract 錯誤: {str(e)}")
    
    return {
        "status": "ok",
        "tesseract_available": tesseract_available,
        "tesseract_version": str(tesseract_version) if tesseract_available else "未安裝",
        "tesseract_path": TESSERACT_PATH,
        "system": platform.system(),
    }

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 啟動外籍勞工契約審查系統 API")
    print("="*60)
    print(f"📍 Tesseract 路徑: {TESSERACT_PATH}")
    print(f"✅ Tesseract 已驗證")
    print("="*60 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        timeout_keep_alive=300
    )