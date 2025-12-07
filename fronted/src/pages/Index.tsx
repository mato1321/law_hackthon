import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import AnalysisProgress from '@/components/AnalysisProgress';
import ReportSection from '@/components/ReportSection';
import { uploadContract, type UploadResponse } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<UploadResponse | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setShowReport(false);
    setReportData(null);
    
    // 平滑捲動到分析區域
    setTimeout(() => {
      const analysisSection = document.getElementById('analysis');
      if (analysisSection) {
        analysisSection. scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);

    try {
      console.log('🚀 開始上傳檔案:', file.name);
      
      // 🎯 實際呼叫後端 API
      const result = await uploadContract(file);
      
      console.log('✅ 上傳成功:', result);
      
      // 儲存報告資料
      setReportData(result);
      
      // 顯示成功訊息
      toast({
        title: "分析完成",
        description: `已提取 ${result.data.extracted_text_length} 個字元`,
      });
      
      // 完成分析，顯示報告
      handleAnalysisComplete();
      
    } catch (error: any) {
      console.error('❌ 上傳失敗:', error);
      
      setIsAnalyzing(false);
      
      // 顯示錯誤訊息
      toast({
        variant: "destructive",
        title: "上傳失敗",
        description: error.message || '請稍後再試',
      });
    }
  }, [toast]);

  const handleAnalysisComplete = useCallback(() => {
    setIsAnalyzing(false);
    setShowReport(true);
    
    // 平滑捲動到報告區域
    setTimeout(() => {
      const reportSection = document. getElementById('report');
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
        onComplete={handleAnalysisComplete} 
      />
      
      <ReportSection 
        isVisible={showReport}
        reportData={reportData}
      />
      
      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        <p>© 2025 FLAS (Foreign Labor Audit System).  All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Index;