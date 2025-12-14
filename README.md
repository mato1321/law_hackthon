# Foreign Labor Audit System (FLAS)

外籍勞工法規稽查系統 - 智能合約分析平台

## 專案概述

FLAS 是一個Web 應用，專門用於分析外籍勞工聘僱契約並檢查其法規符合度。結合 OCR、AI 和向量資料庫技術，為用戶提供詳細的契約審查報告。

### 主要功能

**契約文件上傳**    - 支援 PDF、JPG、PNG 格式  
**OCR 文字提取**    - 自動提取契約內容  
**AI 智能分析**     - 基於RAG的契約內容分析  
**法規符合度檢查**   - 檢查是否符合相關法規  
**實時進度追蹤**     - 顯示分析進度  
**多語言支援**       - 繁體中文、英文、印尼文、越南文、菲律賓文、泰文  
**報告生成與下載**    - 生成 PDF 報告並支援下載  

## 技術棧

### 前端
- **框架**: React 18
- **建構工具**: Vite 5
- **程式語言**: TypeScript
- **樣式**:  Tailwind CSS
- **UI 元件庫**: shadcn/ui (Radix UI)
- **PDF 生成**: html2pdf. js
- **路由**: React Router DOM
- **狀態管理**:  React Context API
- **圖示**: lucide-react

### 後端
- **框架**:  FastAPI (Python)
- **非同步支援**: asyncio
- **API 路由**: APIRouter
- **OCR 服務**: 集成 OCR 服務
- **AI 分析**: 自定義 AI 分析模組

### AI 模組
- **向量資料庫**: lawvector_db
- **法規知識庫**: 法律條款向量化存儲
- **分析引擎**: 自訂分析邏輯

## 系統需求

### 前端
- Node.js 18.x 或更高版本
- npm 9.x 或更高版本

### 後端
- Python 3.11 或更高版本
- pip 套件管理器

## 快速開始

### 前端設置

#### 1. 複製專案
```bash
git clone https://github.com/mato1321/law_hackthon.git
cd law_hackthon
```
#### 2. 進入前端資料夾

```bash
cd fronted
```

#### 3. 安裝依賴套件

```bash
npm install
```

#### 4. 啟動開發伺服器

```bash
npm run dev
```

開發伺服器將在 `http://localhost:5173` 啟動。

### 後端設置

#### 1. 進入後端資料夾
```bash
cd backend
```

#### 2. 建立虛擬環境
```bash
python -m venv venv
```

#### 3. 啟動虛擬環境

##### Windows:
```bash
venv\Scripts\activate
```

##### macOS/Linux:
```bash
source venv/bin/activate
```

#### 4. 安裝依賴套件
```bash
pip install -r requirements.txt
```

#### 5. 啟動後端伺服器

##### Windows:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
後端伺服器將在 http://localhost:8000 啟動。

### AI 模組設置

#### 1. 進入 AI 資料夾
```bash
cd AI
```
#### 2. 建立虛擬環境

```bash
python -m venv venv
```
#### 3. 啟動虛擬環境

##### Windows:
```bash
venv\Scripts\activate
```

##### macOS/Linux:
```bash
source venv/bin/activate
```
#### 4. 安裝依賴套件
```bash
pip install -r requirements.txt
```

## 專案結構

```
law_hackthon/
├── fronted/                           # React 前端應用
│   ├── public/
│   ├── src/
│   │   ├── components/                # React 元件
│   │   │   ├── Header.tsx             # 頁面頭部
│   │   │   ├── FileUpload.tsx         # 檔案上傳
│   │   │   ├── AnalysisProgress.tsx   # 分析進度
│   │   │   └── BeautifulReportSection.tsx # 報告顯示
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx    # 多語言支援
│   │   ├── hooks/
│   │   │   └── use-toast.ts           # Toast 提示
│   │   ├── pages/
│   │   │   └── Index.tsx              # 主頁
│   │   ├── utils/
│   │   │   ├── api.ts                 # API 調用
│   │   │   └── pdfService.ts          # PDF 生成
│   │   ├── App.tsx
│   │   └── index. css
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                           # FastAPI 後端
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI 主程式
│   │   ├── routes/
│   │   │   └── contract.py            # 契約分析 API 路由
│   │   ├── services/
│   │   │   ├── ocr_service. py         # OCR 文字提取
│   │   │   └── analysis_service.py    # AI 分析服務
│   │   └── utils/
│   │       └── file_handler.py        # 檔案操作
│   ├── uploads/                       # 上傳檔案暫存
│   ├── contracts/                     # 提取的文字檔
│   ├── reports/                       # 生成的報告
│   ├── requirements.txt
│   ├── . env
│   └── venv/                          # Python 虛擬環境
│
├── AI/                                # AI 分析模組（獨立）
│   ├── law_main.py                    # AI 分析主程式
│   ├── documents/                     # 法規知識庫
│   ├── contracts/                     # AI 讀取契約的目錄
│   ├── lawvector_db/                  # 向量資料庫
│   ├── requirements.txt
│   └── venv/                          # Python 虛擬環境
│
└── README.md
```

## 貢獻指南

歡迎提交 Issue 和 Pull Request！

## 授權

MIT License