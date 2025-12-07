from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import shutil
import time
from typing import Dict

from app.services.ocr_service import OCRService
from app. services.analysis_service import AnalysisService

router = APIRouter()

# 初始化服務
ocr_service = OCRService()
analysis_service = AnalysisService()

# 允許的檔案類型
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '. png', '.pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router. post("/upload")
async def upload_contract(file: UploadFile = File(... )) -> Dict:
    """
    上傳契約檔案並進行分析
    
    - 支援格式: JPG, PNG, PDF
    - 檔案大小上限: 10MB
    """
    
    # 步驟 1: 驗證檔案
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"不支援的檔案格式。僅支援: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    print(f"📥 收到檔案: {file.filename}")
    
    # 步驟 2: 儲存上傳的檔案
    timestamp = int(time.time())
    upload_filename = f"{timestamp}_{file.filename}"
    upload_path = Path("uploads") / upload_filename
    
    try:
        with upload_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"檔案儲存失敗: {str(e)}")
    
    try:
        # 步驟 3: OCR 提取文字
        extracted_text = await ocr_service.extract_text(str(upload_path))
        
        if not extracted_text or len(extracted_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="無法提取足夠的文字內容，請確認檔案清晰度"
            )
        
        # 步驟 4: 儲存提取的文字
        contract_filename = f"contract-{timestamp}.txt"
        contract_path = Path("contracts") / contract_filename
        await ocr_service.save_text_to_file(extracted_text, str(contract_path))
        
        # 步驟 5: 呼叫 AI 分析
        report_path = await analysis_service.analyze_contract(str(contract_path))
        report_content = await analysis_service. get_report_content(report_path)
        
        # 步驟 6: 複製報告到 backend/reports 資料夾
        final_report_filename = f"report-{timestamp}.txt"
        final_report_path = Path("reports") / final_report_filename
        shutil.copy2(report_path, final_report_path)
        
        # 步驟 7: 清理上傳的檔案
        upload_path.unlink()
        
        # 步驟 8: 回傳結果
        return {
            "success": True,
            "message": "契約分析完成",
            "data": {
                "report_id": final_report_filename. replace('. txt', ''),
                "extracted_text_length": len(extracted_text),
                "report_preview": report_content,
                "download_url": f"/api/contracts/download/{final_report_filename}"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # 清理檔案
        if upload_path.exists():
            upload_path.unlink()
        raise HTTPException(status_code=500, detail=f"處理失敗: {str(e)}")


@router.get("/download/{filename}")
async def download_report(filename: str):
    """下載分析報告"""
    
    file_path = Path("reports") / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="報告不存在")
    
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type='text/plain'
    )


@router.get("/reports")
async def list_reports():
    """列出所有報告"""
    
    reports_dir = Path("reports")
    reports = []
    
    for report_file in reports_dir.glob("*.txt"):
        reports.append({
            "filename": report_file.name,
            "size": report_file. stat().st_size,
            "created_at": report_file.stat(). st_ctime,
            "download_url": f"/api/contracts/download/{report_file.name}"
        })
    
    return {"reports": reports}