import { useLanguage } from '@/contexts/LanguageContext';
import { Search, FileSearch, CheckCircle2, Scale, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AnalysisStep {
  id: string;
  icon: React.ReactNode;
  messageKey: string;
  detail?: string;
  status: 'pending' | 'active' | 'complete';
}

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  onComplete: () => void;
}

const AnalysisProgress = ({ isAnalyzing, onComplete }: AnalysisProgressProps) => {
  const { t, language } = useLanguage();
  const [steps, setSteps] = useState<AnalysisStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const baseSteps: Omit<AnalysisStep, 'status'>[] = [
    { id: '1', icon: <FileSearch className="h-5 w-5" />, messageKey: 'analyzingContract' },
    { id: '2', icon: <Search className="h-5 w-5" />, messageKey: 'searchingLaws' },
    { id: '3', icon: <Scale className="h-5 w-5" />, messageKey: 'foundArticle', detail: '勞動基準法 第21條' },
    { id: '4', icon: <Search className="h-5 w-5" />, messageKey: 'searchingLaws' },
    { id: '5', icon: <Scale className="h-5 w-5" />, messageKey: 'foundArticle', detail: '就業服務法 第52條' },
    { id: '6', icon: <Scale className="h-5 w-5" />, messageKey: 'checkingCompliance' },
    { id: '7', icon: <FileText className="h-5 w-5" />, messageKey: 'generatingReport' },
  ];

  useEffect(() => {
    if (isAnalyzing) {
      setSteps([]);
      setCurrentStep(0);

      const addStep = (index: number) => {
        if (index < baseSteps.length) {
          setSteps(prev => [
            ...prev.map(s => ({ ...s, status: 'complete' as const })),
            { ...baseSteps[index], status: 'active' as const }
          ]);
          setCurrentStep(index);

          const delay = index === baseSteps.length - 1 ? 2000 : 1500 + Math.random() * 1000;
          setTimeout(() => {
            if (index === baseSteps.length - 1) {
              setSteps(prev => prev.map(s => ({ ...s, status: 'complete' as const })));
              setTimeout(onComplete, 500);
            } else {
              addStep(index + 1);
            }
          }, delay);
        }
      };

      setTimeout(() => addStep(0), 500);
    }
  }, [isAnalyzing, onComplete]);

  if (!isAnalyzing && steps.length === 0) return null;

  return (
    <section id="analysis" className="min-h-screen flex flex-col items-center justify-start px-4 py-20">
      <div className="w-full max-w-3xl space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-500
              animate-slide-up
              ${step.status === 'active' ? 'border-primary/50 glow-effect' : 'border-border'}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${step.status === 'complete' 
                ? 'bg-primary/20 text-primary' 
                : step.status === 'active'
                  ? 'bg-primary/30 text-primary'
                  : 'bg-secondary text-muted-foreground'
              }
            `}>
              {step.status === 'active' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : step.status === 'complete' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                step.icon
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-foreground font-medium">
                {step.messageKey === 'foundArticle' && step.detail 
                  ? `${t(step.messageKey as any)}: ${step.detail}`
                  : t(step.messageKey as any)
                }
              </p>
            </div>

            {step.status === 'active' && (
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnalysisProgress;
