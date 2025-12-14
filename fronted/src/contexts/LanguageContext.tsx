import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'zh-TW' | 'en' | 'id' | 'vi' | 'tl' | 'th';

interface LanguageOption {
  code:  Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageOption[] = [
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name:  'English', nativeName:  'English', flag: '🇺🇸' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag:   '🇮🇩' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'th', name:  'Thai', nativeName:  'ภาษาไทย', flag: '🇹🇭' },
];

type Translations = {
  [key in Language]: {
    title: string;
    subtitle:  string;
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
    offline:  string;
    connecting: string;
    relatedLaws: string;
    searchingLaws: string;
    foundArticle:  string;
    analyzingContract:  string;
    checkingCompliance: string;
    generatingReport: string;
    introduction: string;
    findings:  string;
    recommendations: string;
    conclusion: string;
    dragDrop: string;
    or:  string;
    violation: string;
    severity: string;
    severityHigh:  string;
    severityMedium: string;
    severityLow: string;
    noViolations: string;
    originalText: string;
    violatedLaws: string;
    reason: string;
    suggestion:  string;
    question: string;
    lawBasis: string;
    penalty: string;
    explanation: string;
    source:  string;
    copySuccess: string;
    downloadSuccess: string;
    character: string;
    reviewDate: string;
    contractFile: string;
    contractLength: string;
    statusFailed: string;
    statusPassed: string;
    compliantMessage: string;
    // 知識庫翻譯
    knowledgeBase: string;
    searchKnowledge: string;
    allCategories: string;
    common: string;
    salary: string;
    health: string;
    rights: string;
    safety: string;
    legal: string;
    noResults: string;
  };
};

export const translations:  Translations = {
  'zh-TW': {
    title: '使用FLAS，陪你把關每一份移工契約',
    subtitle: '智能合約分析，保障勞工權益',
    uploadTitle:  '上傳您的契約文件',
    uploadDescription: '拖放您的 PDF 或圖片檔案至此處',
    uploadButton:  '選擇檔案',
    supportedFormats: '支援格式：PDF、JPG、PNG',
    analyzing:  '正在分析中.. .',
    analysisComplete: '分析完成！',
    reportTitle: '分析報告',
    generatePdf: '產生 PDF',
    connectionStatus: '連接狀態',
    online:  '線上',
    offline:  '離線',
    connecting:  '連接中',
    relatedLaws: '相關法律',
    searchingLaws: '搜尋相關法律.. .',
    foundArticle: '發現條文',
    analyzingContract:  '分析契約.. .',
    checkingCompliance: '檢查合規性.. .',
    generatingReport: '生成報告.. .',
    introduction: '簡介',
    findings: '發現',
    recommendations: '建議',
    conclusion: '結論',
    dragDrop:  '拖放檔案到這裡',
    or:  '或',
    violation: '違規',
    severity: '嚴重程度',
    severityHigh: '高',
    severityMedium:  '中',
    severityLow: '低',
    noViolations: '無違規',
    originalText: '原始文本',
    violatedLaws: '違反的法律',
    reason: '原因',
    suggestion: '建議',
    question: '問題',
    lawBasis:  '法律基礎',
    penalty: '罰款',
    explanation:  '解釋',
    source: '來源',
    copySuccess: '已複製',
    downloadSuccess:  '下載成功',
    character:  '字元',
    reviewDate: '審查日期',
    contractFile: '契約檔案',
    contractLength: '契約長度',
    statusFailed: '未通過',
    statusPassed:  '已通過',
    compliantMessage: '符合規定',
    // 知識庫翻譯
    knowledgeBase:  '外籍勞工知識庫',
    searchKnowledge: '搜尋知識庫...',
    allCategories: '全部分類',
    common:  '常見問題',
    salary: '薪資與津貼',
    health: '健康與安全',
    rights: '權利與義務',
    safety: '工作安全',
    legal:  '法律保護',
    noResults: '未找到相關內容',
  },
  'en': {
    title: 'Use FLAS, protect every migrant worker contract',
    subtitle: 'Intelligent contract analysis, protect labor rights',
    uploadTitle: 'Upload Your Contract Document',
    uploadDescription: 'Drag and drop your PDF or image file here',
    uploadButton:  'Choose File',
    supportedFormats: 'Supported formats: PDF, JPG, PNG',
    analyzing: 'Analyzing...',
    analysisComplete: 'Analysis Complete!',
    reportTitle: 'Analysis Report',
    generatePdf: 'Generate PDF',
    connectionStatus: 'Connection Status',
    online: 'Online',
    offline: 'Offline',
    connecting: 'Connecting',
    relatedLaws: 'Related Laws',
    searchingLaws: 'Searching related laws...',
    foundArticle: 'Found Article',
    analyzingContract: 'Analyzing contract...',
    checkingCompliance: 'Checking compliance...',
    generatingReport: 'Generating report...',
    introduction: 'Introduction',
    findings: 'Findings',
    recommendations: 'Recommendations',
    conclusion: 'Conclusion',
    dragDrop: 'Drag files here',
    or: 'or',
    violation: 'Violation',
    severity: 'Severity',
    severityHigh: 'High',
    severityMedium: 'Medium',
    severityLow: 'Low',
    noViolations: 'No Violations',
    originalText: 'Original Text',
    violatedLaws: 'Violated Laws',
    reason: 'Reason',
    suggestion: 'Suggestion',
    question: 'Question',
    lawBasis: 'Law Basis',
    penalty: 'Penalty',
    explanation: 'Explanation',
    source: 'Source',
    copySuccess: 'Copied',
    downloadSuccess: 'Download Started',
    character: 'Characters',
    reviewDate: 'Review Date',
    contractFile: 'Contract File',
    contractLength: 'Contract Length',
    statusFailed: 'Failed',
    statusPassed: 'Passed',
    compliantMessage: 'Compliant',
    // 知識庫翻譯
    knowledgeBase:  'Migrant Worker Knowledge Base',
    searchKnowledge: 'Search knowledge base...',
    allCategories: 'All Categories',
    common: 'Common Questions',
    salary: 'Salary & Benefits',
    health: 'Health & Safety',
    rights: 'Rights & Obligations',
    safety: 'Work Safety',
    legal: 'Legal Protection',
    noResults:  'No results found',
  },
  'id': {
    title: 'Gunakan FLAS, lindungi setiap kontrak pekerja migran',
    subtitle: 'Analisis kontrak cerdas, lindungi hak tenaga kerja',
    uploadTitle:  'Unggah Dokumen Kontrak Anda',
    uploadDescription: 'Seret dan lepas file PDF atau gambar Anda di sini',
    uploadButton: 'Pilih File',
    supportedFormats: 'Format yang didukung: PDF, JPG, PNG',
    analyzing: 'Menganalisis...',
    analysisComplete: 'Analisis Selesai!',
    reportTitle: 'Laporan Analisis',
    generatePdf: 'Buat PDF',
    connectionStatus: 'Status Koneksi',
    online: 'Daring',
    offline: 'Luring',
    connecting: 'Menghubungkan',
    relatedLaws: 'Hukum Terkait',
    searchingLaws: 'Mencari hukum terkait...',
    foundArticle: 'Artikel Ditemukan',
    analyzingContract: 'Menganalisis kontrak...',
    checkingCompliance: 'Memeriksa kepatuhan...',
    generatingReport: 'Menghasilkan laporan...',
    introduction: 'Pengenalan',
    findings: 'Temuan',
    recommendations: 'Rekomendasi',
    conclusion: 'Kesimpulan',
    dragDrop: 'Seret file di sini',
    or: 'atau',
    violation: 'Pelanggaran',
    severity:  'Tingkat Keparahan',
    severityHigh: 'Tinggi',
    severityMedium:  'Sedang',
    severityLow: 'Rendah',
    noViolations: 'Tanpa Pelanggaran',
    originalText: 'Teks Asli',
    violatedLaws: 'Hukum yang Dilanggar',
    reason: 'Alasan',
    suggestion: 'Saran',
    question: 'Pertanyaan',
    lawBasis: 'Dasar Hukum',
    penalty: 'Hukuman',
    explanation: 'Penjelasan',
    source: 'Sumber',
    copySuccess: 'Disalin',
    downloadSuccess:  'Unduhan Dimulai',
    character: 'Karakter',
    reviewDate: 'Tanggal Tinjauan',
    contractFile: 'File Kontrak',
    contractLength: 'Panjang Kontrak',
    statusFailed: 'Gagal',
    statusPassed:  'Lewat',
    compliantMessage:  'Mematuhi',
    // 知識庫翻譯
    knowledgeBase: 'Basis Pengetahuan Pekerja Migran',
    searchKnowledge: 'Cari basis pengetahuan.. .',
    allCategories: 'Semua Kategori',
    common: 'Pertanyaan Umum',
    salary: 'Gaji & Tunjangan',
    health: 'Kesehatan & Keselamatan',
    rights:  'Hak & Kewajiban',
    safety:  'Keselamatan Kerja',
    legal: 'Perlindungan Hukum',
    noResults: 'Tidak ada hasil yang ditemukan',
  },
  'vi': {
    title: 'Sử dụng FLAS, bảo vệ mỗi hợp đồng lao động nước ngoài',
    subtitle: 'Phân tích hợp đồng thông minh, bảo vệ quyền lao động',
    uploadTitle: 'Tải lên Tài liệu Hợp đồng của Bạn',
    uploadDescription: 'Kéo và thả tệp PDF hoặc hình ảnh của bạn ở đây',
    uploadButton: 'Chọn Tệp',
    supportedFormats: 'Định dạng được hỗ trợ: PDF, JPG, PNG',
    analyzing: 'Đang phân tích...',
    analysisComplete: 'Phân tích Hoàn thành!',
    reportTitle: 'Báo cáo Phân tích',
    generatePdf: 'Tạo PDF',
    connectionStatus: 'Trạng thái Kết nối',
    online: 'Trực tuyến',
    offline: 'Ngoại tuyến',
    connecting: 'Đang kết nối',
    relatedLaws: 'Luật Liên quan',
    searchingLaws: 'Tìm kiếm các luật liên quan...',
    foundArticle: 'Bài Viết Được Tìm thấy',
    analyzingContract: 'Phân tích hợp đồng...',
    checkingCompliance: 'Kiểm tra tuân thủ...',
    generatingReport: 'Tạo báo cáo...',
    introduction: 'Giới thiệu',
    findings: 'Phát hiện',
    recommendations:  'Khuyến nghị',
    conclusion: 'Kết luận',
    dragDrop: 'Kéo tệp vào đây',
    or:  'hoặc',
    violation: 'Vi phạm',
    severity: 'Mức độ Nghiêm trọng',
    severityHigh: 'Cao',
    severityMedium: 'Trung bình',
    severityLow: 'Thấp',
    noViolations: 'Không có Vi phạm',
    originalText: 'Văn bản Gốc',
    violatedLaws: 'Luật bị Vi phạm',
    reason:  'Lý do',
    suggestion: 'Gợi ý',
    question: 'Câu hỏi',
    lawBasis: 'Cơ sở Pháp luật',
    penalty: 'Xử phạt',
    explanation: 'Giải thích',
    source:  'Nguồn',
    copySuccess: 'Đã Sao chép',
    downloadSuccess: 'Tải về Bắt đầu',
    character: 'Ký tự',
    reviewDate: 'Ngày Xem xét',
    contractFile: 'Tệp Hợp đồng',
    contractLength: 'Độ dài Hợp đồng',
    statusFailed: 'Thất bại',
    statusPassed: 'Vượt qua',
    compliantMessage:  'Tuân thủ',
    // 知識庫翻譯
    knowledgeBase: 'Cơ sở Kiến thức Lao động Nước ngoài',
    searchKnowledge: 'Tìm kiếm cơ sở kiến thức...',
    allCategories: 'Tất cả Danh mục',
    common: 'Câu hỏi Thường gặp',
    salary: 'Lương & Trợ cấp',
    health: 'Sức khỏe & An toàn',
    rights:  'Quyền & Trách vụ',
    safety: 'An toàn Công việc',
    legal: 'Bảo vệ Pháp luật',
    noResults: 'Không tìm thấy kết quả',
  },
  'tl': {
    title: 'Gamitin ang FLAS, protektahan ang bawat kontrata ng migrant worker',
    subtitle: 'Matalinong pagsusuri ng kontrata, protektahan ang karapatan ng manggagawa',
    uploadTitle: 'I-upload ang Iyong Dokumento ng Kontrata',
    uploadDescription: 'I-drag at i-drop ang iyong PDF o larawan dito',
    uploadButton: 'Pumili ng File',
    supportedFormats:  'Mga Format na Sinusuportahan: PDF, JPG, PNG',
    analyzing: 'Sinusuri.. .',
    analysisComplete: 'Tapos na ang Pagsusuri!',
    reportTitle: 'Ulat ng Pagsusuri',
    generatePdf: 'Lumikha ng PDF',
    connectionStatus: 'Status ng Koneksyon',
    online: 'Online',
    offline: 'Offline',
    connecting:  'Kumokonekta',
    relatedLaws: 'Kaugnay na Batas',
    searchingLaws: 'Naghahanap ng kaugnay na batas...',
    foundArticle: 'Nahanap na Artikulo',
    analyzingContract:  'Sinusuri ang kontrata...',
    checkingCompliance: 'Sinusuri ang pagsunod...',
    generatingReport: 'Lumilikha ng ulat...',
    introduction: 'Pambungad',
    findings: 'Mga Natuklasan',
    recommendations: 'Mga Rekomendasyon',
    conclusion:  'Konklusyon',
    dragDrop: 'I-drag ang mga file dito',
    or: 'o',
    violation: 'Pagsasawalang-batas',
    severity: 'Antas ng Kalubhaan',
    severityHigh:  'Mataas',
    severityMedium: 'Katamtaman',
    severityLow:  'Mababa',
    noViolations:  'Walang Pagsasawalang-batas',
    originalText: 'Orihinal na Teksto',
    violatedLaws: 'Batas na Nilabag',
    reason: 'Dahilan',
    suggestion: 'Mungkahi',
    question: 'Tanong',
    lawBasis:  'Batayan ng Batas',
    penalty: 'Multa',
    explanation: 'Paliwanag',
    source: 'Pinagkukunan',
    copySuccess:  'Kinopya',
    downloadSuccess: 'Nagsimula ang Pag-download',
    character:  'Karakter',
    reviewDate: 'Petsa ng Pagsusuri',
    contractFile: 'File ng Kontrata',
    contractLength: 'Haba ng Kontrata',
    statusFailed: 'Nabigo',
    statusPassed: 'Lumampas',
    compliantMessage:  'Sumusunod',
    // 知識庫翻譯
    knowledgeBase: 'Knowledge Base ng Migrant Workers',
    searchKnowledge: 'Maghanap sa knowledge base...',
    allCategories: 'Lahat ng Kategorya',
    common: 'Mga Madalas na Katanungan',
    salary:  'Sahod & Allowance',
    health: 'Kalusugan & Kaligtasan',
    rights: 'Karapatan & Obligasyon',
    safety: 'Kaligtasan sa Trabaho',
    legal:  'Proteksyon sa Batas',
    noResults: 'Walang nahanap na resulta',
  },
  'th': {
    title:  'ใช้ FLAS ปกป้องสัญญาแรงงานต่างชาติทุกฉบับ',
    subtitle: 'วิเคราะห์สัญญาที่ชาญฉลาด ปกป้องสิทธิแรงงาน',
    uploadTitle: 'อัปโหลดเอกสารสัญญาของคุณ',
    uploadDescription: 'ลากและวางไฟล์ PDF หรือภาพของคุณที่นี่',
    uploadButton: 'เลือกไฟล์',
    supportedFormats: 'รูปแบบที่รองรับ: PDF, JPG, PNG',
    analyzing:  'กำลังวิเคราะห์...',
    analysisComplete: 'วิเคราะห์เสร็จสิ้น!',
    reportTitle: 'รายงานการวิเคราะห์',
    generatePdf: 'สร้าง PDF',
    connectionStatus:  'สถานะการเชื่อมต่อ',
    online: 'ออนไลน์',
    offline: 'ออฟไลน์',
    connecting: 'กำลังเชื่อมต่อ',
    relatedLaws: 'กฎหมายที่เกี่ยวข้อง',
    searchingLaws: 'ค้นหากฎหมายที่เกี่ยวข้อง...',
    foundArticle: 'พบบทความ',
    analyzingContract: 'วิเคราะห์สัญญา...',
    checkingCompliance: 'ตรวจสอบการปฏิบัติตาม.. .',
    generatingReport: 'กำลังสร้างรายงาน...',
    introduction: 'บทนำ',
    findings: 'ผลการค้นหา',
    recommendations: 'คำแนะนำ',
    conclusion: 'บทสรุป',
    dragDrop: 'ลากไฟล์มาที่นี่',
    or: 'หรือ',
    violation: 'การละเมิด',
    severity: 'ความรุนแรง',
    severityHigh: 'สูง',
    severityMedium: 'ปานกลาง',
    severityLow:  'ต่ำ',
    noViolations: 'ไม่มีการละเมิด',
    originalText: 'ข้อความต้นฉบับ',
    violatedLaws: 'กฎหมายที่ถูกละเมิด',
    reason: 'เหตุผล',
    suggestion: 'คำแนะนำ',
    question: 'คำถาม',
    lawBasis: 'พื้นฐานทางกฎหมาย',
    penalty: 'บทลงโทษ',
    explanation: 'คำอธิบาย',
    source: 'แหล่งที่มา',
    copySuccess: 'คัดลอกแล้ว',
    downloadSuccess: 'เริ่มดาวน์โหลด',
    character:  'ตัวอักษร',
    reviewDate: 'วันที่ตรวจสอบ',
    contractFile: 'ไฟล์สัญญา',
    contractLength: 'ความยาวสัญญา',
    statusFailed: 'ล้มเหลว',
    statusPassed: 'ผ่าน',
    compliantMessage:  'ปฏิบัติตามข้อกำหนด',
    // 知識庫翻譯
    knowledgeBase: 'ฐานความรู้แรงงานต่างชาติ',
    searchKnowledge:  'ค้นหาฐานความรู้.. .',
    allCategories: 'หมวดหมู่ทั้งหมด',
    common: 'คำถามที่พบบ่อย',
    salary: 'เงินเดือนและเบี้ยเลี้ยง',
    health: 'สุขภาพและความปลอดภัย',
    rights: 'สิทธิและหน้าที่',
    safety: 'ความปลอดภัยในการทำงาน',
    legal: 'การคุ้มครองทางกฎหมาย',
    noResults: 'ไม่พบผลลัพธ์',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations['zh-TW']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh-TW');

  const t = (key: keyof Translations['zh-TW']): string => {
    return translations[language]?.[key] || translations['zh-TW'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};