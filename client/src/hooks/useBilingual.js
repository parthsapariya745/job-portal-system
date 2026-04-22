import { useLanguage } from '../context/LanguageContext';

export const useBilingual = () => {
  const { language } = useLanguage();

  const bt = (textObj) => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj['en'] || textObj['hi'] || textObj['gu'] || '';
  };

  return { bt, language };
};
