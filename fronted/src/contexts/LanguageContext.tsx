import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'zh-TW' | 'en' | 'id' | 'vi' | 'tl' | 'th';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag:  '🇮🇩' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭' },
];

type Translations = {
  [key in Language]: {
    title: string;
    subtitle: string;
    uploadTitle: string;
    uploadDescription: string;
    uploadButton: string;
    supportedFormats: string;
    analyzing: string;
    analysisComplete: string;
    reportTitle:  string;
    generatePdf:  string;
    connectionStatus: string;
    online: string;
    offline: string;
    connecting: string;
    relatedLaws: string;
    searchingLaws: string;
    foundArticle: string;
    analyzingContract: string;
    checkingCompliance: string;
    generatingReport: string;
    introduction: string;
    findings:  string;
    recommendations: string;
    conclusion: string;
    dragDrop: string;
    or: string;
    // 新增報告相關翻譯
    violation: string;
    severity: string;
    severityHigh: string;
    severityMedium: string;
    severityLow: string;
    noViolations: string;
    originalText: string;
    violatedLaws: string;
    reason: string;
    suggestion: string;
    question: string;
    lawBasis: string;
    penalty: string;
    explanation: string;
    source: string;
    copySuccess: string;
    downloadSuccess: string;
    character: string;
    reviewDate: string;
    contractFile: string;
    contractLength: string;
    statusFailed: string;
    statusPassed: string;
    compliantMessage: string;
  };
};

export const translations: Translations = {
  'zh-TW': {
    title: '使用FLAS，陪你把關每一份移工契約',
    subtitle: '智能合約分析，保障勞工權益',
    uploadTitle:  '上傳您的契約文件',
    uploadDescription: '拖放您的 PDF 或圖片檔案至此處',
    uploadButton: '選擇檔案',
    supportedFormats: '支援格式：PDF、JPG、PNG',
    analyzing: '正在分析中.. .',
    analysisComplete: '分析完成',
    reportTitle: '契約審查報告',
    generatePdf: '匯出 PDF 報告',
    connectionStatus:  '連線狀態',
    online: '已連線',
    offline: '離線',
    connecting: '連線中',
    relatedLaws: '相關法條',
    searchingLaws: '正在搜尋相關法規.. .',
    foundArticle: '找到相關法條',
    analyzingContract: '正在分析契約內容...',
    checkingCompliance: '正在檢查法規符合度.. .',
    generatingReport: '正在生成審查報告...',
    introduction: '簡介',
    findings: '發現事項',
    recommendations: '建議',
    conclusion: '結論',
    dragDrop: '拖放檔案至此',
    or: '或',
    // 新增報告相關
    violation: '違規',
    severity: '嚴重程度',
    severityHigh: '🔴 高危險',
    severityMedium: '🟡 中風險',
    severityLow:  '🟢 低風險',
    noViolations: '✅ 本合約符合現行法規',
    originalText:  '違法條款原文',
    violatedLaws: '違反法規',
    reason: '違法原因',
    suggestion:  '修改建議',
    question:  '問題',
    lawBasis: '法規依據',
    penalty: '罰則',
    explanation: '說明',
    source: '來源',
    copySuccess: '已複製到剪貼簿',
    downloadSuccess: '報告已開始下載',
    character: '字',
    reviewDate: '審查日期',
    contractFile: '契約檔案',
    contractLength: '契約字數',
    statusFailed:  '不符合',
    statusPassed: '符合',
    compliantMessage:  '這份契約符合現行勞動法規及就業服務法的所有要求。',
  },
  'en': {
    title: 'Use FLAS to safeguard every migrant worker contract',
    subtitle:  'Smart contract analysis to protect worker rights',
    uploadTitle: 'Upload Your Contract',
    uploadDescription: 'Drag and drop your PDF or image files here',
    uploadButton: 'Select Files',
    supportedFormats: 'Supported formats: PDF, JPG, PNG',
    analyzing: 'Analyzing...',
    analysisComplete: 'Analysis Complete',
    reportTitle: 'Contract Review Report',
    generatePdf: 'Export PDF Report',
    connectionStatus: 'Connection Status',
    online: 'Online',
    offline: 'Offline',
    connecting: 'Connecting',
    relatedLaws: 'Related Laws',
    searchingLaws: 'Searching for relevant regulations...',
    foundArticle: 'Found related article',
    analyzingContract: 'Analyzing contract content...',
    checkingCompliance: 'Checking regulatory compliance...',
    generatingReport: 'Generating review report...',
    introduction: 'Introduction',
    findings: 'Findings',
    recommendations:  'Recommendations',
    conclusion: 'Conclusion',
    dragDrop: 'Drop files here',
    or: 'or',
    // 新增報告相關
    violation: 'Violation',
    severity: 'Severity',
    severityHigh: '🔴 High Risk',
    severityMedium: '🟡 Medium Risk',
    severityLow:  '🟢 Low Risk',
    noViolations: '✅ This contract complies with current regulations',
    originalText: 'Original Clause',
    violatedLaws: 'Violated Laws',
    reason: 'Reason for Violation',
    suggestion: 'Modification Suggestion',
    question: 'Question',
    lawBasis: 'Legal Basis',
    penalty: 'Penalty',
    explanation: 'Explanation',
    source:  'Source',
    copySuccess: 'Copied to clipboard',
    downloadSuccess: 'Report download started',
    character: 'characters',
    reviewDate: 'Review Date',
    contractFile: 'Contract File',
    contractLength: 'Contract Length',
    statusFailed: 'Non-compliant',
    statusPassed:  'Compliant',
    compliantMessage: 'This contract meets all requirements of current labor laws and employment service laws.',
  },
  'id': {
    title: 'Gunakan FLAS untuk menjaga setiap kontrak pekerja migran',
    subtitle: 'Analisis kontrak cerdas untuk melindungi hak pekerja',
    uploadTitle:  'Unggah Kontrak Anda',
    uploadDescription: 'Seret dan lepas file PDF atau gambar Anda di sini',
    uploadButton: 'Pilih File',
    supportedFormats: 'Format yang didukung: PDF, JPG, PNG',
    analyzing:  'Menganalisis...',
    analysisComplete: 'Analisis Selesai',
    reportTitle: 'Laporan Tinjauan Kontrak',
    generatePdf: 'Ekspor Laporan PDF',
    connectionStatus: 'Status Koneksi',
    online: 'Online',
    offline: 'Offline',
    connecting: 'Menghubungkan',
    relatedLaws: 'Hukum Terkait',
    searchingLaws: 'Mencari peraturan yang relevan...',
    foundArticle: 'Menemukan artikel terkait',
    analyzingContract: 'Menganalisis isi kontrak...',
    checkingCompliance: 'Memeriksa kepatuhan peraturan...',
    generatingReport: 'Membuat laporan tinjauan...',
    introduction: 'Pendahuluan',
    findings:  'Temuan',
    recommendations: 'Rekomendasi',
    conclusion: 'Kesimpulan',
    dragDrop: 'Letakkan file di sini',
    or: 'atau',
    // 新增報告相關
    violation: 'Pelanggaran',
    severity:  'Tingkat Keparahan',
    severityHigh: '🔴 Risiko Tinggi',
    severityMedium: '🟡 Risiko Menengah',
    severityLow: '🟢 Risiko Rendah',
    noViolations: '✅ Kontrak ini sesuai dengan peraturan saat ini',
    originalText:  'Klausa Asli',
    violatedLaws: 'Hukum yang Dilanggar',
    reason: 'Alasan Pelanggaran',
    suggestion: 'Saran Modifikasi',
    question: 'Pertanyaan',
    lawBasis: 'Dasar Hukum',
    penalty: 'Hukuman',
    explanation: 'Penjelasan',
    source: 'Sumber',
    copySuccess: 'Disalin ke papan klip',
    downloadSuccess: 'Unduhan laporan dimulai',
    character: 'karakter',
    reviewDate: 'Tanggal Tinjauan',
    contractFile: 'File Kontrak',
    contractLength: 'Panjang Kontrak',
    statusFailed: 'Tidak Sesuai',
    statusPassed: 'Sesuai',
    compliantMessage:  'Kontrak ini memenuhi semua persyaratan hukum ketenagakerjaan saat ini dan undang-undang layanan ketenagakerjaan.',
  },
  'vi': {
    title: 'Sử dụng FLAS để bảo vệ mọi hợp đồng lao động di cư',
    subtitle: 'Phân tích hợp đồng thông minh để bảo vệ quyền lợi người lao động',
    uploadTitle:  'Tải lên Hợp đồng của bạn',
    uploadDescription: 'Kéo và thả file PDF hoặc hình ảnh của bạn vào đây',
    uploadButton: 'Chọn tệp',
    supportedFormats: 'Định dạng hỗ trợ: PDF, JPG, PNG',
    analyzing: 'Đang phân tích...',
    analysisComplete: 'Phân tích hoàn tất',
    reportTitle: 'Báo cáo Xem xét Hợp đồng',
    generatePdf: 'Xuất Báo cáo PDF',
    connectionStatus: 'Trạng thái Kết nối',
    online: 'Trực tuyến',
    offline: 'Ngoại tuyến',
    connecting: 'Đang kết nối',
    relatedLaws: 'Luật liên quan',
    searchingLaws: 'Đang tìm kiếm quy định liên quan...',
    foundArticle: 'Tìm thấy điều khoản liên quan',
    analyzingContract: 'Đang phân tích nội dung hợp đồng...',
    checkingCompliance: 'Đang kiểm tra tuân thủ quy định...',
    generatingReport: 'Đang tạo báo cáo xem xét...',
    introduction: 'Giới thiệu',
    findings: 'Phát hiện',
    recommendations: 'Khuyến nghị',
    conclusion: 'Kết luận',
    dragDrop: 'Thả file vào đây',
    or: 'hoặc',
    // 新增報告相關
    violation: 'Vi phạm',
    severity: 'Mức độ Nghiêm trọng',
    severityHigh: '🔴 Rủi ro Cao',
    severityMedium: '🟡 Rủi ro Trung bình',
    severityLow:  '🟢 Rủi ro Thấp',
    noViolations: '✅ Hợp đồng này tuân thủ các quy định hiện hành',
    originalText: 'Điều khoản Gốc',
    violatedLaws: 'Luật bị Vi phạm',
    reason:  'Lý do Vi phạm',
    suggestion: 'Đề xuất Sửa đổi',
    question: 'Câu hỏi',
    lawBasis: 'Cơ sở Pháp lý',
    penalty: 'Hình phạt',
    explanation: 'Giải thích',
    source:  'Nguồn',
    copySuccess: 'Đã sao chép vào bộ nhớ tạm',
    downloadSuccess: 'Tải xuống báo cáo đã bắt đầu',
    character: 'ký tự',
    reviewDate: 'Ngày Xem xét',
    contractFile: 'Tệp Hợp đồng',
    contractLength: 'Độ dài Hợp đồng',
    statusFailed: 'Không tuân thủ',
    statusPassed: 'Tuân thủ',
    compliantMessage: 'Hợp đồng này tuân thủ tất cả các yêu cầu của luật lao động và luật dịch vụ việc làm hiện hành.',
  },
  'tl': {
    title: 'Gamitin ang FLAS upang pangalagaan ang bawat kontrata ng migranteng manggagawa',
    subtitle: 'Matalinong pagsusuri ng kontrata para protektahan ang mga karapatan ng manggagawa',
    uploadTitle: 'I-upload ang iyong Kontrata',
    uploadDescription:  'I-drag at i-drop ang iyong PDF o mga larawan dito',
    uploadButton: 'Pumili ng mga File',
    supportedFormats:  'Mga suportadong format: PDF, JPG, PNG',
    analyzing: 'Sinusuri...',
    analysisComplete: 'Kumpleto na ang Pagsusuri',
    reportTitle: 'Ulat sa Pagsusuri ng Kontrata',
    generatePdf: 'I-export ang PDF na Ulat',
    connectionStatus: 'Katayuan ng Koneksyon',
    online: 'Online',
    offline: 'Offline',
    connecting: 'Kumokonekta',
    relatedLaws: 'Mga Kaugnay na Batas',
    searchingLaws: 'Naghahanap ng mga kaugnay na regulasyon...',
    foundArticle: 'Nahanap ang kaugnay na artikulo',
    analyzingContract:  'Sinusuri ang nilalaman ng kontrata...',
    checkingCompliance: 'Sinusuri ang pagsunod sa regulasyon...',
    generatingReport: 'Gumagawa ng ulat sa pagsusuri...',
    introduction: 'Panimula',
    findings: 'Mga Natuklasan',
    recommendations: 'Mga Rekomendasyon',
    conclusion:  'Konklusyon',
    dragDrop: 'Ihulog ang mga file dito',
    or: 'o',
    // 新增報告相關
    violation: 'Paglabag',
    severity: 'Lebel ng Panganib',
    severityHigh: '🔴 Mataas na Panganib',
    severityMedium: '🟡 Katamtamang Panganib',
    severityLow: '🟢 Mababang Panganib',
    noViolations: '✅ Ang kontratang ito ay sumusunod sa kasalukuyang regulasyon',
    originalText: 'Orihinal na Klawsa',
    violatedLaws: 'Batas na Nilabag',
    reason: 'Dahilan ng Paglabag',
    suggestion: 'Alok na Pagbabago',
    question: 'Tanong',
    lawBasis:  'Batayan ng Batas',
    penalty: 'Parusa',
    explanation: 'Paliwanag',
    source: 'Pinagkukunan',
    copySuccess:  'Kinopya sa clipboard',
    downloadSuccess: 'Nagsimulang mag-download ng ulat',
    character: 'mga character',
    reviewDate: 'Petsa ng Pagsusuri',
    contractFile: 'File ng Kontrata',
    contractLength: 'Haba ng Kontrata',
    statusFailed: 'Hindi Sumusunod',
    statusPassed: 'Sumusunod',
    compliantMessage: 'Ang kontratang ito ay sumusunod sa lahat ng mga kinakailangan ng kasalukuyang mga batas sa paggawa at batas sa serbisyong pang-empleyo.',
  },
  'th': {
    title:  'ใช้ FLAS เพื่อดูแลสัญญาแรงงานข้ามชาติทุกฉบับ',
    subtitle: 'การวิเคราะห์สัญญาอัจฉริยะเพื่อปกป้องสิทธิแรงงาน',
    uploadTitle: 'อัพโหลดสัญญาของคุณ',
    uploadDescription: 'ลากและวางไฟล์ PDF หรือรูปภาพของคุณที่นี่',
    uploadButton: 'เลือกไฟล์',
    supportedFormats: 'รูปแบบที่รองรับ: PDF, JPG, PNG',
    analyzing:  'กำลังวิเคราะห์...',
    analysisComplete: 'การวิเคราะห์เสร็จสิ้น',
    reportTitle: 'รายงานการตรวจสอบสัญญา',
    generatePdf: 'ส่งออกรายงาน PDF',
    connectionStatus: 'สถานะการเชื่อมต่อ',
    online:  'ออนไลน์',
    offline: 'ออฟไลน์',
    connecting: 'กำลังเชื่อมต่อ',
    relatedLaws: 'กฎหมายที่เกี่ยวข้อง',
    searchingLaws: 'กำลังค้นหาข้อบังคับที่เกี่ยวข้อง.. .',
    foundArticle: 'พบมาตราที่เกี่ยวข้อง',
    analyzingContract: 'กำลังวิเคราะห์เนื้อหาสัญญา...',
    checkingCompliance: 'กำลังตรวจสอบการปฏิบัติตามข้อบังคับ...',
    generatingReport: 'กำลังสร้างรายงานการตรวจสอบ...',
    introduction: 'บทนำ',
    findings: 'สิ่งที่พบ',
    recommendations: 'คำแนะนำ',
    conclusion: 'สรุป',
    dragDrop: 'วางไฟล์ที่นี่',
    or: 'หรือ',
    // 新增報告相關
    violation: 'การละเมิด',
    severity: 'ระดับความรุนแรง',
    severityHigh: '🔴 ความเสี่ยงสูง',
    severityMedium: '🟡 ความเสี่ยงปานกลาง',
    severityLow:  '🟢 ความเสี่ยงต่ำ',
    noViolations: '✅ สัญญานี้เป็นไปตามข้อบังคับปัจจุบัน',
    originalText: 'ข้อความต้นฉบับ',
    violatedLaws: 'กฎหมายที่ถูกละเมิด',
    reason: 'เหตุผลของการละเมิด',
    suggestion: 'ข้อเสนอแนะการแก้ไข',
    question: 'คำถาม',
    lawBasis: 'บทเด็ดขาดทางกฎหมาย',
    penalty: 'การลงโทษ',
    explanation: 'คำอธิบาย',
    source: 'แหล่งที่มา',
    copySuccess: 'คัดลอกไปยังคลิปบอร์ด',
    downloadSuccess: 'การดาวน์โหลดรายงานเริ่มต้น',
    character: 'ตัวอักษร',
    reviewDate: 'วันที่ตรวจสอบ',
    contractFile: 'ไฟล์สัญญา',
    contractLength: 'ความยาวสัญญา',
    statusFailed: 'ไม่เป็นไปตามข้อบังคับ',
    statusPassed: 'เป็นไปตามข้อบังคับ',
    compliantMessage: 'สัญญานี้เป็นไปตามข้อกำหนดทั้งหมดของกฎหมายแรงงานและกฎหมายบริการจ้างงานในปัจจุบัน',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh-TW');

  const t = (key: keyof Translations['en']): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};