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
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
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
    reportTitle: string;
    generatePdf: string;
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
    findings: string;
    recommendations: string;
    conclusion: string;
    dragDrop: string;
    or: string;
  };
};

export const translations: Translations = {
  'zh-TW': {
    title: '使用FLAS，陪你把關每一份移工契約',
    subtitle: '智能合約分析，保障勞工權益',
    uploadTitle: '上傳您的契約文件',
    uploadDescription: '拖放您的 PDF 或圖片檔案至此處',
    uploadButton: '選擇檔案',
    supportedFormats: '支援格式：PDF、JPG、PNG',
    analyzing: '正在分析中...',
    analysisComplete: '分析完成',
    reportTitle: '契約審查報告',
    generatePdf: '匯出 PDF 報告',
    connectionStatus: '連線狀態',
    online: '已連線',
    offline: '離線',
    connecting: '連線中',
    relatedLaws: '相關法條',
    searchingLaws: '正在搜尋相關法規...',
    foundArticle: '找到相關法條',
    analyzingContract: '正在分析契約內容...',
    checkingCompliance: '正在檢查法規符合度...',
    generatingReport: '正在生成審查報告...',
    introduction: '簡介',
    findings: '發現事項',
    recommendations: '建議',
    conclusion: '結論',
    dragDrop: '拖放檔案至此',
    or: '或',
  },
  'en': {
    title: 'Use FLAS to safeguard every migrant worker contract',
    subtitle: 'Smart contract analysis to protect worker rights',
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
    recommendations: 'Recommendations',
    conclusion: 'Conclusion',
    dragDrop: 'Drop files here',
    or: 'or',
  },
  'id': {
    title: 'Gunakan FLAS untuk menjaga setiap kontrak pekerja migran',
    subtitle: 'Analisis kontrak cerdas untuk melindungi hak pekerja',
    uploadTitle: 'Unggah Kontrak Anda',
    uploadDescription: 'Seret dan lepas file PDF atau gambar Anda di sini',
    uploadButton: 'Pilih File',
    supportedFormats: 'Format yang didukung: PDF, JPG, PNG',
    analyzing: 'Menganalisis...',
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
    findings: 'Temuan',
    recommendations: 'Rekomendasi',
    conclusion: 'Kesimpulan',
    dragDrop: 'Letakkan file di sini',
    or: 'atau',
  },
  'vi': {
    title: 'Sử dụng FLAS để bảo vệ mọi hợp đồng lao động di cư',
    subtitle: 'Phân tích hợp đồng thông minh để bảo vệ quyền lợi người lao động',
    uploadTitle: 'Tải lên Hợp đồng của bạn',
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
  },
  'tl': {
    title: 'Gamitin ang FLAS upang pangalagaan ang bawat kontrata ng migranteng manggagawa',
    subtitle: 'Matalinong pagsusuri ng kontrata para protektahan ang mga karapatan ng manggagawa',
    uploadTitle: 'I-upload ang iyong Kontrata',
    uploadDescription: 'I-drag at i-drop ang iyong PDF o mga larawan dito',
    uploadButton: 'Pumili ng mga File',
    supportedFormats: 'Mga suportadong format: PDF, JPG, PNG',
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
    analyzingContract: 'Sinusuri ang nilalaman ng kontrata...',
    checkingCompliance: 'Sinusuri ang pagsunod sa regulasyon...',
    generatingReport: 'Gumagawa ng ulat sa pagsusuri...',
    introduction: 'Panimula',
    findings: 'Mga Natuklasan',
    recommendations: 'Mga Rekomendasyon',
    conclusion: 'Konklusyon',
    dragDrop: 'Ihulog ang mga file dito',
    or: 'o',
  },
  'th': {
    title: 'ใช้ FLAS เพื่อดูแลสัญญาแรงงานข้ามชาติทุกฉบับ',
    subtitle: 'การวิเคราะห์สัญญาอัจฉริยะเพื่อปกป้องสิทธิแรงงาน',
    uploadTitle: 'อัพโหลดสัญญาของคุณ',
    uploadDescription: 'ลากและวางไฟล์ PDF หรือรูปภาพของคุณที่นี่',
    uploadButton: 'เลือกไฟล์',
    supportedFormats: 'รูปแบบที่รองรับ: PDF, JPG, PNG',
    analyzing: 'กำลังวิเคราะห์...',
    analysisComplete: 'การวิเคราะห์เสร็จสิ้น',
    reportTitle: 'รายงานการตรวจสอบสัญญา',
    generatePdf: 'ส่งออกรายงาน PDF',
    connectionStatus: 'สถานะการเชื่อมต่อ',
    online: 'ออนไลน์',
    offline: 'ออฟไลน์',
    connecting: 'กำลังเชื่อมต่อ',
    relatedLaws: 'กฎหมายที่เกี่ยวข้อง',
    searchingLaws: 'กำลังค้นหาข้อบังคับที่เกี่ยวข้อง...',
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
