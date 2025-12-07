import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import AnalysisProgress from '@/components/AnalysisProgress';
import ReportSection from '@/components/ReportSection';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    setIsAnalyzing(true);
    setShowReport(false);
    
    // Smooth scroll to analysis section
    setTimeout(() => {
      const analysisSection = document.getElementById('analysis');
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }, []);

  const handleAnalysisComplete = useCallback(() => {
    setIsAnalyzing(false);
    setShowReport(true);
    
    // Smooth scroll to report section
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
        onComplete={handleAnalysisComplete} 
      />
      
      <ReportSection isVisible={showReport} />
      
      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        <p>© 2024 Foreign Worker Contract Review System. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Index;
