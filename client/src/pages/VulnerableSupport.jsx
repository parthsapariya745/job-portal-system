import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FiArrowLeft, FiHome, FiHeart, FiUsers, FiSmile, FiPhone, FiMapPin } from 'react-icons/fi';

const VulnerableSupport = () => {
  const { language } = useLanguage();

  // Simple translations for non-educated users
  const translations = {
    pageTitle: {
      en: 'Help for Everyone',
      hi: 'सबके लिए मदद',
      gu: 'દરેક માટે મદદ'
    },
    pageSubtitle: {
      en: 'Easy help for elderly, children, and those who need care',
      hi: 'बुजुर्गों, बच्चों और देखभाल चाहने वालों के लिए आसान मदद',
      gu: 'વૃદ્ધો, બાળકો અને સંભાળની જરૂર હોય તેવા લોકો માટે સરળ મદદ'
    },
    backButton: {
      en: 'Back',
      hi: 'वापस',
      gu: 'પાછા જાઓ'
    },
    clickForInfo: {
      en: 'Click for Information',
      hi: 'जानकारी के लिए क्लिक करें',
      gu: 'માહિતી માટે ક્લિક કરો'
    },
    // Categories
    elderlyCare: {
      en: 'Old Age Homes',
      hi: 'वृद्धाश्रम',
      gu: 'વૃદ્ધાશ્રમ'
    },
    elderlyDesc: {
      en: 'Homes and care for elderly people',
      hi: 'बुजुर्गों के लिए घर और देखभाल',
      gu: 'વૃદ્ધો માટે ઘર અને સંભાળ'
    },
    childCare: {
      en: 'Children Care',
      hi: 'बच्चों की देखभाल',
      gu: 'બાળ સંભાળ'
    },
    childDesc: {
      en: 'Help for children without parents',
      hi: 'बिना माता-पिता के बच्चों की मदद',
      gu: 'માતા-પિતા વિનાના બાળકો માટે મદદ'
    },
    disabledCare: {
      en: 'Disabled Support',
      hi: 'विकलांग सहायता',
      gu: 'વિકલાંગ સહાય'
    },
    disabledDesc: {
      en: 'Help for disabled persons',
      hi: 'विकलांग व्यक्तियों की मदद',
      gu: 'વિકલાંગ વ્યક્તિઓ માટે મદદ'
    },
    widowSupport: {
      en: 'Widow Help',
      hi: 'विधवा सहायता',
      gu: 'વિધવા સહાય'
    },
    widowDesc: {
      en: 'Support for widows',
      hi: 'विधवाओं के लिए सहायता',
      gu: 'વિધવાઓ માટે સહાય'
    },
    mentalHealth: {
      en: 'Mental Health',
      hi: 'मानसिक स्वास्थ्य',
      gu: 'માનસિક સ્વાસ્થ્ય'
    },
    mentalDesc: {
      en: 'Help for mental wellness',
      hi: 'मानसिक स्वास्थ्य के लिए मदद',
      gu: 'માનસિક સ્વાસ્થ્ય માટે મદદ'
    },
    // Helplines
    needHelp: {
      en: 'Need Help?',
      hi: 'मदद चाहिए?',
      gu: 'મદદ જોઈએ છે?'
    },
    fillForm: {
      en: 'Fill Simple Form',
      hi: 'सरल फॉर्म भरें',
      gu: 'સરળ ફોર્મ ભરો'
    },
    foodShelterCare: {
      en: 'Food & Shelter Help',
      hi: 'भोजन और आश्रय मदद',
      gu: 'ખોરાક અને આશ્રય મદદ'
    },
    foodShelterDesc: {
      en: 'Free food and places to stay for those in need',
      hi: 'जरूरतमंदों के लिए मुफ्त भोजन और रहने की जगह',
      gu: 'જરૂરિયાતમંદ લોકો માટે મફત ભોજન અને રહેવાની જગ્યા'
    }
  };

  // Support categories with big icons
  const supportCategories = [
    {
      id: 'elderly',
      icon: '👴',
      title: translations.elderlyCare[language],
      desc: translations.elderlyDesc[language],
      color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-900/50',
      iconBg: 'bg-blue-500',
      helpline: '14567'
    },
    {
      id: 'children',
      icon: '👶',
      title: translations.childCare[language],
      desc: translations.childDesc[language],
      color: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-900/50',
      iconBg: 'bg-pink-500',
      helpline: '1098'
    },
    {
      id: 'foodShelter',
      icon: '🏠',
      title: translations.foodShelterCare[language],
      desc: translations.foodShelterDesc[language],
      color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-900/50',
      iconBg: 'bg-yellow-500',
      helpline: '1800-11-4506'
    },
    {
      id: 'disabled',
      icon: '♿',
      title: translations.disabledCare[language],
      desc: translations.disabledDesc[language],
      color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-900/50',
      iconBg: 'bg-green-500',
      helpline: '1800-180-5316'
    },
    {
      id: 'widow',
      icon: '🙏',
      title: translations.widowSupport[language],
      desc: translations.widowDesc[language],
      color: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-900/50',
      iconBg: 'bg-orange-500',
      helpline: '181'
    },
    {
      id: 'mental',
      icon: '🧠',
      title: translations.mentalHealth[language],
      desc: translations.mentalDesc[language],
      color: 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-900/50',
      iconBg: 'bg-teal-500',
      helpline: '1800-599-0019'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-noto overflow-hidden relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700;900&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap');
        .font-noto { font-family: 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'Noto Sans', sans-serif; }
      `,
        }}
      />

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-rose-300/20 dark:bg-rose-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-amber-300/20 dark:bg-amber-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      {/* Premium Header */}
      <div className="bg-slate-900 py-16 px-6 rounded-b-[70px] shadow-2xl relative overflow-hidden transition-all duration-700 border-b-[12px] border-amber-500">
        <div className="absolute inset-0 z-0">
           <img src="/ngo_background.png" className="w-full h-full object-cover transform scale-105 opacity-50" alt="NGO Community Help" />
           <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
        </div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <div className="grid grid-cols-8 h-full">
              {[...Array(64)].map((_, i) => <div key={i} className="border-r border-b border-white/20"></div>)}
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-12">
            <Link 
              to="/support/non-educated" 
              className="bg-white/20 hover:bg-white/40 p-4 rounded-[24px] backdrop-blur-md transition-all active:scale-90 group"
            >
              <FiArrowLeft className="text-3xl text-white group-hover:-translate-x-1 transition-transform" />
            </Link>
            <LanguageSwitcher />
          </div>
          
          <div className="text-center">
             <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/90 mb-8 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                Humanitarian Aid Portal
             </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter drop-shadow-2xl leading-none">
              {translations.pageTitle[language]}
            </h1>
            <p className="text-xl md:text-3xl font-bold text-white max-w-3xl mx-auto italic drop-shadow-xl opacity-90 leading-relaxed px-4">
              "{translations.pageSubtitle[language]}"
            </p>
          </div>
        </div>
      </div>

      {/* Support Categories */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-20">
        <div className="flex items-center justify-center gap-6 mb-16">
           <div className="h-px w-20 bg-linear-to-r from-transparent to-slate-300 dark:to-slate-800"></div>
           <h2 className="text-2xl md:text-3xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] italic transition-colors text-center">
             {translations.clickForInfo[language]}
           </h2>
           <div className="h-px w-20 bg-linear-to-l from-transparent to-slate-300 dark:to-slate-800"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {supportCategories.map((category) => (
            <div
              key={category.id}
              className={`group bg-white dark:bg-slate-900 rounded-[50px] p-10 border-2 dark:border-slate-800 shadow-xl dark:shadow-none hover:-translate-y-2 transition-all duration-500 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${category.iconBg} opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
              
              {/* Big Icon */}
              <div className="flex justify-center mb-10">
                <div className={`${category.iconBg} w-24 h-24 sm:w-32 sm:h-32 rounded-[35px] flex items-center justify-center text-5xl sm:text-7xl shadow-2xl relative z-10 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}>
                  {category.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-[35px] animate-pulse"></div>
                </div>
              </div>
              
              <div className="text-center relative z-10">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 transition-colors uppercase italic tracking-tighter">
                  {category.title}
                </h3>
                <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-10 font-bold italic leading-relaxed">
                  {category.desc}
                </p>
                
                <div className="space-y-4">
                  {category.helpline && (
                    <a
                      href={`tel:${category.helpline}`}
                      className="flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl py-4 group/btn transition-all hover:bg-green-500 hover:text-white border-2 border-transparent hover:border-green-600"
                    >
                      <FiPhone className="text-2xl text-green-600 dark:text-green-400 group-hover/btn:text-white animate-shake" />
                      <span className="text-2xl font-black tracking-tighter">{category.helpline}</span>
                    </a>
                  )}
                  
                  <Link
                    to={`/support/request-help?category=${category.id}`}
                    className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-black py-5 rounded-[25px] hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    <span>{translations.fillForm[language]}</span>
                    <FiArrowLeft className="rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-End Bottom CTA */}
      <div className="max-w-5xl mx-auto px-4 py-24 relative z-20">
        <div className="bg-slate-900 rounded-[60px] p-16 text-center text-white border-b-[12px] border-slate-800 shadow-[0_40px_80px_rgba(0,0,0,0.3)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-rose-600/30 via-transparent to-amber-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black italic uppercase mb-10 tracking-tighter leading-none drop-shadow-2xl">
              {translations.needHelp[language]}?
            </h2>
            <Link
              to="/support/request-help"
              className="inline-flex items-center gap-6 bg-white text-slate-950 text-xl md:text-3xl font-black px-12 md:px-20 py-6 md:py-8 rounded-[40px] shadow-2xl hover:scale-105 hover:-rotate-2 transition-all active:scale-95 border-b-8 border-slate-200"
            >
              <FiHeart className="text-4xl md:text-6xl text-rose-500 animate-pulse" />
              <span>{translations.fillForm[language]}</span>
            </Link>
          </div>

          {/* Decorative rings */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[20px] border-white/[0.03] rounded-full animate-spin-slow"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 border-[15px] border-white/[0.02] rounded-full"></div>
        </div>
      </div>

      {/* Styled Footer */}
      <footer className="bg-white dark:bg-slate-900/50 py-12 px-6 border-t dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto text-center">
           <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-4">Express Helplines</p>
          <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white transition-colors">
            {language === 'hi' 
              ? 'किसी भी मदद के लिए कॉल करें: 1098, 181, 14567' 
              : language === 'gu' ? 'કોઈપણ મદદ માટે કૉલ કરો: 1098, 181, 14567' : 'For any help, call: 1098, 181, 14567'}
          </p>
          <div className="flex justify-center gap-8 mt-8">
             <div className="w-2 h-2 rounded-full bg-rose-500"></div>
             <div className="w-2 h-2 rounded-full bg-amber-500"></div>
             <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VulnerableSupport;