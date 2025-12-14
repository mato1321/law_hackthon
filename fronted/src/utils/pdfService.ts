interface ReportData {
  title: string;
  review_date: string;
  contract_file: string;
  contract_length: number;
  violations: Array<{
    id: number;
    originalText: string;
    violatedLaws: string[];
    reason: string;
    suggestion: string;
  }>;
  summary: {
    total_violations: number;
    severity_level: string;
    overall_status: string;
  };
}

export async function generatePDF(reportData:  ReportData, language: string = 'zh-TW'): Promise<Blob> {
  const html2pdf = (await import('html2pdf.js')).default;

  // 構建 HTML 內容
  const htmlContent = generateHTML(reportData, language);

  // 配置選項
  const options = {
    margin: 10,
    filename: `Contract-Review-${new Date().getTime()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF:  { orientation: 'portrait', unit: 'mm', format: 'a4' },
  };

  return new Promise((resolve, reject) => {
    try {
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';

      html2pdf()
        .set(options)
        .from(element)
        .outputPdf('blob')
        .then((blob: Blob) => {
          resolve(blob);
        })
        .catch((error: any) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

function generateHTML(reportData: ReportData, language:  string): string {
  const t = (key: string): string => {
    const translations:  Record<string, Record<string, string>> = {
      'zh-TW': {
        reviewSummary: '審查摘要',
        status: '狀態',
        compliant: '✅ 符合法規',
        nonCompliant: '⚠️ 不符合法規',
        violationsFound: '發現違規數',
        contractLength: '契約字數',
        severity: '嚴重程度',
        highRisk: '🔴 高危險',
        mediumRisk:  '🟡 中風險',
        lowRisk:  '🟢 低風險',
        violationsDetails: '違規項目詳情',
        violation: '違規',
        original: '原文',
        violatedLaws: '違反法規',
        reason: '原因',
        suggestion: '建議',
        compliantMessage: '✅ 本合約符合現行法規',
        reviewDate: '審查日期',
        generatedOn: '生成時間',
      },
      'en': {
        reviewSummary: 'Review Summary',
        status: 'Status',
        compliant: '✅ Compliant',
        nonCompliant: '⚠️ Non-compliant',
        violationsFound: 'Violations Found',
        contractLength: 'Contract Length',
        severity: 'Severity',
        highRisk: '🔴 High Risk',
        mediumRisk: '🟡 Medium Risk',
        lowRisk: '🟢 Low Risk',
        violationsDetails: 'Violations Details',
        violation: 'Violation',
        original: 'Original',
        violatedLaws: 'Violated Laws',
        reason: 'Reason',
        suggestion: 'Suggestion',
        compliantMessage:  '✅ This contract complies with current regulations',
        reviewDate: 'Review Date',
        generatedOn: 'Generated on',
      },
      'id': {
        reviewSummary: 'Ringkasan Tinjauan',
        status: 'Status',
        compliant:  '✅ Sesuai',
        nonCompliant: '⚠️ Tidak Sesuai',
        violationsFound: 'Pelanggaran Ditemukan',
        contractLength:  'Panjang Kontrak',
        severity: 'Tingkat Keparahan',
        highRisk: '🔴 Risiko Tinggi',
        mediumRisk: '🟡 Risiko Menengah',
        lowRisk: '🟢 Risiko Rendah',
        violationsDetails: 'Detail Pelanggaran',
        violation:  'Pelanggaran',
        original:  'Asli',
        violatedLaws: 'Hukum yang Dilanggar',
        reason: 'Alasan',
        suggestion: 'Saran',
        compliantMessage: '✅ Kontrak ini sesuai dengan peraturan saat ini',
        reviewDate:  'Tanggal Tinjauan',
        generatedOn: 'Dibuat pada',
      },
      'vi': {
        reviewSummary: 'Tóm Tắt Xem Xét',
        status: 'Trạng Thái',
        compliant: '✅ Tuân Thủ',
        nonCompliant: '⚠️ Không Tuân Thủ',
        violationsFound: 'Vi Phạm Được Tìm Thấy',
        contractLength:  'Độ Dài Hợp Đồng',
        severity: 'Mức Độ Nghiêm Trọng',
        highRisk: '🔴 Rủi Ro Cao',
        mediumRisk: '🟡 Rủi Ro Trung Bình',
        lowRisk:  '🟢 Rủi Ro Thấp',
        violationsDetails: 'Chi Tiết Vi Phạm',
        violation: 'Vi Phạm',
        original: 'Ban Đầu',
        violatedLaws: 'Luật Bị Vi Phạm',
        reason: 'Lý Do',
        suggestion: 'Đề Xuất',
        compliantMessage: '✅ Hợp đồng này tuân thủ các quy định hiện hành',
        reviewDate: 'Ngày Xem Xét',
        generatedOn: 'Được tạo vào',
      },
      'tl': {
        reviewSummary: 'Buod ng Pagsusuri',
        status:  'Katayuan',
        compliant: '✅ Sumusunod',
        nonCompliant: '⚠️ Hindi Sumusunod',
        violationsFound: 'Nahanap na Mga Paglabag',
        contractLength: 'Haba ng Kontrata',
        severity: 'Lebel ng Panganib',
        highRisk:  '🔴 Mataas na Panganib',
        mediumRisk: '🟡 Katamtamang Panganib',
        lowRisk: '🟢 Mababang Panganib',
        violationsDetails: 'Mga Detalye ng Paglabag',
        violation: 'Paglabag',
        original: 'Orihinal',
        violatedLaws: 'Batas na Nilabag',
        reason: 'Dahilan',
        suggestion: 'Alok',
        compliantMessage: '✅ Ang kontratang ito ay sumusunod sa kasalukuyang mga regulasyon',
        reviewDate:  'Petsa ng Pagsusuri',
        generatedOn: 'Ginawa noong',
      },
      'th': {
        reviewSummary: 'สรุปการตรวจสอบ',
        status: 'สถานะ',
        compliant:  '✅ เป็นไปตามข้อบังคับ',
        nonCompliant: '⚠️ ไม่เป็นไปตามข้อบังคับ',
        violationsFound:  'พบการละเมิด',
        contractLength: 'ความยาวสัญญา',
        severity: 'ระดับความรุนแรง',
        highRisk: '🔴 ความเสี่ยงสูง',
        mediumRisk: '🟡 ความเสี่ยงปานกลาง',
        lowRisk: '🟢 ความเสี่ยงต่ำ',
        violationsDetails: 'รายละเอียดการละเมิด',
        violation: 'การละเมิด',
        original: 'ต้นฉบับ',
        violatedLaws: 'กฎหมายที่ถูกละเมิด',
        reason: 'เหตุผล',
        suggestion: 'ข้อเสนอแนะ',
        compliantMessage: '✅ สัญญานี้เป็นไปตามข้อบังคับปัจจุบัน',
        reviewDate: 'วันที่ตรวจสอบ',
        generatedOn: 'สร้างเมื่อ',
      },
    };

    return translations[language]?.[key] || translations['zh-TW'][key] || key;
  };

  const isCompliant = reportData.summary.overall_status === 'compliant';
  const severityText =
    reportData.summary.severity_level === 'high'
      ? t('highRisk')
      : reportData.summary.severity_level === 'medium'
      ?  t('mediumRisk')
      : t('lowRisk');

  const statusText = isCompliant ? t('compliant') : t('nonCompliant');

  let violationsHTML = '';
  if (reportData.violations.length > 0) {
    violationsHTML = `
      <div style="margin-top: 20px; page-break-inside: avoid;">
        <h2 style="color: #dc2626; font-size: 14px; margin-bottom: 15px; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
          ${t('violationsDetails')}
        </h2>
        ${reportData.violations
          .map(
            (violation) => `
          <div style="margin-bottom:  15px; padding: 12px; background-color: #fee2e2; border-left: 4px solid #dc2626; page-break-inside: avoid;">
            <h3 style="color: #dc2626; font-size: 12px; margin-bottom: 10px;">
              ${t('violation')} #${violation.id}
            </h3>
            <p style="margin:  8px 0; font-size: 11px;">
              <strong>${t('original')}:</strong> "${violation.originalText}"
            </p>
            ${violation.violatedLaws.length > 0 ? `
              <p style="margin: 8px 0; font-size: 11px;">
                <strong>${t('violatedLaws')}:</strong> ${violation.violatedLaws.join('; ')}
              </p>
            ` : ''}
            <p style="margin: 8px 0; font-size:  11px;">
              <strong>${t('reason')}:</strong> ${violation.reason}
            </p>
            <p style="margin: 8px 0; font-size: 11px; color: #059669;">
              <strong>💡 ${t('suggestion')}:</strong> ${violation.suggestion}
            </p>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  } else {
    violationsHTML = `
      <div style="margin-top: 20px; padding: 15px; background-color: #dcfce7; border: 2px solid #22c55e; border-radius:  8px;">
        <p style="color: #059669; font-size: 12px; font-weight: bold;">
          ${t('compliantMessage')}
        </p>
      </div>
    `;
  }

  return `
    <! DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: 'Arial', 'Segoe UI', sans-serif;
            color: #333;
            line-height: 1.6;
          }
          h1 {
            text-align: center;
            color: #1f2937;
            font-size: 24px;
            margin-bottom:  10px;
          }
          .date {
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            margin-bottom:  20px;
          }
          .summary {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius:  8px;
            margin-bottom: 20px;
          }
          .summary-item {
            margin:  8px 0;
            font-size: 12px;
          }
          .summary-item strong {
            display: inline-block;
            width: 120px;
          }
          hr {
            margin: 20px 0;
            border:  none;
            border-top:  1px solid #e5e7eb;
          }
          .footer {
            text-align: center;
            color: #9ca3af;
            font-size: 10px;
            margin-top:  30px;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>${reportData.title}</h1>
        <div class="date">
          <strong>${t('reviewDate')}:</strong> ${reportData.review_date}
        </div>

        <div class="summary">
          <h2 style="font-size: 14px; margin-bottom: 12px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
            ${t('reviewSummary')}
          </h2>
          <div class="summary-item">
            <strong>${t('status')}:</strong> ${statusText}
          </div>
          <div class="summary-item">
            <strong>${t('violationsFound')}:</strong> ${reportData.summary.total_violations}
          </div>
          <div class="summary-item">
            <strong>${t('contractLength')}:</strong> ${reportData.contract_length}
          </div>
          <div class="summary-item">
            <strong>${t('severity')}:</strong> ${severityText}
          </div>
        </div>

        <hr />

        ${violationsHTML}

        <div class="footer">
          <p>${t('generatedOn')}: ${new Date().toLocaleString()}</p>
          <p>FLAS (Foreign Labor Audit System)</p>
        </div>
      </body>
    </html>
  `;
}

export function downloadPDF(blob:  Blob, filename: string = 'report.pdf') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 延遲後清理 URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}