import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { FileDown, Copy, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportSectionProps {
  isVisible: boolean;
}

const ReportSection = ({ isVisible }: ReportSectionProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  if (!isVisible) return null;

  const reportContent = {
    'zh-TW': {
      title: '外籍勞工聘僱契約審查報告',
      date: new Date().toLocaleDateString('zh-TW'),
      introduction: '本報告針對所提供之外籍勞工聘僱契約進行全面性法規符合度審查。經分析後，發現該契約在多項條款上與現行法規有出入，以下為詳細說明。',
      findings: [
        { type: 'warning', title: '工資條款不符', content: '契約第5條所載之基本工資低於勞動基準法第21條規定之最低工資標準。現行基本工資應為每月27,470元。' },
        { type: 'error', title: '工時規定違規', content: '契約未明確規定加班費計算方式，違反勞動基準法第24條。應明訂延長工時前兩小時按平日工資加給三分之一，再延長者加給三分之二。' },
        { type: 'info', title: '休假規定', content: '契約之休假規定符合勞動基準法第36條，每七日應有二日休息，一日為例假，一日為休息日。' },
        { type: 'warning', title: '膳宿費扣除', content: '依就業服務法第52條，雇主不得預扣勞工工資作為違約金或賠償費用。建議重新審視膳宿費扣除條款。' },
      ],
      recommendations: [
        '將基本工資修正為符合最新法定標準',
        '明確載明加班費計算方式及支付時程',
        '檢視膳宿費扣除是否符合法規比例上限',
        '建議增列勞工申訴管道及機制',
      ],
      conclusion: '綜上所述，該聘僱契約存在2項重大違規事項及2項建議改善事項。建議雇主於簽訂契約前進行修正，以確保符合勞動法規並保障勞工權益。',
    },
    'en': {
      title: 'Foreign Worker Employment Contract Review Report',
      date: new Date().toLocaleDateString('en-US'),
      introduction: 'This report provides a comprehensive regulatory compliance review of the provided foreign worker employment contract. After analysis, several discrepancies with current regulations were identified, as detailed below.',
      findings: [
        { type: 'warning', title: 'Wage Clause Non-Compliance', content: 'The basic wage stated in Article 5 of the contract is below the minimum wage standard stipulated in Article 21 of the Labor Standards Act. The current minimum wage should be NT$27,470 per month.' },
        { type: 'error', title: 'Working Hours Violation', content: 'The contract does not clearly specify overtime pay calculation methods, violating Article 24 of the Labor Standards Act. Overtime rates should be specified: 1.33x for first two hours, 1.67x thereafter.' },
        { type: 'info', title: 'Leave Provisions', content: 'The leave provisions comply with Article 36 of the Labor Standards Act, requiring two rest days every seven days, one as regular leave and one as rest day.' },
        { type: 'warning', title: 'Room and Board Deductions', content: 'According to Article 52 of the Employment Service Act, employers may not deduct wages in advance as penalty or compensation. The room and board deduction clause should be reviewed.' },
      ],
      recommendations: [
        'Correct the basic wage to comply with the latest legal standards',
        'Clearly specify overtime pay calculation methods and payment schedule',
        'Review room and board deductions to ensure compliance with legal limits',
        'Consider adding worker grievance channels and mechanisms',
      ],
      conclusion: 'In summary, the employment contract contains 2 major violations and 2 items requiring improvement. It is recommended that the employer make corrections before signing to ensure compliance with labor regulations and protect worker rights.',
    },
  };

  const content = reportContent[language as keyof typeof reportContent] || reportContent['en'];

  const handleGeneratePdf = () => {
    toast({
      title: language === 'zh-TW' ? '正在生成 PDF...' : 'Generating PDF...',
      description: language === 'zh-TW' ? '報告將在幾秒內下載' : 'Report will download shortly',
    });

    // Simulate PDF generation
    setTimeout(() => {
      const element = document.createElement('a');
      const blob = new Blob([`
${content.title}
${'='.repeat(50)}
${content.date}

${t('introduction')}
${'-'.repeat(30)}
${content.introduction}

${t('findings')}
${'-'.repeat(30)}
${content.findings.map(f => `[${f.type.toUpperCase()}] ${f.title}\n${f.content}`).join('\n\n')}

${t('recommendations')}
${'-'.repeat(30)}
${content.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

${t('conclusion')}
${'-'.repeat(30)}
${content.conclusion}
      `], { type: 'text/plain' });
      
      element.href = URL.createObjectURL(blob);
      element.download = `contract-review-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: language === 'zh-TW' ? 'PDF 已生成' : 'PDF Generated',
        description: language === 'zh-TW' ? '報告已開始下載' : 'Report download started',
      });
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${content.title}\n\n${content.introduction}\n\n${content.conclusion}`);
    toast({
      title: language === 'zh-TW' ? '已複製到剪貼簿' : 'Copied to clipboard',
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-status-connecting" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
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
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{content.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">{content.date}</p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('introduction')}</h3>
            <p className="text-muted-foreground leading-relaxed">{content.introduction}</p>
          </div>

          {/* Findings */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">{t('findings')}</h3>
            <div className="space-y-4">
              {content.findings.map((finding, index) => (
                <div 
                  key={index} 
                  className={`
                    p-4 rounded-xl border
                    ${finding.type === 'error' 
                      ? 'bg-destructive/10 border-destructive/30' 
                      : finding.type === 'warning'
                        ? 'bg-status-connecting/10 border-status-connecting/30'
                        : 'bg-primary/10 border-primary/30'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(finding.type)}
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{finding.title}</h4>
                      <p className="text-muted-foreground text-sm">{finding.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">{t('recommendations')}</h3>
            <ul className="space-y-2">
              {content.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Conclusion */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('conclusion')}</h3>
            <p className="text-muted-foreground leading-relaxed">{content.conclusion}</p>
          </div>

          {/* Export Button */}
          <div className="pt-4 border-t border-border flex justify-center">
            <Button 
              onClick={handleGeneratePdf}
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
