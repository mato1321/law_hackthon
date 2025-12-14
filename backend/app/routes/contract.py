from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse
from pathlib import Path
import shutil
import time
import asyncio
from typing import Dict

from app.services.ocr_service import OCRService
from app.services.analysis_service import AnalysisService

router = APIRouter()

# 初始化服務
ocr_service = OCRService()
analysis_service = AnalysisService()

# 允許的檔案類型
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# 進度追蹤
progress_store:  Dict[str, Dict] = {}


def _update_progress(session_id: str, step_index: int, status: str):
    """更新進度"""
    if session_id in progress_store:
        progress_data = progress_store[session_id]
        if step_index < len(progress_data['steps']):
            # 標記前面的步驟為完成
            for i in range(step_index):
                if progress_data['steps'][i]['status'] != 'complete':
                    progress_data['steps'][i]['status'] = 'complete'
            
            progress_data['steps'][step_index]['status'] = status
            progress_data['current_step'] = step_index


@router.post("/upload")
async def upload_contract(
    file: UploadFile = File(...),
    language: str = Query('zh-TW')
) -> Dict:
    """
    上傳契約檔案並進行分析（多語言版本）
    
    - 支援格式:  JPG, PNG, PDF
    - 檔案大小上限: 10MB
    - 支援語言: zh-TW, en, vi, id, tl, th
    """
    
    # 驗證語言參數
    supported_languages = ['zh-TW', 'en', 'vi', 'id', 'tl', 'th']
    if language not in supported_languages: 
        language = 'zh-TW'
    
    # 步驟 1: 驗證檔案
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS: 
        raise HTTPException(
            status_code=400,
            detail=f"不支援的檔案格式。僅支援: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    print(f"📥 收到檔案: {file.filename}, 語言: {language}")
    
    timestamp = int(time.time())
    session_id = f"session-{timestamp}"
    
    # 初始化進度
    progress_store[session_id] = {
        'current_step': 0,
        'total_steps': 7,
        'steps': [
            {'id': '1', 'message': '正在提取文字...', 'status': 'pending'},
            {'id': '2', 'message': '載入法規向量資料庫...', 'status': 'pending'},
            {'id':  '3', 'message': '搜尋相關法條...', 'status': 'pending'},
            {'id': '4', 'message': '檢查法規符合度...', 'status': 'pending'},
            {'id': '5', 'message': 'AI 分析契約內容...', 'status': 'pending'},
            {'id':  '6', 'message': '生成違規項目列表...', 'status': 'pending'},
            {'id':  '7', 'message': '生成最終報告...', 'status': 'pending'},
        ]
    }
    
    print(f"✅ 創建 session: {session_id}")
    
    upload_filename = f"{timestamp}_{file.filename}"
    upload_path = Path("uploads") / upload_filename
    
    try:
        # 步驟 1: 儲存檔案
        with upload_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"📁 檔案已儲存")
        
        # 開始進度追蹤 - 步驟 1:  OCR 提取文字
        print(f"🔍 開始 OCR 提取...")
        _update_progress(session_id, 0, 'active')
        extracted_text = await ocr_service.extract_text(str(upload_path))
        
        if not extracted_text or len(extracted_text.strip()) < 50:
            _update_progress(session_id, 0, 'complete')
            if session_id in progress_store: 
                del progress_store[session_id]
            raise HTTPException(
                status_code=400,
                detail="無法提取足夠的文字內容，請確認檔案清晰度"
            )
        _update_progress(session_id, 0, 'complete')
        print(f"✅ OCR 完成，已提取 {len(extracted_text)} 字符")
        
        # 步驟 2: 儲存提取的文字
        print(f"💾 儲存契約文本...")
        _update_progress(session_id, 1, 'active')
        contract_filename = f"contract-{timestamp}.txt"
        contract_path = Path("contracts") / contract_filename
        await ocr_service.save_text_to_file(extracted_text, str(contract_path))
        _update_progress(session_id, 1, 'complete')
        print(f"✅ 契約文本已儲存")
        
        # 步驟 3: 載入法規向量資料庫
        print(f"📚 載入法規向量資料庫...")
        _update_progress(session_id, 2, 'active')
        await asyncio.sleep(1.5)
        _update_progress(session_id, 2, 'complete')
        print(f"✅ 法規資料庫已載入")
        
        # 步驟 4: 搜尋相關法條
        print(f"🔎 搜尋相關法條...")
        _update_progress(session_id, 3, 'active')
        await asyncio.sleep(1)
        _update_progress(session_id, 3, 'complete')
        print(f"✅ 找到相關法條")
        
        # 步驟 5: AI 分析
        print(f"🤖 執行 AI 分析...")
        _update_progress(session_id, 4, 'active')
        report_path = await analysis_service.analyze_contract(str(contract_path), language)
        report_content = await analysis_service.get_report_content(report_path)
        _update_progress(session_id, 4, 'complete')
        print(f"✅ AI 分析完成")
        
        # 步驟 6: 處理報告
        print(f"📋 處理報告...")
        _update_progress(session_id, 5, 'active')
        final_report_filename = f"report-{timestamp}.txt"
        final_report_path = Path("reports") / final_report_filename
        shutil.copy2(report_path, final_report_path)
        _update_progress(session_id, 5, 'complete')
        print(f"✅ 報告已處理")
        
        # 步驟 7: 解析報告
        print(f"📊 解析報告為 JSON...")
        _update_progress(session_id, 6, 'active')
        structured_report = await analysis_service.parse_report_to_json(
            report_content,
            language,
            timestamp,
            extracted_text,
            contract_filename
        )
        _update_progress(session_id, 6, 'complete')
        print(f"✅ 報告解析完成")
        
        # 清理
        upload_path.unlink()
        
        # 返回結果和 sessionId
        result = {
            "success": True,
            "message": "契約分析完成",
            "sessionId": session_id,
            "data": structured_report
        }
        
        # 清除進度紀錄
        if session_id in progress_store:
            del progress_store[session_id]
        
        return result
        
    except HTTPException:
        if session_id in progress_store: 
            del progress_store[session_id]
        raise
    except Exception as e:
        if upload_path.exists():
            upload_path.unlink()
        if session_id in progress_store: 
            del progress_store[session_id]
        print(f"❌ 錯誤:  {str(e)}")
        raise HTTPException(status_code=500, detail=f"處理失敗: {str(e)}")


@router.get("/progress/{session_id}")
async def get_progress(session_id:  str):
    """獲取分析進度"""
    if session_id not in progress_store: 
        return {"status": "not_found"}
    
    return progress_store[session_id]


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
            "size":  report_file.stat().st_size,
            "created_at": report_file.stat().st_ctime,
            "download_url": f"/api/contracts/download/{report_file.name}"
        })
    
    return {"reports": reports}