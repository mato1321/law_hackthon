import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import AnalysisProgress from '@/components/AnalysisProgress';
import BeautifulReportSection from '@/components/BeautifulReportSection';
import KnowledgeBase from '@/components/KnowledgeBase'; // 👈 添加這一行
import ComplaintHotline from '@/components/ComplaintHotline'; // 👈 保留這一行
import { uploadContract, type StructuredReport } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<StructuredReport | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleFileUpload = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setShowReport(false);
    setReportData(null);
    
    console.log('📊 設置 isAnalyzing = true');
    
    setTimeout(() => {
      const analysisSection = document.getElementById('analysis');
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);

    try {
      console.log('🚀 開始上傳檔案:', file.name);
      
      const result = await uploadContract(file, language);
      
      console.log('✅ 上傳成功:', result);
      
      setReportData(result);
      
      toast({
        title: "分析完成",
        description:     `已提取 ${result.data.extracted_text_length} 個字元`,
      });
      
      handleAnalysisComplete();
      
    } catch (error:     any) {
      console.error('❌ 上傳失敗:', error);
      
      toast({
        variant: "destructive",
        title: "上傳失敗",
        description: error.message || '請稍後再試',
      });
      
      setIsAnalyzing(false);
    }
  }, [language, toast]);

  const handleAnalysisComplete = useCallback(() => {
    console.log('📊 設置 isAnalyzing = false');
    setIsAnalyzing(false);
    setShowReport(true);
    
    setTimeout(() => {
      const reportSection = document.getElementById('report');
      if (reportSection) {
        reportSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <FileUpload onFileUpload={handleFileUpload} />
      
      <AnalysisProgress 
        isAnalyzing={isAnalyzing}
      />
      
      <BeautifulReportSection 
        isVisible={showReport}
        reportData={reportData}
      />

      {/* 👇 添加知識庫和申訴管道按鈕 */}
      <KnowledgeBase />
      <ComplaintHotline />
      
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        <p>© 2025 FLAS (Foreign Labor Audit System).All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Index;