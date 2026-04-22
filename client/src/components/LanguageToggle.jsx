import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-20 right-4 z-[60] bg-white border-2 border-green-600 rounded-full px-4 py-2 shadow-lg hover:bg-green-50 transition-all font-bold text-green-700 flex items-center gap-2"
    >
      <span className="text-xl">🌐</span>
      {language === 'en' ? 'हिन्दी' : language === 'hi' ? 'ગુજરાતી' : 'English'}
    </button>
  );
};

export default LanguageToggle;
