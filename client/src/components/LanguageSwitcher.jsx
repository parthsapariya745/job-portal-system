import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-white/80 hover:text-white'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLang('hi')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'hi'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-white/80 hover:text-white'
        }`}
      >
        हिंदी
      </button>
      <button
        onClick={() => setLang('gu')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'gu'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-white/80 hover:text-white'
        }`}
      >
        ગુજરાતી
      </button>
    </div>
  );
};

export default LanguageSwitcher;
