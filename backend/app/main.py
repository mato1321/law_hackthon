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

# CORS 設定（讓前端可以呼叫）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite 開發伺服器
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 靜態檔案服務（用於下載報告）
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

@app. get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)