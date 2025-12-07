import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { FileDown, Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type UploadResponse } from '@/utils/api';

interface ReportSectionProps {
  isVisible: boolean;
  reportData: UploadResponse | null;  // 🎯 接收真實報告
}

const ReportSection = ({ isVisible, reportData }: ReportSectionProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  if (!isVisible || !reportData) return null;

  // 🎯 使用真實的報告內容
  const reportContent = reportData.data.report_preview;

  const handleDownload = () => {
    // 🎯 下載真實的報告檔案
    window.open(`http://localhost:8000${reportData.data.download_url}`, '_blank');
    
    toast({
      title: language === 'zh-TW' ? '開始下載報告' : 'Downloading Report',
      description: language === 'zh-TW' ? '報告已開始下載' : 'Report download started',
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    toast({
      title: language === 'zh-TW' ? '已複製到剪貼簿' : 'Copied to clipboard',
    });
  };

  return (
    <section id="report" className="min-h-screen flex flex-col items-center justify-start px-4 py-20 animate-slide-up">
      <div className="w-full max-w-4xl">
        {/* Report Header */}
        <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-foreground">{t('analysisComplete')}</span>
        </div>

        {/* Report Content */}
        <div className="glass-card rounded-2xl p-8 space-y-8">
          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <button onClick={handleCopy} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Copy className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {t('reportTitle')}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  提取文字: {reportData.data.extracted_text_length} 字元
                </p>
              </div>
            </div>
          </div>

          {/* 🎯 顯示真實的報告內容 */}
          <div className="bg-muted/30 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {reportContent}
            </pre>
          </div>

          {/* Export Button */}
          <div className="pt-4 border-t border-border flex justify-center">
            <Button 
              onClick={handleDownload}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-medium"
            >
              <FileDown className="h-5 w-5 mr-2" />
              {t('generatePdf')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportSection;