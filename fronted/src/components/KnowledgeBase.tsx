import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface KnowledgeItem {
  id: string;
  category: string;
  titleZh: string;
  titleEn: string;
  titleId: string;
  titleVi: string;
  titleTl: string;
  titleTh: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionId: string;
  descriptionVi: string;
  descriptionTl: string;
  descriptionTh: string;
  solutionZh: string;
  solutionEn: string;
  solutionId:  string;
  solutionVi: string;
  solutionTl: string;
  solutionTh: string;
}

const KnowledgeBase = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const knowledgeItems: KnowledgeItem[] = [
    // 常見問題
    {
      id:  'common-1',
      category: 'common',
      titleZh: '如何查詢我的合約條款？',
      titleEn: 'How to verify my contract terms?',
      titleId: 'Bagaimana cara memverifikasi syarat kontrak saya?',
      titleVi: 'Làm sao để xác minh các điều khoản hợp đồng của tôi?',
      titleTl: 'Paano makipagsanggunian ang mga kondisyon ng aking kontrata?',
      titleTh: 'ฉันจะตรวจสอบเงื่อนไขของสัญญาได้อย่างไร?',
      descriptionZh: '你有權閱讀並理解你的工作合約中的所有條款。如果合約是用你不明白的語言寫的，要求提供翻譯。',
      descriptionEn: 'You have the right to read and understand all terms of your work contract.If the contract is in a language you do not understand, request a translation.',
      descriptionId: 'Anda berhak membaca dan memahami semua syarat dalam kontrak kerja Anda.Jika kontrak dalam bahasa yang tidak Anda pahami, minta terjemahan.',
      descriptionVi: 'Bạn có quyền đọc và hiểu tất cả các điều khoản của hợp đồng lao động của bạn.Nếu hợp đồng bằng một ngôn ngữ bạn không hiểu, hãy yêu cầu bản dịch.',
      descriptionTl: 'Mayroon kang karapatan na basahin at maunawaan ang lahat ng mga kondisyon ng iyong kontrata sa trabaho.Kung ang kontrata ay nasa isang wika na hindi mo nauunawaan, humingi ng pagsasalin.',
      descriptionTh: 'คุณมีสิทธิในการอ่านและเข้าใจข้อมูลทั้งหมดในสัญญางานของคุณ หากสัญญาเป็นภาษาที่คุณไม่เข้าใจ ให้ขอการแปล',
      solutionZh: '1.向雇主要求一份你能理解的語言的合約副本\n2.逐行檢查所有條款\n3.特別注意：工資、工作時間、休假、保險和解除合約條件\n4.如有疑問，聯繫勞工局或移工組織尋求幫助\n5.在簽署前確保一切清楚',
      solutionEn:  '1.Request a copy of the contract in a language you understand from your employer\n2.Check all terms line by line\n3.Pay special attention to: salary, working hours, leave, insurance, and termination conditions\n4.Contact the Labor Bureau or migrant worker organizations if you have questions\n5.Ensure everything is clear before signing',
      solutionId: '1.Minta salinan kontrak dalam bahasa yang Anda pahami dari majikan Anda\n2.Periksa semua syarat baris demi baris\n3.Perhatikan khusus: gaji, jam kerja, cuti, asuransi, dan kondisi penghentian\n4.Hubungi Biro Tenaga Kerja atau organisasi pekerja migran jika Anda memiliki pertanyaan\n5.Pastikan semuanya jelas sebelum menandatangani',
      solutionVi: '1.Yêu cầu bản sao hợp đồng bằng ngôn ngữ bạn hiểu từ nhà tuyển dụng\n2.Kiểm tra tất cả các điều khoản từng dòng\n3.Chú ý đặc biệt đến: lương, giờ làm việc, nghỉ phép, bảo hiểm và điều kiện chấm dứt\n4.Liên hệ với Cục Lao động hoặc các tổ chức lao động nước ngoài nếu bạn có câu hỏi\n5.Đảm bảo mọi thứ rõ ràng trước khi ký',
      solutionTl:  '1.Humingi ng kopya ng kontrata sa wika na iyong nauunawaan mula sa iyong employer\n2.Suriin ang lahat ng mga kondisyon sa bawat linya\n3.Magbigay ng espesyal na pansin sa:  sahod, oras ng trabaho, bakasyon, insurance, at mga kondisyon sa pagwawakas\n4.Makipag-ugnayan sa Bureau of Labor o sa mga organisasyong ito ng migrant workers kung mayroon kang mga katanungan\n5.Siguraduhin na lahat ay malinaw bago pumirma',
      solutionTh: '1.ขอสำเนาสัญญาเป็นภาษาที่คุณเข้าใจจากนายจ้าง\n2.ตรวจสอบเงื่อนไขทั้งหมดทีละบรรทัด\n3.ให้ความสนใจเป็นพิเศษกับ: เงินเดือน เวลาทำงาน ลาพักร้อน ประกันภัย และเงื่อนไขการสิ้นสุด\n4.ติดต่อสำนักงานสวัสดิการแรงงานหรือองค์กรของแรงงานต่างชาติหากคุณมีคำถาม\n5.ตรวจสอบให้แน่ใจว่าทุกอย่างชัดเจนก่อนลงนาม',
    },
    {
      id: 'common-2',
      category: 'common',
      titleZh:  '我的合約可以更改嗎？',
      titleEn: 'Can my contract be changed?',
      titleId: 'Bisakah kontrak saya diubah?',
      titleVi: 'Hợp đồng của tôi có thể được thay đổi không?',
      titleTl: 'Maaari bang baguhin ang aking kontrata? ',
      titleTh: 'สัญญาของฉันสามารถแก้ไขได้หรือไม่?',
      descriptionZh: '合約可能在雙方同意的情況下進行修改。但是，任何更改都必須以書面形式進行，並由雇主和員工簽署。',
      descriptionEn: 'A contract can be modified with mutual agreement of both parties.However, any changes must be made in writing and signed by both employer and employee.',
      descriptionId: 'Kontrak dapat dimodifikasi dengan persetujuan bersama dari kedua belah pihak.Namun, setiap perubahan harus dilakukan secara tertulis dan ditandatangani oleh majikan dan karyawan.',
      descriptionVi: 'Hợp đồng có thể được sửa đổi với sự đồng ý của cả hai bên.Tuy nhiên, bất kỳ thay đổi nào cũng phải được thực hiện bằng văn bản và được ký bởi cả nhà tuyển dụng và nhân viên.',
      descriptionTl: 'Ang kontrata ay maaaring mabago sa magkasundong pagsang-ayon ng parehong partido.Gayunpaman, ang anumang pagbabago ay dapat na isinasagawa nang buo at pirman ng parehong employer at empleyado.',
      descriptionTh: 'สัญญาสามารถแก้ไขได้ด้วยความตกลงร่วมของทั้งสองฝ่าย อย่างไรก็ตาม การเปลี่ยนแปลงใด ๆ จะต้องทำเป็นลายลักษณ์อักษรและลงนามโดยทั้งนายจ้างและพนักงาน',
      solutionZh: '1.任何更改都必須以書面形式進行\n2.保留原始合約和所有修改副本\n3.確保你理解每一項更改\n4.不要在空白的地方簽署\n5.要求獲得已簽署修改的副本\n6.如果不同意更改，有權拒絕並尋求法律協助',
      solutionEn: '1.Any changes must be made in writing\n2.Keep copies of the original contract and all modifications\n3.Make sure you understand each change\n4.Never sign blank spaces\n5.Request a copy of the signed modifications\n6.You have the right to refuse if you disagree and seek legal assistance',
      solutionId:  '1.Setiap perubahan harus dilakukan secara tertulis\n2.Simpan salinan kontrak asli dan semua modifikasi\n3.Pastikan Anda memahami setiap perubahan\n4.Jangan pernah menandatangani ruang kosong\n5.Minta salinan modifikasi yang ditandatangani\n6.Anda berhak menolak jika tidak setuju dan mencari bantuan hukum',
      solutionVi: '1.Mọi thay đổi phải được thực hiện bằng văn bản\n2.Giữ các bản sao của hợp đồng gốc và tất cả các sửa đổi\n3.Đảm bảo bạn hiểu từng thay đổi\n4.Không bao giờ ký vào các khoảng trống\n5.Yêu cầu bản sao của các sửa đổi đã ký\n6.Bạn có quyền từ chối nếu không đồng ý và tìm kiếm hỗ trợ pháp lý',
      solutionTl: '1.Ang anumang pagbabago ay dapat na isinasagawa nang buo\n2.Panatilihin ang mga kopya ng orihinal na kontrata at lahat ng mga pagbabago\n3.Tiyakin na nauunawaan mo ang bawat pagbabago\n4.Huwag kailanman magsign sa mga walang laman na puwesto\n5.Humingi ng kopya ng mga naisaang pagbabago\n6.Mayroon kang karapatan na tumanggi kung hindi ka sumusunod at maghanap ng legal na tulong',
      solutionTh: '1.การเปลี่ยนแปลงใด ๆ จะต้องทำเป็นลายลักษณ์อักษร\n2.เก็บสำเนาของสัญญาต้นฉบับและการแก้ไขทั้งหมด\n3.ตรวจสอบให้แน่ใจว่าคุณเข้าใจการเปลี่ยนแปลงแต่ละรายการ\n4.อย่าเซ็นชื่อในที่ว่างเปล่า\n5.ขอสำเนาของการแก้ไขที่ลงนาม\n6.คุณมีสิทธิปฏิเสธหากไม่เห็นด้วยและขอความช่วยเหลือทางกฎหมาย',
    },
    // 薪資與津貼
    {
      id: 'salary-1',
      category: 'salary',
      titleZh: '什麼是最低工資？我應該如何檢查我的薪資？',
      titleEn: 'What is minimum wage? How should I check my salary?',
      titleId: 'Apa itu upah minimum?  Bagaimana saya harus memeriksa gaji saya?',
      titleVi: 'Lương tối thiểu là gì? Tôi nên kiểm tra lương của mình như thế nào? ',
      titleTl: 'Ano ang minimum wage? Paano dapat kong suriin ang aking sahod?',
      titleTh: 'ค่าจ้างขั้นต่ำคืออะไร? ฉันควรตรวจสอบเงินเดือนของฉันอย่างไร?',
      descriptionZh: '最低工資是政府規定的員工必須支付的最低金額。台灣的最低工資根據行業和工作類型而異。每月檢查您的工資單以確保您收到正確的金額。',
      descriptionEn: 'Minimum wage is the lowest amount an employer must pay an employee as set by the government.Taiwan\'s minimum wage varies depending on the industry and type of work.Check your salary slip monthly to ensure you receive the correct amount.',
      descriptionId: 'Upah minimum adalah jumlah terendah yang harus dibayarkan majikan kepada karyawan seperti yang ditetapkan oleh pemerintah.Upah minimum Taiwan bervariasi tergantung pada industri dan jenis pekerjaan.Periksa slip gaji Anda setiap bulan untuk memastikan Anda menerima jumlah yang benar.',
      descriptionVi: 'Lương tối thiểu là số tiền thấp nhất mà nhà tuyển dụng phải trả cho nhân viên theo quy định của chính phủ.Lương tối thiểu ở Đài Loan khác nhau tùy thuộc vào ngành và loại công việc.Kiểm tra bảng lương của bạn hàng tháng để đảm bảo bạn nhận được số tiền chính xác.',
      descriptionTl: 'Ang minimum wage ay ang pinakamababang halaga na dapat bayaran ng employer sa empleyado tulad ng itinakda ng pamahalaan.Ang minimum wage ng Taiwan ay nag-iiba depende sa industriya at uri ng trabaho.Suriin ang iyong salary slip buwan-buwan upang masiguro na nakakatanggap ka ng tamang halaga.',
      descriptionTh: 'ค่าจ้างขั้นต่ำคือจำนวนเงินต่ำสุดที่นายจ้างต้องจ่ายให้พนักงานตามที่กำหนดโดยรัฐบาล ค่าจ้างขั้นต่ำในไต้หวันแตกต่างกันไปตามอุตสาหกรรมและประเภทงาน ตรวจสอบสลิปเงินเดือนของคุณทุกเดือนเพื่อให้แน่ใจว่าคุณได้รับจำนวนเงินที่ถูกต้อง',
      solutionZh: '1.了解台灣當前的最低工資標準\n2.每月檢查您的薪資單，核實金額\n3.計算：基本工資 + 津貼 - 扣款 = 應領工資\n4.如果低於最低工資，立即通知雇主\n5.保存所有工資單副本\n6.如果問題未解決，聯繫勞工局投訴',
      solutionEn:  '1.Know Taiwan\'s current minimum wage standard\n2.Check your salary slip monthly and verify the amount\n3.Calculate: Base salary + Allowances - Deductions = Net pay\n4.If below minimum wage, notify employer immediately\n5.Keep copies of all salary slips\n6.Contact the Labor Bureau if the issue is not resolved',
      solutionId: '1.Ketahui standar upah minimum Taiwan saat ini\n2.Periksa slip gaji Anda setiap bulan dan verifikasi jumlahnya\n3.Hitung: Gaji pokok + Tunjangan - Potongan = Gaji bersih\n4.Jika di bawah upah minimum, beritahu majikan segera\n5.Simpan salinan semua slip gaji\n6.Hubungi Biro Tenaga Kerja jika masalah tidak teratasi',
      solutionVi: '1.Biết tiêu chuẩn lương tối thiểu hiện tại của Đài Loan\n2.Kiểm tra bảng lương hàng tháng và xác minh số tiền\n3.Tính toán: Lương cơ bản + Trợ cấp - Khấu trừ = Lương ròng\n4.Nếu dưới mức lương tối thiểu, thông báo cho nhà tuyển dụng ngay lập tức\n5.Giữ bản sao của tất cả các bảng lương\n6.Liên hệ với Cục Lao động nếu vấn đề không được giải quyết',
      solutionTl: '1.Alamin ang kasalukuyang pamantayan ng minimum wage ng Taiwan\n2.Suriin ang iyong salary slip bawat buwan at i-verify ang halaga\n3.Kalkulahin: Pangunahing sahod + Allowances - Discounts = Net pay\n4.Kung mas mababa sa minimum wage, ipaalam sa employer kaagad\n5.Panatilihin ang mga kopya ng lahat ng salary slips\n6.Makipag-ugnayan sa Bureau of Labor kung ang problema ay hindi nalutas',
      solutionTh: '1.รู้มาตรฐานค่าจ้างขั้นต่ำปัจจุบันของไต้หวัน\n2.ตรวจสอบสลิปเงินเดือนของคุณทุกเดือนและตรวจสอบจำนวนเงิน\n3.คำนวณ: เงินเดือนพื้นฐาน + เบี้ยเลี้ยง - ข้อหักลด = เงินเดือนสุทธิ\n4.หากต่ำกว่าค่าจ้างขั้นต่ำ ให้แจ้งให้นายจ้างทราบทันที\n5.เก็บสำเนาสลิปเงินเดือนทั้งหมด\n6.ติดต่อสำนักงานสวัสดิการแรงงานหากปัญหาไม่ได้รับการแก้ไข',
    },
    // 健康與安全
    {
      id:  'health-1',
      category: 'health',
      titleZh: '我應該如何在工作中保持安全？',
      titleEn: 'How should I stay safe at work?',
      titleId:  'Bagaimana cara saya tetap aman di tempat kerja?',
      titleVi: 'Tôi nên giữ an toàn như thế nào khi làm việc?',
      titleTl: 'Paano dapat kong manatiling ligtas sa trabaho?',
      titleTh: 'ฉันควรเพิ่มความปลอดภัยในการทำงานอย่างไร?',
      descriptionZh: '您有權獲得安全的工作環境。雇主必須提供適當的安全設備、培訓和工作規程。報告任何危險情況。',
      descriptionEn:  'You have the right to a safe work environment.Your employer must provide appropriate safety equipment, training, and procedures.Report any hazardous situations.',
      descriptionId: 'Anda berhak mendapatkan lingkungan kerja yang aman.Majikan Anda harus menyediakan peralatan keselamatan yang sesuai, pelatihan, dan prosedur.Laporkan situasi berbahaya apa pun.',
      descriptionVi: 'Bạn có quyền có được môi trường làm việc an toàn.Nhà tuyển dụng của bạn phải cung cấp thiết bị an toàn thích hợp, đào tạo và thủ tục.Báo cáo bất kỳ tình huống nguy hiểm nào.',
      descriptionTl: 'Mayroon kang karapatan sa isang ligtas na kapaligiran sa trabaho.Ang iyong employer ay dapat magbigay ng angkop na kagamitan sa kaligtasan, pagsasanay, at mga pamamaraan.Mag-ulat ng anumang mapanganib na sitwasyon.',
      descriptionTh: 'คุณมีสิทธิในสภาพแวดล้อมการทำงานที่ปลอดภัย นายจ้างของคุณต้องจัดให้มีอุปกรณ์ความปลอดภัยที่เหมาะสม การฝึกอบรม และขั้นตอน รายงานสถานการณ์อันตรายใด ๆ',
      solutionZh: '1.了解你的工作場所危險\n2.總是佩戴必要的安全設備\n3.遵循安全協議和工作程序\n4.立即報告任何事故或接近事故\n5.要求安全培訓和指導\n6.如果你感到不安全，可以拒絕從事危險工作\n7.記錄所有安全問題\n8.聯繫勞工檢查部門報告嚴重危險',
      solutionEn:  '1.Know the hazards in your workplace\n2.Always wear necessary safety equipment\n3.Follow safety protocols and procedures\n4.Report any accidents or near-misses immediately\n5.Request safety training and guidance\n6.You can refuse to perform dangerous work if you feel unsafe\n7.Document all safety issues\n8.Contact the labor inspection department to report serious hazards',
      solutionId: '1.Ketahui bahaya di tempat kerja Anda\n2.Selalu gunakan perlengkapan keselamatan yang diperlukan\n3.Ikuti protokol keselamatan dan prosedur\n4.Laporkan kecelakaan atau kecelakaan yang hampir terjadi dengan segera\n5.Minta pelatihan keselamatan dan bimbingan\n6.Anda dapat menolak untuk melakukan pekerjaan berbahaya jika merasa tidak aman\n7.Dokumentasikan semua masalah keselamatan\n8.Hubungi departemen inspeksi tenaga kerja untuk melaporkan bahaya serius',
      solutionVi:  '1.Biết những mối nguy hiểm tại nơi làm việc của bạn\n2.Luôn đeo các thiết bị bảo vệ cần thiết\n3.Tuân theo các giao thức và quy trình an toàn\n4.Báo cáo ngay bất kỳ tai nạn hoặc sự cố gần như xảy ra\n5.Yêu cầu đào tạo an toàn và hướng dẫn\n6.Bạn có thể từ chối thực hiện công việc nguy hiểm nếu cảm thấy không an toàn\n7.Ghi chép tất cả các vấn đề an toàn\n8.Liên hệ với bộ phận kiểm tra lao động để báo cáo các mối nguy hiểm nghiêm trọng',
      solutionTl: '1.Alamin ang mga panganib sa iyong lugar ng trabaho\n2.Laging magsuot ng kinakailangang kagamitan sa kaligtasan\n3.Sundin ang mga protokol ng kaligtasan at mga pamamaraan\n4.Mag-ulat ng anumang aksidente o malapit na pagkakataon kaagad\n5.Humingi ng pagsasanay sa kaligtasan at paggabay\n6.Maaari kang tumanggi na magsagawa ng mapanganib na trabaho kung hindi ka ligtas\n7.Dokumentuhin ang lahat ng mga isyong pang-kaligtasan\n8.Makipag-ugnayan sa departamento ng inspeksyon sa paggawa upang magulat ng mga seryosong panganib',
      solutionTh: '1.รู้ถึงความเสี่ยงในสถานที่ทำงานของคุณ\n2.สวมใส่อุปกรณ์ความปลอดภัยที่จำเป็นเสมอ\n3.ปฏิบัติตามโปรโตคอลความปลอดภัยและขั้นตอน\n4.รายงานอุบัติเหตุหรือเหตุการณ์ที่เกือบเกิดขึ้นทันที\n5.ขอการฝึกอบรมและแนวทางเกี่ยวกับความปลอดภัย\n6.คุณสามารถปฏิเสธการทำงานที่อันตรายหากคุณรู้สึกไม่ปลอดภัย\n7.บันทึกปัญหาด้านความปลอดภัยทั้งหมด\n8.ติดต่อแผนกตรวจสอบแรงงานเพื่อรายงานอันตรายร้ายแรง',
    },
    // 權利與義務
    {
      id:  'rights-1',
      category: 'rights',
      titleZh: '我有什麼權利？',
      titleEn: 'What are my rights?',
      titleId:  'Apa hak saya?',
      titleVi: 'Quyền của tôi là gì?',
      titleTl: 'Ano ang aking mga karapatan?',
      titleTh: 'สิทธิของฉันคืออะไร?',
      descriptionZh: '作為外籍勞工，您有許多法律權利，包括公平工資、安全工作環境、結社自由和不受歧視的保護。',
      descriptionEn: 'As a foreign worker, you have many legal rights including fair wages, a safe work environment, freedom of association, and protection from discrimination.',
      descriptionId: 'Sebagai pekerja asing, Anda memiliki banyak hak hukum termasuk upah yang adil, lingkungan kerja yang aman, kebebasan berserikat, dan perlindungan dari diskriminasi.',
      descriptionVi: 'Là một công nhân nước ngoài, bạn có nhiều quyền pháp lý bao gồm lương công bằng, môi trường làm việc an toàn, tự do hội họp, và bảo vệ khỏi phân biệt đối xử.',
      descriptionTl: 'Bilang isang dayuhan na manggagawa, mayroon kang maraming mga karapatan sa batas kabilang ang patas na sahod, ligtas na kapaligiran sa trabaho, kalayaang lumipat, at proteksyon mula sa diskriminasyon.',
      descriptionTh: 'ในฐานะแรงงานต่างด้าวคุณมีสิทธิตามกฎหมายมากมายรวมถึงเงินเดือนที่ยุติธรรม สภาพแวดล้อมการทำงานที่ปลอดภัย เสรีภาพในการสมาคม และการคุ้มครองจากการเลือกปฏิบัติ',
      solutionZh: '主要權利包括：\n1.公平工資 - 按時收到完整工資\n2.安全工作環境 - 提供安全設備和培訓\n3.合理工作時間 - 不超過法定小時數\n4.休息日和假期 - 每周至少一天休息\n5.社會保險 - 健康保險、工傷賠償\n6.結社自由 - 加入工會或協會的權利\n7.不受歧視 - 基於性別、種族或國籍\n8.申訴權 - 向當局報告違規行為',
      solutionEn:  'Main rights include:\n1.Fair wages - Receive full pay on time\n2.Safe work environment - Safety equipment and training provided\n3.Reasonable working hours - Not exceeding legal hours\n4.Rest days and holidays - At least one rest day per week\n5.Social insurance - Health insurance, injury compensation\n6.Freedom of association - Right to join unions or associations\n7.Non-discrimination - Based on gender, race, or nationality\n8.Right to complaint - Report violations to authorities',
      solutionId: 'Hak utama meliputi:\n1.Upah yang adil - Terima gaji penuh tepat waktu\n2.Lingkungan kerja yang aman - Peralatan keselamatan dan pelatihan disediakan\n3.Jam kerja yang wajar - Tidak melebihi jam hukum\n4.Hari istirahat dan libur - Minimal satu hari istirahat per minggu\n5.Asuransi sosial - Asuransi kesehatan, kompensasi cedera\n6.Kebebasan berserikat - Hak untuk bergabung dengan serikat pekerja atau asosiasi\n7.Non-diskriminasi - Berdasarkan jenis kelamin, ras, atau kebangsaan\n8.Hak untuk mengeluh - Laporkan pelanggaran kepada otoritas',
      solutionVi: 'Quyền chính bao gồm:\n1.Lương công bằng - Nhận đủ lương đúng hạn\n2.Môi trường làm việc an toàn - Cung cấp thiết bị an toàn và đào tạo\n3.Giờ làm việc hợp lý - Không vượt quá giờ pháp luật\n4.Ngày nghỉ và ngày lễ - Ít nhất một ngày nghỉ mỗi tuần\n5.Bảo hiểm xã hội - Bảo hiểm sức khỏe, bồi thường thương tích\n6.Tự do hội họp - Quyền tham gia công đoàn hoặc hiệp hội\n7.Không phân biệt - Dựa trên giới tính, chủng tộc hoặc quốc tịch\n8.Quyền khiếu nại - Báo cáo vi phạm với chính quyền',
      solutionTl: 'Ang mga pangunahing karapatan ay kinabibilangan ng:\n1.Patas na sahod - Makatanggap ng buong sahod sa oras\n2.Ligtas na kapaligiran sa trabaho - Kagamitan sa kaligtasan at pagsasanay na ibinigay\n3.Makatwirang oras ng trabaho - Hindi lumalampas sa oras ng batas\n4.Mga araw ng pahinga at pista - Kahit isang araw ng pahinga bawat linggo\n5.Social insurance - Health insurance, pagbabayad sa pinsala\n6.Kalayaang mag-asosiasyon - Karapatan na sumali sa unyon o mga asosasyon\n7.Walang diskriminasyon - Batay sa kasarian, lahi, o nasyonalidad\n8.Karapatan na magsumok - Mag-ulat ng mga paglabas sa mga awtoridad',
      solutionTh: 'สิทธิหลักรวมถึง:\n1.เงินเดือนที่ยุติธรรม - รับเงินเดือนเต็มจำนวนตรงเวลา\n2.สภาพแวดล้อมการทำงานที่ปลอดภัย - จัดให้มีอุปกรณ์ความปลอดภัยและการฝึกอบรม\n3.เวลาทำงานที่สมควร - ไม่เกินเวลาตามกฎหมาย\n4.วันหยุดและวันหยุด - อย่างน้อยหนึ่งวันหยุดต่อสัปดาห์\n5.ประกันสังคม - ประกันสุขภาพ การชดใช้ความเสียหาย\n6.เสรีภาพในการสมาคม - สิทธิในการเข้าร่วมสหภาพแรงงานหรือสมาคม\n7.ไม่มีการเลือกปฏิบัติ - บนพื้นฐานของเพศ เชื้อชาติ หรือสัญชาติ\n8.สิทธิในการร้องเรียน - รายงานการละเมิดให้กับหน่วยงานราชการ',
    },
    // 工作安全
    {
      id:  'safety-1',
      category: 'safety',
      titleZh: '如果我在工作中受傷了怎麼辦？',
      titleEn: 'What should I do if I get injured at work?',
      titleId:  'Apa yang harus saya lakukan jika saya terluka di tempat kerja?',
      titleVi: 'Tôi nên làm gì nếu bị thương khi làm việc?',
      titleTl: 'Ano ang dapat kong gawin kung masama ako sa trabaho?',
      titleTh: 'ฉันควรทำอย่างไรหากบาดเจ็บที่งาน? ',
      descriptionZh:  '工傷是由工作引起的傷害或疾病。你有權獲得醫療治療和補償。立即報告任何傷害，並獲得醫療檢查。',
      descriptionEn: 'A work injury is an injury or illness caused by work.You have the right to medical treatment and compensation.Report any injury immediately and get medical examination.',
      descriptionId: 'Cedera kerja adalah cedera atau penyakit yang disebabkan oleh pekerjaan.Anda berhak mendapat pengobatan medis dan kompensasi.Laporkan cedera apa pun segera dan dapatkan pemeriksaan medis.',
      descriptionVi: 'Chấn thương tại nơi làm việc là chấn thương hoặc bệnh tật gây ra do công việc.Bạn có quyền được cấp cứu y tế và bồi thường.Báo cáo bất kỳ chấn thương nào ngay lập tức và kiểm tra y tế.',
      descriptionTl: 'Ang pinsala sa trabaho ay pinsala o sakit na dulot ng trabaho.Mayroon kang karapatan sa paggamot sa medikal at kompensasyon.Mag-ulat ng anumang pinsala kaagad at kumuha ng medikal na pagsusuri.',
      descriptionTh: 'การบาดเจ็บที่งานคือการบาดเจ็บหรือโรคที่เกิดจากงาน คุณมีสิทธิได้รับการรักษาและค่าชดเชย รายงานการบาดเจ็บใด ๆ ทันทีและรับการตรวจสอบทางการแพทย์',
      solutionZh: '1.立即尋求醫療幫助 - 去醫院或診所\n2.通知你的雇主和主管\n3.索取醫療報告副本\n4.記錄你的傷害和事件詳情\n5.報名工傷保險賠償\n6.拍攝受傷部位的照片（如適用）\n7.保存所有醫療費用收據\n8.聯繫勞工局了解補償程序',
      solutionEn: '1.Seek medical help immediately - Go to a hospital or clinic\n2.Notify your employer and supervisor\n3.Get a copy of the medical report\n4.Document your injury and incident details\n5.File for workers\' compensation insurance\n6.Take photos of the injured area (if applicable)\n7.Keep all medical expense receipts\n8.Contact the Labor Bureau about compensation procedures',
      solutionId: '1.Segera cari bantuan medis - Pergi ke rumah sakit atau klinik\n2.Beritahu majikan dan supervisor Anda\n3.Dapatkan salinan laporan medis\n4.Dokumentasikan cedera dan detail insiden Anda\n5.Ajukan klaim asuransi kompensasi pekerja\n6.Ambil foto area yang cedera (jika berlaku)\n7.Simpan semua kuitansi biaya medis\n8.Hubungi Biro Tenaga Kerja tentang prosedur kompensasi',
      solutionVi:  '1.Tìm kiếm trợ giúp y tế ngay lập tức - Đi đến bệnh viện hoặc phòng khám\n2.Thông báo cho nhà tuyển dụng và người giám sát của bạn\n3.Nhận bản sao báo cáo y tế\n4.Ghi chép chấn thương và chi tiết sự cố của bạn\n5.Nộp yêu cầu bồi thường cho công nhân\n6.Chụp ảnh khu vực bị thương (nếu có)\n7.Giữ tất cả biên lai chi phí y tế\n8.Liên hệ với Cục Lao động về quy trình bồi thường',
      solutionTl: '1.Maghanap ng medikal na tulong kaagad - Pumunta sa ospital o klinika\n2.Ipaalam sa iyong employer at supervisor\n3.Kumuha ng kopya ng medikal na ulat\n4.I-document ang iyong pinsala at mga detalye ng insidente\n5.Magsampa ng claim para sa pagbabayad ng manggagawa\n6.Kumuha ng mga larawan ng napinsalang lugar (kung applicable)\n7.Panatilihin ang lahat ng mga resibo ng gastos sa medikal\n8.Makipag-ugnayan sa Bureau of Labor tungkol sa mga pamamaraan ng kompensasyon',
      solutionTh:  '1.ขอความช่วยเหลือทางการแพทย์ทันที - ไปโรงพยาบาลหรือคลินิก\n2.แจ้งให้นายจ้างและหัวหน้างานของคุณทราบ\n3.ขอสำเนาของรายงานทางการแพทย์\n4.บันทึกการบาดเจ็บและรายละเอียดเหตุการณ์ของคุณ\n5.ยื่นคำขอค่าชดเชยผู้ประกอบการ\n6.ถ่ายรูปพื้นที่ที่บาดเจ็บ (หากเป็นไปได้)\n7.เก็บใบเสร็จค่าใช้จ่ายทางการแพทย์ทั้งหมด\n8.ติดต่อสำนักงานสวัสดิการแรงงานเกี่ยวกับขั้นตอนการชดใช้',
    },
    // 法律保護
    {
      id: 'legal-1',
      category: 'legal',
      titleZh: '我應該如何應對工作場所的騷擾或歧視？',
      titleEn: 'How should I handle harassment or discrimination at work?',
      titleId: 'Bagaimana saya harus menangani pelecehan atau diskriminasi di tempat kerja?',
      titleVi: 'Tôi nên xử lý quấy rối hoặc phân biệt đối xử tại nơi làm việc như thế nào? ',
      titleTl: 'Paano ako dapat harapin ang abusohan o diskriminasyon sa trabaho? ',
      titleTh: 'ฉันควรจัดการการ騷擾หรือการเลือกปฏิบัติที่งานอย่างไร?',
      descriptionZh: '騷擾和歧視都是違法的。你有權獲得免受這種行為的保護。你可以向雇主、工會或政府機構報告。',
      descriptionEn: 'Harassment and discrimination are illegal.You have the right to protection from such behavior.You can report to your employer, a union, or government agency.',
      descriptionId: 'Pelecehan dan diskriminasi adalah ilegal.Anda berhak dilindungi dari perilaku tersebut.Anda dapat melaporkan ke majikan, serikat pekerja, atau lembaga pemerintah.',
      descriptionVi: 'Quấy rối và phân biệt đối xử là bất hợp pháp.Bạn có quyền được bảo vệ khỏi hành vi như vậy.Bạn có thể báo cáo cho nhà tuyển dụng, công đoàn, hoặc cơ quan chính phủ.',
      descriptionTl: 'Ang pag-aabuso at diskriminasyon ay ilegal.Mayroon kang karapatan sa proteksyon mula sa ganitong pag-uugali.Maaari kang mag-ulat sa iyong employer, isang unyon, o isang ahensya ng pamahalaan.',
      descriptionTh: 'การคุกคามและการเลือกปฏิบัติเป็นสิ่งผิดกฎหมาย คุณมีสิทธิได้รับการคุ้มครองจากพฤติกรรมดังกล่าว คุณสามารถรายงานต่อนายจ้าง สหภาพ หรือหน่วยงานของรัฐบาล',
      solutionZh: '1.อย่ามองข้าม - อย่ารอให้ปัญหาลุกลามขึ้น\n2.รักษาความเป็นส่วนตัว - บันทึกวันที่ เวลา และรายละเอียดของการใ骚擾\n3.บอกผู้กระทำการ - ถ้าคุณปลอดภัย ให้บอกว่าพฤติกรรมนั้นไม่เป็นที่ยอมรับ\n4.ติดต่อผู้บริหาร - รายงานไปยังแผนกทรัพยากรบุคคลหรือผู้จัดการ\n5.หาสำเนาของนโยบาย - ขอนโยบายป้องกันการคุกคามและการเลือกปฏิบัติ\n6.ติดต่อสมาคม - โทรหรือไปที่สมาคมแรงงานเพื่อขอความช่วยเหลือ\n7.แจ้งหน่วยงานราชการ - หากปัญหาไม่ได้รับการแก้ไข ให้ติดต่อ EEOC หรือสำนักงานสวัสดิการแรงงาน\n8.พิจารณาความช่วยเหลือทางกฎหมาย - หากจำเป็น โปรดติดต่อทนายความหรือองค์กรเพื่อสิทธิมนุษยชนท',
      solutionEn: '1.Don\'t ignore it - Don\'t wait for the problem to escalate\n2.Keep records - Document date, time, and details of harassment\n3.Tell the harasser - If safe, tell them the behavior is unacceptable\n4.Contact management - Report to HR or your manager\n5.Get a copy of policy - Ask for anti-harassment and discrimination policies\n6.Contact associations - Call or visit a workers\' association for help\n7.Report to authorities - If not resolved, contact the Labor Bureau\n8.Consider legal help - If necessary, contact a lawyer or human rights organization',
      solutionId: '1.Jangan abaikan - Jangan menunggu masalah meningkat\n2.Simpan catatan - Dokumentasikan tanggal waktu dan detail pelecehan\n3.Beritahu penyerang - Jika aman beri tahu mereka perilakunya tidak dapat diterima\n4.Hubungi manajemen - Laporkan ke HR atau manajer Anda\n5.Dapatkan salinan kebijakan - Minta kebijakan anti-pelecehan dan diskriminasi\n6.Hubungi asosiasi - Hubungi atau kunjungi asosiasi pekerja untuk bantuan\n7.Laporkan ke otoritas - Jika tidak teratasi hubungi Biro Tenaga Kerja\n8.Pertimbangkan bantuan hukum - Jika perlu hubungi pengacara atau organisasi hak asasi manusia',
      solutionVi: '1.Đừng bỏ qua - Đừng chờ vấn đề leo thang\n2.Giữ hồ sơ - Ghi chép ngày giờ và chi tiết quấy rối\n3.Nói với người quấy rối - Nếu an toàn hãy bảo cho họ biết hành vi không thể chấp nhận\n4.Liên hệ quản lý - Báo cáo cho nhân sự hoặc quản lý của bạn\n5.Nhận bản sao chính sách - Yêu cầu chính sách chống quấy rối và phân biệt đối xử\n6.Liên hệ các hiệp hội - Gọi hoặc ghé thăm hiệp hội công nhân để được giúp đỡ\n7.Báo cáo cho chính quyền - Nếu không được giải quyết hãy liên hệ Cục Lao động\n8.Xem xét trợ giúp pháp lý - Nếu cần hãy liên hệ luật sư hoặc tổ chức nhân quyền',
      solutionTl:  '1.Huwag palampasin - Huwag maghintay para sa problema na lumaki\n2.Panatilihin ang mga record - I-document ang petsa oras at mga detalye ng pag-aabuso\n3.Sabihin sa abusero - Kung ligtas ipaalam sa kanila na ang pag-uugali ay hindi matanggap\n4.Makipag-ugnayan sa pamamahala - Mag-ulat sa HR o iyong manager\n5.Kumuha ng kopya ng patakaran - Humingi ng mga patakaran laban sa pag-aabuso at diskriminasyon\n6.Makipag-ugnayan sa mga asosasyon - Tumawag o bumisita sa asosasyon ng manggagawa para sa tulong\n7.Mag-ulat sa mga awtoridad - Kung hindi nalutas makipag-ugnayan sa Bureau of Labor\n8.Isaalang-alang ang legal na tulong - Kung kinakailangan makipag-ugnayan sa isang abogado o organisasyong pang-derechos ng tao',
      solutionTh: '1.อย่ามองข้าม - อย่ารอให้ปัญหาลุกลามขึ้น\n2.รักษาความเป็นส่วนตัว - บันทึกวันที่ เวลา และรายละเอียดของการคุกคาม\n3.บอกผู้กระทำการ - ถ้าคุณปลอดภัย ให้บอกว่าพฤติกรรมนั้นไม่เป็นที่ยอมรับ\n4.ติดต่อผู้บริหาร - รายงานไปยังแผนกทรัพยากรบุคคลหรือผู้จัดการ\n5.หาสำเนาของนโยบาย - ขอนโยบายป้องกันการคุกคามและการเลือกปฏิบัติ\n6.ติดต่อสมาคม - โทรหรือไปที่สมาคมแรงงานเพื่อขอความช่วยเหลือ\n7.แจ้งหน่วยงานราชการ - หากปัญหาไม่ได้รับการแก้ไข ให้ติดต่อสำนักงานสวัสดิการแรงงาน\n8.พิจารณาความช่วยเหลือทางกฎหมาย - หากจำเป็น โปรดติดต่อทนายความหรือองค์กรเพื่อสิทธิมนุษยชน',
    },
  ];

  const getTitle = (item:  KnowledgeItem) => {
    switch (language) {
      case 'en':
        return item.titleEn;
      case 'id':
        return item.titleId;
      case 'vi':
        return item.titleVi;
      case 'tl':
        return item.titleTl;
      case 'th':
        return item.titleTh;
      default:
        return item.titleZh;
    }
  };

  const getDescription = (item: KnowledgeItem) => {
    switch (language) {
      case 'en': 
        return item.descriptionEn;
      case 'id': 
        return item.descriptionId;
      case 'vi': 
        return item.descriptionVi;
      case 'tl':
        return item.descriptionTl;
      case 'th':
        return item.descriptionTh;
      default:
        return item.descriptionZh;
    }
  };

  const getSolution = (item: KnowledgeItem) => {
    switch (language) {
      case 'en':
        return item.solutionEn;
      case 'id':
        return item.solutionId;
      case 'vi':
        return item.solutionVi;
      case 'tl':
        return item.solutionTl;
      case 'th':
        return item.solutionTh;
      default:
        return item.solutionZh;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'common':
        return t('common');
      case 'salary':
        return t('salary');
      case 'health':
        return t('health');
      case 'rights':
        return t('rights');
      case 'safety': 
        return t('safety');
      case 'legal':
        return t('legal');
      default:
        return category;
    }
  };

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      getTitle(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDescription(item)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { value: 'all', label: t('allCategories') },
    { value: 'common', label: t('common') },
    { value: 'salary', label: t('salary') },
    { value: 'health', label: t('health') },
    { value: 'rights', label: t('rights') },
    { value: 'safety', label: t('safety') },
    { value: 'legal', label: t('legal') },
  ];

  return (
    <>
      {/* 浮動按鈕 - 右下角，聯絡按鈕上方 */}
      <div className="fixed bottom-28 right-8 z-40">
        <button
          onClick={() => setIsOpen(! isOpen)}
          className={`
            group relative w-16 h-16 rounded-full
            bg-gradient-to-br from-accent to-accent/80
            hover:from-accent/90 hover:to-accent/70
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-out
            flex items-center justify-center
            text-accent-foreground font-semibold text-xl
            border border-accent/20
            hover:border-accent/40
            active:scale-95
          `}
          aria-label="Open knowledge base"
        >
          📚

          {/* 脈衝動畫效果 */}
          <div className="absolute inset-0 rounded-full bg-accent/40 animate-pulse" />
        </button>
      </div>

      {/* 模態框 - 知識庫面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 面板容器 - 固定位置，內部滾動 */}
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4 pointer-events-none">
            <div className="glass-card rounded-2xl w-full max-w-2xl h-[90vh] overflow-hidden flex flex-col pointer-events-auto shadow-2xl">
              {/* 頭部 - 固定 */}
              <div className="flex-shrink-0 bg-gradient-to-r from-accent/10 to-accent/5 border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {t('knowledgeBase')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {language === 'zh-TW'
                      ? '外籍勞工常見問題與解決方案'
                      : 'Common questions and solutions'}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* 搜尋和篩選區域 - 固定 */}
              <div className="flex-shrink-0 border-b border-border p-4 bg-secondary/30 space-y-3">
                {/* 搜尋欄 */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('searchKnowledge')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>

                {/* 分類篩選 */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary/50 text-foreground hover:bg-secondary'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 內容區域 - 可滾動 */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div key={item.id} className="glass-card rounded-lg overflow-hidden hover:bg-secondary/20 transition-all duration-200">
                        {/* 可展開的標題 */}
                        <button
                          onClick={() =>
                            setExpandedItem(
                              expandedItem === item.id ?  null : item.id
                            )
                          }
                          className="w-full p-4 flex items-start justify-between hover:bg-secondary/10 transition-colors"
                        >
                          <div className="flex-1 text-left space-y-1">
                            <h3 className="font-semibold text-foreground">
                              {getTitle(item)}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {getDescription(item)}
                            </p>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ml-2 ${
                              expandedItem === item.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* 展開的內容 */}
                        {expandedItem === item.id && (
                          <div className="border-t border-border bg-secondary/10 p-4 space-y-4">
                            {/* 完整描述 */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                {language === 'zh-TW'
                                  ? '問題說明'
                                  : 'Description'}
                              </h4>
                              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                {getDescription(item)}
                              </p>
                            </div>

                            {/* 解決方案 */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                {language === 'zh-TW'
                                  ? '解決方案'
                                  : 'Solution'}
                              </h4>
                              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-background/50 p-3 rounded-md border border-border/50">
                                {getSolution(item)}
                              </div>
                            </div>

                            {/* 複製按鈕 */}
                            <div className="pt-2 flex gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    getTitle(item) +
                                      '\n\n' +
                                      getDescription(item) +
                                      '\n\n解決方案:\n' +
                                      getSolution(item)
                                  );
                                }}
                                className="flex-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md text-sm font-medium transition-colors"
                              >
                                {language === 'zh-TW'
                                  ? '複製內容'
                                  : 'Copy'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {t('noResults')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default KnowledgeBase;