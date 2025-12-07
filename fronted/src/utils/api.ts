const API_BASE_URL = 'http://localhost:8000/api';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    report_id: string;
    extracted_text_length: number;
    report_preview: string;
    download_url: string;
  };
}

export interface Report {
  filename: string;
  size: number;
  created_at: number;
  download_url: string;
}

/**
 * 上傳契約檔案
 */
export async function uploadContract(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/contracts/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || '上傳失敗');
  }

  return response.json();
}

/**
 * 取得所有報告列表
 */
export async function getReports(): Promise<Report[]> {
  const response = await fetch(`${API_BASE_URL}/contracts/reports`);
  
  if (!response.ok) {
    throw new Error('取得報告列表失敗');
  }

  const data = await response.json();
  return data.reports;
}

/**
 * 下載報告
 */
export function downloadReport(filename: string): string {
  return `${API_BASE_URL}/contracts/download/${filename}`;
}