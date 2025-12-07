import pytesseract
from PIL import Image
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import os
from pathlib import Path
from typing import Optional

class OCRService:
    """OCR 文字辨識服務"""
    
    def __init__(self):
        # 如果是 Windows，需要指定 Tesseract 路徑
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass
    
    async def extract_text_from_image(self, image_path: str) -> str:
        """從圖片提取文字"""
        print(f"📷 開始 OCR 處理圖片: {image_path}")
        
        try:
            # 開啟圖片
            image = Image.open(image_path)
            
            # 使用繁體中文 + 英文辨識
            text = pytesseract.image_to_string(
                image,
                lang='chi_tra+eng',  # 繁體中文 + 英文
                config='--psm 6'      # 假設文字是統一的區塊
            )
            
            print(f"✅ OCR 完成，提取 {len(text)} 個字元")
            return text. strip()
            
        except Exception as e:
            print(f"❌ OCR 失敗: {e}")
            raise Exception(f"圖片文字辨識失敗: {str(e)}")
    
    async def extract_text_from_pdf(self, pdf_path: str) -> str:
        """從 PDF 提取文字"""
        print(f"📄 開始處理 PDF: {pdf_path}")
        
        try:
            reader = PdfReader(pdf_path)
            text = ""
            
            # 先嘗試直接提取文字（如果 PDF 有文字層）
            for page in reader. pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            # 如果提取的文字太少，可能是掃描版 PDF，需要 OCR
            if len(text. strip()) < 100:
                print("📷 PDF 可能是掃描版，使用 OCR 處理...")
                text = await self._ocr_pdf_images(pdf_path)
            
            print(f"✅ PDF 處理完成，提取 {len(text)} 個字元")
            return text.strip()
            
        except Exception as e:
            print(f"❌ PDF 處理失敗: {e}")
            raise Exception(f"PDF 文字提取失敗: {str(e)}")
    
    async def _ocr_pdf_images(self, pdf_path: str) -> str:
        """對掃描版 PDF 進行 OCR"""
        try:
            # 將 PDF 轉換為圖片
            images = convert_from_path(pdf_path)
            text = ""
            
            for i, image in enumerate(images):
                print(f"  處理第 {i+1}/{len(images)} 頁...")
                page_text = pytesseract. image_to_string(
                    image,
                    lang='chi_tra+eng',
                    config='--psm 6'
                )
                text += page_text + "\n"
            
            return text
            
        except Exception as e:
            raise Exception(f"PDF OCR 失敗: {str(e)}")
    
    async def extract_text(self, file_path: str) -> str:
        """自動判斷檔案類型並提取文字"""
        ext = Path(file_path).suffix.lower()
        
        if ext in ['.jpg', '.jpeg', '.png', '. bmp', '.tiff', '.webp']:
            return await self. extract_text_from_image(file_path)
        elif ext == '.pdf':
            return await self.extract_text_from_pdf(file_path)
        else:
            raise Exception(f"不支援的檔案格式: {ext}")
    
    async def save_text_to_file(self, text: str, output_path: str) -> None:
        """儲存文字到檔案"""
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"💾 文字已儲存至: {output_path}")