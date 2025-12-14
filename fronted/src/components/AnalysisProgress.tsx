import { useLanguage } from '@/contexts/LanguageContext';
import { FileSearch, Search, CheckCircle2, Scale, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProgressStep {
  id: string;
  message: string;
  status: 'pending' | 'active' | 'complete';
}

interface AnalysisProgressProps {
  isAnalyzing: boolean;
}

const baseSteps: ProgressStep[] = [
  { id: '1', message: '正在提取文字... ', status: 'pending' },
  { id: '2', message: '載入法規向量資料庫...', status: 'pending' },
  { id: '3', message: '搜尋相關法條...', status: 'pending' },
  { id: '4', message: '檢查法規符合度...', status: 'pending' },
  { id: '5', message: 'AI 分析契約內容...', status: 'pending' },
  { id: '6', message: '生成違規項目列表...', status: 'pending' },
  { id: '7', message: '生成最終報告...', status: 'pending' },
];

const AnalysisProgress = ({ isAnalyzing }: AnalysisProgressProps) => {
  const { language } = useLanguage();
  const [steps, setSteps] = useState<ProgressStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (! isAnalyzing) {
      setSteps([]);
      setCurrentStepIndex(0);
      return;
    }

    console.log('✅ 分析開始，顯示進度卡片');
    setSteps([{ ... baseSteps[0], status:  'active' }]);
    setCurrentStepIndex(0);

    // 模擬步驟進度
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        
        if (next < baseSteps.length) {
          // 標記前面的步驟為完成，當前步驟為 active
          const newSteps = baseSteps.map((step, idx) => {
            if (idx < next) {
              return { ... step, status: 'complete' as const };
            } else if (idx === next) {
              return { ...step, status: 'active' as const };
            } else {
              return { ...step, status: 'pending' as const };
            }
          });
          setSteps(newSteps);
        } else {
          // 所有步驟完成
          const newSteps = baseSteps. map((step) => ({
            ...step,
            status: 'complete' as const,
          }));
          setSteps(newSteps);
        }

        return next;
      });
    }, 2000); // 每 2 秒進度一步

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing || steps.length === 0) {
    return null;
  }

  const getIcon = (stepId: string) => {
    switch (stepId) {
      case '1': 
        return <FileSearch className="h-5 w-5" />;
      case '2':
        return <FileText className="h-5 w-5" />;
      case '3':
        return <Search className="h-5 w-5" />;
      case '4':
        return <Scale className="h-5 w-5" />;
      case '5':
        return <Loader2 className="h-5 w-5" />;
      case '6':
        return <CheckCircle2 className="h-5 w-5" />;
      case '7': 
        return <FileText className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <section
      id="analysis"
      className="min-h-screen flex flex-col items-center justify-start px-4 py-20"
    >
      <div className="w-full max-w-3xl space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-500
              animate-slide-up
              ${
                step.status === 'active'
                  ? 'border-primary/50 glow-effect'
                  : 'border-border'
              }
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`
              w-10 h-10 rounded-lg flex items-center justify-center transition-all
              ${
                step.status === 'complete'
                  ? 'bg-primary/20 text-primary'
                  : step.status === 'active'
                  ? 'bg-primary/30 text-primary animate-pulse'
                  : 'bg-secondary text-muted-foreground'
              }
            `}
            >
              {step.status === 'active' ?  (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : step.status === 'complete' ?  (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                getIcon(step.id)
              )}
            </div>

            <div className="flex-1">
              <p className="text-foreground font-medium">{step.message}</p>
            </div>

            {step.status === 'active' && (
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnalysisProgress;