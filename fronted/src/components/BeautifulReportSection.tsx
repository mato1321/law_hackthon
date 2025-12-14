import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { FileDown, Copy, CheckCircle2, AlertCircle, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StructuredReport } from '@/utils/api';
import { useState } from 'react';

interface BeautifulReportSectionProps {
  isVisible: boolean;
  reportData: StructuredReport | null;
}

const BeautifulReportSection = ({ isVisible, reportData }:   BeautifulReportSectionProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [expandedViolations, setExpandedViolations] = useState<Set<number>>(new Set());
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!isVisible || !reportData) return null;

  const toggleViolation = (id: number) => {
    const newExpanded = new Set(expandedViolations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedViolations(newExpanded);
  };

  const handleDownload = async () => {
    try {
      setIsGeneratingPDF(true);
      const { generatePDF, downloadPDF } = await import('@/utils/pdfService');
      
      toast({
        title: t('analysisComplete'),
        description: language === 'zh-TW' ? '正在生成 PDF...' : 'Generating PDF...',
      });

      const blob = await generatePDF(reportData.data, language);
      const filename = `Contract-Review-${new Date().getTime()}.pdf`;
      downloadPDF(blob, filename);

      toast({
        title: '✅ ' + (language === 'zh-TW' ? '下載成功' : 'Success'),
        description: t('downloadSuccess'),
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        variant: 'destructive',
        title: language === 'zh-TW' ? '錯誤' : 'Error',
        description: language === 'zh-TW' ? '生成 PDF 失敗' : 'Failed to generate PDF',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCopy = () => {
    const fullText = JSON.stringify(reportData.data, null, 2);
    navigator.clipboard.writeText(fullText);
    toast({
      title: '✅ ' + (language === 'zh-TW' ?  '已複製' : 'Copied'),
      description: t('copySuccess'),
    });
  };

  const data = reportData.data;

  // 判斷嚴重程度顏色
  const getSeverityInfo = (level: string) => {
    switch (level) {
      case 'high':   
        return { text: t('severityHigh'), bgColor: 'bg-red-50/50 dark:bg-red-950/20', borderColor: 'border-red-500', icon: '🔴' };
      case 'medium':   
        return { text: t('severityMedium'), bgColor: 'bg-yellow-50/50 dark:bg-yellow-950/20', borderColor:  'border-yellow-500', icon: '🟡' };
      case 'low':  
      default:  
        return { text: t('severityLow'), bgColor: 'bg-emerald-50/50 dark:  bg-emerald-950/20', borderColor: 'border-emerald-500', icon: '🟢' };
    }
  };

  const severityInfo = getSeverityInfo(data.summary.severity_level);
  const isCompliant = data.summary.overall_status === 'compliant';

  return (
    <section id="report" className="min-h-screen flex flex-col items-center justify-start px-4 py-20 animate-slide-up">
      <div className="w-full max-w-5xl space-y-6">
        {/* ========== Header Card ========== */}
        <div className={`rounded-xl p-8 border-l-4 ${isCompliant ? 'bg-emerald-50/50 dark:  bg-emerald-950/20 border-emerald-500' :  'bg-red-50/50 dark: bg-red-950/20 border-red-500'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${isCompliant ? 'bg-emerald-100 dark: bg-emerald-900' : 'bg-red-100 dark: bg-red-900'}`}>
              {isCompliant ? (
                <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('reportTitle')}</h1>
              <p className="text-muted-foreground mt-1">{t('analysisComplete')}</p>
            </div>
          </div>
        </div>

        {/* ========== Report Info Grid ========== */}
        <div className="bg-card/50 backdrop-blur rounded-xl p-6 border border-border grid grid-cols-2 md:  grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{t('reviewDate')}</p>
            <p className="font-semibold text-foreground text-sm mt-1">{data.review_date}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{t('contractLength')}</p>
            <p className="font-semibold text-foreground text-sm mt-1">{data.contract_length}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{t('violations')}</p>
            <p className={`font-bold text-lg mt-1 ${data.summary.total_violations > 0 ? 'text-red-600' :  'text-emerald-600'}`}>
              {data.summary.total_violations}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{t('severity')}</p>
            <p className={`font-semibold text-sm mt-1 ${data.summary.severity_level === 'high' ? 'text-red-600' : data.summary.severity_level === 'medium' ? 'text-yellow-600' : 'text-emerald-600'}`}>
              {severityInfo.icon}
            </p>
          </div>
        </div>

        {/* ========== Violations Section ========== */}
        {data.violations.length > 0 ?  (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold text-foreground">{t('violations')}</h2>
              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded-full font-semibold ml-auto">
                {data.violations.length} {t('violation')}
              </span>
            </div>

            <div className="space-y-3">
              {data.violations.map((violation) => (
                <div
                  key={violation.id}
                  className="border border-red-200 dark:  border-red-800 rounded-lg overflow-hidden bg-red-50/30 dark:bg-red-950/10 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors"
                >
                  {/* Violation Header */}
                  <button
                    onClick={() => toggleViolation(violation.id)}
                    className="w-full p-4 flex items-start justify-between hover:bg-red-100/20 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 text-left">
                      <div className="flex-shrink-0 mt-1">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground">
                          {t('violation')} #{violation.id}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {violation.reason}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ml-2 ${expandedViolations.has(violation.id) ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Violation Details */}
                  {expandedViolations.has(violation.id) && (
                    <div className="border-t border-red-200 dark: border-red-800 p-4 space-y-4 bg-red-50/50 dark:bg-red-950/20">
                      {/* Original Text */}
                      <div>
                        <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
                          {t('originalText')}
                        </label>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border-l-2 border-red-500 italic">
                          "{violation.originalText}"
                        </p>
                      </div>

                      {/* Violated Laws */}
                      <div>
                        <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
                          {t('violatedLaws')}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {violation.violatedLaws.map((law, idx) => (
                            <span key={idx} className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                              {law}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Reason */}
                      <div>
                        <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
                          {t('reason')}
                        </label>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                          {violation.reason}
                        </p>
                      </div>

                      {/* Suggestion */}
                      <div>
                        <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
                          💡 {t('suggestion')}
                        </label>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:  bg-emerald-950/30 p-3 rounded border-l-2 border-emerald-500">
                          {violation.suggestion}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // No Violations
          <div className="p-8 rounded-lg bg-emerald-50/50 dark: bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{t('noViolations')}</p>
                <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                  {t('compliantMessage')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========== Action Buttons ========== */}
        <div className="flex gap-3 justify-center pt-6 border-t border-border flex-wrap">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="px-6 py-2 flex items-center gap-2"
            disabled={isGeneratingPDF}
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            onClick={handleDownload}
            className="bg-primary text-primary-foreground hover:  bg-primary/90 px-6 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isGeneratingPDF}
          >
            <FileDown className="h-4 w-4" />
            {isGeneratingPDF ? (language === 'zh-TW' ? '生成中...' : 'Generating...') : t('generatePdf')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BeautifulReportSection;