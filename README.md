# Foreign Labor Audit System

外籍勞工稽查系統 - 前端應用程式

## 技術棧

- **框架**: React 18
- **建構工具**: Vite
- **程式語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 元件庫**: shadcn/ui (Radix UI)
- **狀態管理**: TanStack React Query
- **路由**: React Router DOM
- **表單處理**: React Hook Form + Zod
- **圖表**: Recharts

## 系統需求

- Node. js 18. x 或更高版本
- npm 9.x 或更高版本

## 快速開始

### 1. 複製專案

```bash
git clone https://github.com/mato1321/law_hackthon.git
cd law_hackthon
```

### 2. 進入前端資料夾

```bash
cd fronted
```

### 3. 安裝依賴套件

```bash
npm install
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開發伺服器將在 `http://localhost:5173` 啟動。

## 可用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器（支援熱更新） |
| `npm run build` | 建構生產版本 |
| `npm run build:dev` | 建構開發版本 |
| `npm run preview` | 預覽建構後的版本 |
| `npm run lint` | 執行 ESLint 程式碼檢查 |

## 專案結構

```
law_hackthon/
├── fronted/              # React 前端
├── backend/              # FastAPI 後端
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI 主程式
│   │   ├── routes/
│   │   │   └── contract.py   # API 路由
│   │   ├── services/
│   │   │   ├── ocr_service.py      # OCR 服務
│   │   │   └── analysis_service.py # 呼叫 AI 模組
│   │   └── utils/
│   │       └── file_handler.py
│   ├── uploads/          # 暫存上傳檔案
│   ├── contracts/        # 提取的文字檔
│   ├── reports/          # 生成的報告
│   ├── requirements.txt
│   └── . env
├── AI/                   # 🎯 AI 分析模組（獨立）
│   ├── law_main.py       # 你的分析引擎
│   ├── documents/        # 法規知識庫
│   ├── contracts/        # AI 讀取契約的地方
│   ├── lawvector_db/     # 向量資料庫
│   └── requirements.txt
└── README.md```

## 建構生產版本

```bash
npm run build
```

建構完成後，生產版本檔案將輸出至 `dist/` 資料夾。

## 部署

建構完成後，可以將 `dist/` 資料夾中的內容部署至任何靜態網站託管服務，例如：

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages

## 授權

MIT License