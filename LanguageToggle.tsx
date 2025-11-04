import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LanguageToggleProps {
  language: 'english' | 'hindi';
  onToggle: () => void;
}

const LanguageToggle = ({ language, onToggle }: LanguageToggleProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="gap-2 transition-all hover:scale-105"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">
        {language === 'english' ? 'English' : 'हिंदी'}
      </span>
      <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">
        {language === 'english' ? 'EN' : 'HI'}
      </Badge>
    </Button>
  );
};

export default LanguageToggle;
