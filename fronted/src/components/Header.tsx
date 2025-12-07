import { useLanguage, languages } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wifi, WifiOff, Loader2, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type ConnectionStatus = 'online' | 'offline' | 'connecting';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [networkStatus, setNetworkStatus] = useState<ConnectionStatus>('connecting');
  const [serverStatus, setServerStatus] = useState<'healthy' | 'degraded' | 'checking'>('checking');

  useEffect(() => {
    const checkConnection = () => {
      if (navigator.onLine) {
        setNetworkStatus('online');
      } else {
        setNetworkStatus('offline');
      }
    };

    // Initial check
    setTimeout(() => {
      checkConnection();
      setServerStatus('healthy');
    }, 1000);

    window.addEventListener('online', () => setNetworkStatus('online'));
    window.addEventListener('offline', () => setNetworkStatus('offline'));

    return () => {
      window.removeEventListener('online', () => setNetworkStatus('online'));
      window.removeEventListener('offline', () => setNetworkStatus('offline'));
    };
  }, []);

  const getNetworkStatusConfig = () => {
    switch (networkStatus) {
      case 'online':
        return {
          icon: <Wifi className="h-4 w-4 text-status-online" />,
          text: t('online'),
          color: 'text-status-online',
        };
      case 'offline':
        return {
          icon: <WifiOff className="h-4 w-4 text-status-offline" />,
          text: t('offline'),
          color: 'text-status-offline',
        };
      case 'connecting':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-status-connecting" />,
          text: t('connecting'),
          color: 'text-status-connecting',
        };
    }
  };

  const getServerStatusConfig = () => {
    switch (serverStatus) {
      case 'healthy':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-status-online" />,
          text: language === 'zh-TW' ? '服務正常' : 'Service Healthy',
          color: 'text-status-online',
        };
      case 'degraded':
        return {
          icon: <AlertCircle className="h-4 w-4 text-status-offline" />,
          text: language === 'zh-TW' ? '服務異常' : 'Service Degraded',
          color: 'text-status-offline',
        };
      case 'checking':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin text-status-connecting" />,
          text: language === 'zh-TW' ? '檢查中...' : 'Checking...',
          color: 'text-status-connecting',
        };
    }
  };

  const networkConfig = getNetworkStatusConfig();
  const serverConfig = getServerStatusConfig();
  const overallStatus = networkStatus === 'online' && serverStatus === 'healthy';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Status Button */}
        <Popover>
          <PopoverTrigger asChild>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all hover:bg-secondary/50 ${
              overallStatus 
                ? 'bg-status-online/10 border-status-online/30 text-status-online' 
                : 'bg-status-offline/10 border-status-offline/30 text-status-offline'
            }`}>
              {overallStatus ? (
                <Wifi className="h-4 w-4" />
              ) : networkStatus === 'connecting' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {overallStatus ? t('online') : networkStatus === 'connecting' ? t('connecting') : t('offline')}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-card border-border p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">
                {language === 'zh-TW' ? '系統狀態' : 'System Status'}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {language === 'zh-TW' ? '網路連線' : 'Network'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${networkConfig.color}`}>
                    <span className="text-sm">{networkConfig.text}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {language === 'zh-TW' ? '伺服器狀態' : 'Server'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${serverConfig.color}`}>
                    <span className="text-sm">{serverConfig.text}</span>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Language Selector */}
        <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
          <SelectTrigger className="w-[140px] bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default Header;
