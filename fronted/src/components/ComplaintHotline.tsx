import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface ComplaintChannel {
  name: string;
  nameEn: string;
  phone: string;
  website:   string;
  email: string;
  description: string;
  descriptionEn: string;
  color: string;
}

const ComplaintHotline = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  const complaintChannels: ComplaintChannel[] = [
    {
      name: '勞動部申訴專線',
      nameEn:   'Ministry of Labor Hotline',
      phone: '0800-085-151',
      website: 'https://www.mol.gov.tw/',
      email: 'complaint@mol.gov.tw',
      description: '全天候 24 小時勞工申訴專線，處理勞動權益相關申訴',
      descriptionEn: '24/7 hotline for labor rights complaints and labor disputes',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: '外籍漁工申訴專線',
      nameEn:   'Foreign Fishermen Hotline',
      phone: '0800-024-889',
      website: 'https://www.fa.gov.tw/',
      email: 'foreign@fa.gov.tw',
      description: '專門處理外籍漁工權益保護的申訴',
      descriptionEn: 'Dedicated hotline for foreign fishermen labor rights',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      name: '外籍勞工申訴專線',
      nameEn:   'Foreign Workers Hotline',
      phone:   '0800-024-250',
      website: 'https://www.nw.gov.tw/',
      email: 'workers@nw.gov.tw',
      description: '處理外籍勞工合法權益相關申訴，支援多種語言',
      descriptionEn: 'Hotline for foreign workers, supporting multiple languages',
      color:   'from-green-500 to-green-600',
    },
    {
      name:  '性騷擾申訴電話',
      nameEn:  'Sexual Harassment Hotline',
      phone: '02-8995-8866',
      website: 'https://www.mol.gov.tw/service/content/2260',
      email: 'harassment@mol.gov.tw',
      description: '處理職場性騷擾及性別歧視申訴',
      descriptionEn: 'Handling workplace sexual harassment complaints',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const getTaiwaneseNGOs = () => [
    {
      name: '國際勞工組織 (ILO)',
      nameEn: 'International Labour Organization',
      phone: '+886-2-2728-8082',
      website: 'https://www.ilo.org/taipei/',
      email: 'taipei@ilo.org',
      description: 'UN 專門機構，處理國際勞工權益問題',
      descriptionEn: 'UN specialized agency for international labor rights',
      color:   'from-red-500 to-red-600',
    },
    {
      name:   '台灣人權促進會',
      nameEn: 'Taiwan Human Rights Association',
      phone: '02-2541-7281',
      website: 'https://www.tahr.org.tw/',
      email: 'info@tahr.org.tw',
      description: '協助外籍勞工人權保護及法律諮詢',
      descriptionEn: 'Provides legal assistance for migrant workers',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <>
      {/* 浮動按鈕 - 右下角 */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            group relative w-16 h-16 rounded-full
            bg-gradient-to-br from-primary to-primary/80
            hover:from-primary/90 hover:to-primary/70
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-out
            flex items-center justify-center
            text-primary-foreground font-semibold text-xl
            border border-primary/20
            hover:border-primary/40
            active:scale-95
          `}
          aria-label="Open complaint hotline"
        >
          📞
          
          {/* 脈衝動畫效果 */}
          <div className="absolute inset-0 rounded-full bg-primary/40 animate-pulse" />
        </button>
      </div>

      {/* 模態框 - 申訴管道面板 */}
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
              <div className="flex-shrink-0 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {language === 'zh-TW' ? '外籍勞工申訴管道' : 'Complaint Hotlines'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {language === 'zh-TW'
                      ? '聯繫相關部門和組織'
                      : 'Contact relevant departments'}
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

              {/* 內容區域 - 可滾動 */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* 政府申訴管道 */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {language === 'zh-TW'
                        ? '政府申訴專線'
                        : 'Government Hotlines'}
                    </h3>
                    <div className="space-y-4">
                      {complaintChannels.map((channel, index) => (
                        <ComplaintCard
                          key={index}
                          channel={channel}
                          language={language}
                        />
                      ))}
                    </div>
                  </div>

                  {/* NGO 組織 */}
                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {language === 'zh-TW'
                        ? '非政府組織 & 國際組織'
                        :   'NGOs & International Organizations'}
                    </h3>
                    <div className="space-y-4">
                      {getTaiwaneseNGOs().map((org, index) => (
                        <ComplaintCard
                          key={index}
                          channel={org}
                          language={language}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 緊急聯絡方式 */}
                  <div className="border-t border-border pt-6 bg-destructive/5 rounded-lg p-4 border border-destructive/20">
                    <h4 className="font-semibold text-foreground mb-3">
                      {language === 'zh-TW' ? ' 緊急情況' : ' Emergency'}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === 'zh-TW'
                        ? '如遭受人身傷害或其他緊急情況，請立即撥打'
                        : 'If in immediate danger, call'}
                    </p>
                    <Button
                      onClick={() => window.location.href = 'tel:110'}
                      className="w-full"
                      size="lg"
                    >
                      110 - {language === 'zh-TW' ? '報警電話' : 'Police'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// 申訴卡片組件 - 簡潔版本，無icon
interface ComplaintCardProps {
  channel: ComplaintChannel;
  language: string;
}

const ComplaintCard = ({ channel, language }: ComplaintCardProps) => {
  const isEn = language !== 'zh-TW';

  return (
    <div className="group glass-card rounded-lg p-4 hover:bg-secondary/20 transition-all duration-200 hover: shadow-md">
      <div className="space-y-3">
        {/* 標題 */}
        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {isEn ? channel.nameEn :  channel.name}
        </h4>

        {/* 描述 */}
        <p className="text-sm text-muted-foreground">
          {isEn ? channel.descriptionEn : channel.description}
        </p>

        {/* 聯絡方式按鈕 */}
        <div className="flex flex-wrap gap-2 pt-2">
          {/* 電話按鈕 */}
          <button
            onClick={() => window.location.href = `tel:${channel.phone}`}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md text-sm font-medium transition-colors"
          >
            {channel.phone}
          </button>

          {/* 網站按鈕 */}
          {channel.website && (
            <a
              href={channel.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-md text-sm font-medium transition-colors"
            >
              {language === 'zh-TW' ? '網站' : 'Website'}
            </a>
          )}

          {/* 郵件按鈕 */}
          {channel.email && (
            <a
              href={`mailto:${channel.email}`}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-500/10 hover: bg-green-500/20 text-green-600 dark: text-green-400 rounded-md text-sm font-medium transition-colors"
            >
              {language === 'zh-TW' ? '郵件' :   'Email'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintHotline;