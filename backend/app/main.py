from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

from app.routes import contract

# 建立必要的資料夾
for folder in ['uploads', 'contracts', 'reports']:
    Path(folder).mkdir(exist_ok=True)

app = FastAPI(
    title="外籍勞工契約審查系統 API",
    description="上傳契約圖片/PDF，自動進行 OCR 和法規分析",
    version="1.0.0"
)

# 🎯 修改 CORS 設定 - 允許多個來源
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite 預設
        "http://localhost:8080",  # 你目前使用的埠號
        "http://localhost:3000",  # 備用
        "http://127.0.0.1:8080",  # 備用
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
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        timeout_keep_alive=300
    )