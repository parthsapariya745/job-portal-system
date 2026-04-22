import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FiArrowLeft, FiPhone, FiMapPin, FiBriefcase, FiNavigation } from 'react-icons/fi';
import gujaratNGOs from '../data/gujaratNGOs.json';

const ElderlyCare = () => {
  const { language } = useLanguage();
  
  // Filter only elderly category
  const elderlyNGOs = gujaratNGOs.filter(ngo => ngo.category === 'elderly');

  const translations = {
    title: { 
      en: 'Elderly Care Support', 
      hi: 'वृद्धाश्रम सहायता', 
      gu: 'વૃદ્ધાશ્રમ સહાય' 
    },
    subtitle: { 
      en: 'Jobs and Home Support for Senior Citizens in Gujarat', 
      hi: 'गुजरात में वरिष्ठ नागरिकों के लिए रोजगार और आवास सहायता', 
      gu: 'ગુજરાતમાં વરિષ્ઠ નાગરિકો માટે નોકરી અને આવાસ સહાય' 
    },
    back: { en: 'Back', hi: 'वापस', gu: 'પાછા' },
    callNow: { en: 'CALL NOW', hi: 'अभी कॉल करें', gu: 'અત્યારે કોલ કરો' },
    location: { en: 'Location', hi: 'स्थान', gu: 'સ્થળ' },
    jobAvailable: { en: 'Work/Job', hi: 'काम/नौकरी', gu: 'કામ/નોકરી' },
    sadbhavnaNote: { 
        en: 'If an elderly person has no home, they can find shelter here.', 
        hi: 'अगर किसी बुजुर्ग के पास घर नहीं है, तो वे यहाँ आसरा पा सकते हैं।', 
        gu: 'જો કોઈ વૃદ્ધ પાસે ઘર ન હોય, તો તેઓ અહીં આશરો મેળવી શકે છે.'
    }
  };

  const t = (key) => translations[key]?.[language] || translations[key]?.['en'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-noto transition-colors duration-300 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700;900&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap');
        .font-noto { font-family: 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'Noto Sans', sans-serif; }
      `}} />

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-300/20 dark:bg-orange-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-300/20 dark:bg-amber-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-4000 pointer-events-none transition-colors duration-500"></div>

      {/* Header */}
      <div className="bg-linear-to-r from-orange-600 to-amber-600 dark:from-orange-700 dark:to-orange-900 text-white py-16 px-6 rounded-b-[60px] shadow-2xl relative overflow-hidden transition-all duration-700">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-12">
            <Link to="/support/non-educated" className="bg-white/20 hover:bg-white/40 p-4 rounded-[24px] backdrop-blur-md transition-all group active:scale-90">
              <FiArrowLeft className="text-3xl group-hover:-translate-x-1 transition-transform" />
            </Link>
            <LanguageSwitcher />
          </div>
          
          <div className="text-center">
             <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                Gujarat State Initiative
             </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase italic tracking-tighter drop-shadow-2xl leading-none">
              {t('title')}
            </h1>
            <p className="text-xl md:text-3xl font-bold opacity-90 italic max-w-3xl mx-auto leading-relaxed">
              "{t('subtitle')}"
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-900/30 rounded-full blur-3xl"></div>
      </div>

      {/* NGO List */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {elderlyNGOs.map((ngo) => (
            <div 
              key={ngo.id} 
              className={`group bg-white dark:bg-slate-900 rounded-[50px] overflow-hidden shadow-xl dark:shadow-none transition-all hover:-translate-y-2 border-4 ${ngo.name.en.includes('Sadbhavna') ? 'border-orange-500 ring-8 ring-orange-100 dark:ring-orange-900/20' : 'border-white dark:border-slate-800'}`}
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={ngo.photo || '/cat-elderly.png'} 
                  alt={ngo.name[language]} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 right-6 bg-orange-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                  {ngo.city[language]}
                </div>
                {ngo.name.en.includes('Sadbhavna') && (
                  <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-orange-950/90 to-transparent px-8 py-6 backdrop-blur-[2px]">
                    <p className="text-white text-sm font-black italic leading-tight flex items-center gap-2">
                       <span className="text-2xl">🏡</span> {t('sadbhavnaNote')}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-10">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 font-noto leading-tight transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-500">
                  {ngo.name[language]}
                </h3>
                
                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl transition-colors">
                        <FiMapPin className="text-orange-600 dark:text-orange-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 transition-colors">{t('location')}</p>
                      <p className="font-bold text-lg font-noto dark:text-slate-200 leading-tight">{ngo.address[language]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl transition-colors">
                         <FiBriefcase className="text-green-600 dark:text-green-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 transition-colors">{t('jobAvailable')}</p>
                      <p className="font-bold text-lg text-green-700 dark:text-green-400 font-noto transition-colors">{ngo.job[language]}</p>
                    </div>
                  </div>
                </div>

                <a 
                  href={`tel:${ngo.phone}`} 
                  className="flex items-center justify-center gap-4 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[35px] font-black text-xl shadow-xl hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white transition-all active:scale-95 group/btn"
                >
                  <FiPhone className="text-2xl group-hover/btn:animate-shake" />
                  <span className="uppercase tracking-[0.1em]">{t('callNow')}</span>
                </a>
                
                <div className="mt-6 text-center">
                  <p className="text-xl font-black text-slate-900 dark:text-slate-400 group-hover:text-orange-600 transition-all font-mono tracking-tighter">{ngo.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency CTA */}
      <div className="max-w-5xl mx-auto px-4 pb-24 relative z-10">
        <div className="bg-slate-900 dark:bg-slate-900 rounded-[60px] p-16 text-center text-white border-b-[12px] border-slate-800 dark:border-slate-950 relative overflow-hidden transition-all shadow-[0_40px_80px_rgba(0,0,0,0.3)] group">
           <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-orange-600/30 via-transparent to-indigo-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-8 tracking-tighter leading-none">
              {language === 'gu' ? 'કોઈ મદદ જોઈએ છે?' : language === 'hi' ? 'कोई मदद चाहिए?' : 'NEED URGENT HELP?'}
            </h2>
            <p className="text-xl md:text-2xl font-bold opacity-80 mb-12 italic text-slate-300 max-w-2xl mx-auto">
              {language === 'gu' ? 'જો તમારી પાસે રહેવાની જગ્યા નથી, તો અમારો સંપર્ક કરો.' : language === 'hi' ? 'अगर आपके पास रहने की जगह नहीं है, तो हमसे संपर्क करें।' : 'If you have no place to stay, contact us immediately.'}
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <a href="tel:108" className="bg-white text-orange-600 px-12 py-6 rounded-[30px] font-black text-4xl shadow-2xl flex items-center gap-5 hover:scale-110 hover:-rotate-3 transition-all border-b-8 border-slate-200">
                🚑 108
              </a>
              <a href="tel:100" className="bg-white text-red-600 px-12 py-6 rounded-[30px] font-black text-4xl shadow-2xl flex items-center gap-5 hover:scale-110 hover:rotate-3 transition-all border-b-8 border-slate-200">
                🚨 100
              </a>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default ElderlyCare;
