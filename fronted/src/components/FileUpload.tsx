import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setUploadedFile(file);
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setUploadedFile(file);
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const isValidFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-primary" />;
    }
    return <Image className="h-8 w-8 text-primary" />;
  };

  return (
    <section id="upload" className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-8">
      <div className="text-center mb-8 animate-fade-in">
        <div className="mb-4">
          <img 
            src="/logo.png" 
            alt="FLAS Logo" 
            className="h-32 md:h-40 lg:h-48 mx-auto"
          />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <span className="gradient-text">{t('title')}</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full max-w-2xl p-12 rounded-2xl border-2 border-dashed 
          transition-all duration-300 cursor-pointer glass-card
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02] glow-effect' 
            : 'border-border hover:border-primary/50 hover:bg-card/50'
          }
          ${uploadedFile ? 'border-primary/50' : ''}
        `}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-6">
          {uploadedFile ? (
            <>
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
                {getFileIcon(uploadedFile)}
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium text-lg">{uploadedFile.name}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium text-lg mb-1">{t('dragDrop')}</p>
                <p className="text-muted-foreground mb-4">{t('or')}</p>
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  {t('uploadButton')}
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">{t('supportedFormats')}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FileUpload;
