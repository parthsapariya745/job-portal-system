import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBilingual } from '../hooks/useBilingual';
import GujaratNgoCard from '../components/GujaratNgoCard';
import LanguageToggle from '../components/LanguageToggle';
import VoiceSearch from '../components/VoiceSearch';
import gujaratNGOs from '../data/gujaratNGOs.json';
import { getCurrentLocation, calculateDistance } from '../utils/geo';
import { FiNavigation, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

const GujaratSpecialNeeds = () => {
  const { bt, language } = useBilingual();
  const [selectedCategory, setSelectedCategory] = useState('elderly');
  const [userLocation, setUserLocation] = useState(null);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getCurrentLocation()
      .then(loc => setUserLocation(loc))
      .catch(() => console.log("Location access denied"));
  }, []);

  const categories = [
    { id: 'elderly', gu: 'વૃદ્ધાશ્રમ', hi: 'वृद्धाश्रम', en: 'Elderly Care', icon: '👴', photo: '/cat-elderly.png' },
    { id: 'orphan', gu: 'અનાથ બાળક', hi: 'अनाथ बालक', en: 'Orphan Support', icon: '👶', photo: '/cat-orphan.png' },
    { id: 'disabled', gu: 'દિવ્યાંગ સહાયતા', hi: 'दिव्याંગ सहायता', en: 'Disabled Support', icon: '♿', photo: '/cat-disabled.png' },
    { id: 'widow', gu: 'વિધવા સહાય', hi: 'विधवा सहायता', en: 'Widow Help', icon: '🙏', photo: '/cat-widow.png' },
    { id: 'mental', gu: 'માનસિક સ્વાસ્થ્ય', hi: 'मानसिक स्वास्थ्य', en: 'Mental Health', icon: '🧠', photo: '/cat-mental.png' }
  ];

  const onVoiceResult = (text) => {
    setSearchTerm(text);
    const msg = {
      gu: `શોધી રહ્યા છીએ: ${text}`,
      hi: `खोज रहे हैं: ${text}`,
      en: `Searching for: ${text}`
    };
    toast.success(bt(msg));
  };

  const filteredNGOs = gujaratNGOs.filter(ngo => {
    const matchesCategory = ngo.category === selectedCategory;
    const searchLow = searchTerm.toLowerCase();
    
    // Search in all languages
    const matchesSearch = !searchTerm || 
      ngo.name.en.toLowerCase().includes(searchLow) || 
      ngo.name.hi.toLowerCase().includes(searchLow) || 
      ngo.name.gu.toLowerCase().includes(searchLow) ||
      ngo.city.gu.toLowerCase().includes(searchLow);

    if (showNearbyOnly && userLocation && ngo.lat && ngo.lng) {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, ngo.lat, ngo.lng);
      return matchesCategory && matchesSearch && dist <= 50;
    }
    return matchesCategory && matchesSearch;
  });

  const translations = {
    title: { en: 'GUJARAT SPECIAL HELP', hi: 'गुजरात विशेष सहायता', gu: 'ગુજરાત વિશેષ સહાય' },
    subtitle: { en: 'Work/Job Support for Vulnerable Groups in Gujarat', hi: 'गुजरात में कमजोर समूहों के लिए काम/नौकरी सहायता', gu: 'ગુજરાતમાં નબળા જૂથો માટે કામ/નોકરી સહાય' },
    nearbyBtn: { en: 'SHOW NEARBY (50KM)', hi: 'पास में दिखाएं (50KM)', gu: 'પાસમાં બતાવો (50KM)' },
    searchPlace: { en: 'Speak or type...', hi: 'बोलें या लिखें...', gu: 'બોલો અથવા લખો...' },
    noResults: { en: 'No results found', hi: 'कोई परिणाम नहीं मिला', gu: 'કોઈ પરિણામ મળ્યું નથી' }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-noto transition-colors duration-300 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700;900&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap');
        .font-noto { font-family: 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'Noto Sans', sans-serif; }
      `}} />

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-4000 pointer-events-none transition-colors duration-500"></div>

      <LanguageToggle />

      {/* Header */}
      <div className="bg-linear-to-b from-blue-800 to-indigo-700 dark:from-blue-900 dark:to-slate-900 text-white pt-16 pb-32 px-6 rounded-b-[80px] shadow-2xl relative overflow-hidden transition-all duration-700">
        <Link to="/support/non-educated" className="absolute top-8 left-8 z-30 bg-white/20 hover:bg-white/40 p-4 rounded-2xl backdrop-blur-md transition-all active:scale-90 group">
          <FiNavigation className="text-3xl rotate-[-90deg] group-hover:-translate-y-1 transition-transform" />
        </Link>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 h-full">
            {[...Array(24)].map((_, i) => <div key={i} className="border-r border-b border-white"></div>)}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-white/20">
             <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
             Direct Support System
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase italic tracking-tighter drop-shadow-2xl leading-none">
            {bt(translations.title)}
          </h1>
          <p className="text-xl md:text-3xl font-bold opacity-80 uppercase tracking-widest italic max-w-4xl mx-auto">
            {bt(translations.subtitle)}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 space-y-16 relative z-20">
        
        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 md:p-6 rounded-[50px] shadow-2xl flex items-center gap-4 border-2 border-white dark:border-slate-800 transition-all hover:border-indigo-400 dark:hover:border-indigo-500">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl">
              <FiSearch className="text-3xl text-slate-400 dark:text-slate-500" />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={bt(translations.searchPlace)}
                className="w-full h-16 text-2xl font-black rounded-3xl bg-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white transition-colors"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <VoiceSearch onResult={onVoiceResult} />
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowNearbyOnly(!showNearbyOnly)}
            className={`flex items-center justify-center gap-4 px-8 py-6 rounded-[50px] font-black text-xl border-b-[8px] shadow-2xl transition-all active:scale-95 ${
              showNearbyOnly ? 'bg-green-600 text-white border-green-800' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 dark:border-slate-200'
            }`}
          >
            <FiNavigation className={`text-3xl transition-transform ${showNearbyOnly ? 'animate-bounce' : ''}`} />
            <span className="tracking-[0.1em] uppercase">{bt(translations.nearbyBtn)}</span>
          </button>
        </div>

        {/* Categories Carousel/Grid */}
        <div className="space-y-8">
           <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500">Select Support Category</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group relative h-80 rounded-[50px] overflow-hidden border-8 transition-all shadow-2xl active:scale-95 ${
                  selectedCategory === cat.id ? 'border-orange-500 scale-105' : 'border-white dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <img src={cat.photo} alt={bt(cat)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                <div className={`absolute inset-0 bg-linear-to-t transition-opacity duration-500 ${selectedCategory === cat.id ? 'from-orange-600/90' : 'from-slate-950/80 group-hover:from-indigo-600/80'}`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4 drop-shadow-lg transform transition-transform group-hover:scale-110 duration-500">{cat.icon}</span>
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-white leading-tight uppercase italic drop-shadow-md">
                      {cat.gu}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-100/70">{cat.hi} / {cat.en}</p>
                  </div>
                </div>
                {selectedCategory === cat.id && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    ✨
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Sections */}
        <div className="space-y-12">
          <div className="flex items-center gap-8">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-4 transition-colors">
              <span className="text-4xl">💎</span>
              {bt(categories.find(c => c.id === selectedCategory))} Listings
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredNGOs.length > 0 ? (
              filteredNGOs.map(ngo => (
                <GujaratNgoCard key={ngo.id} ngo={ngo} />
              ))
            ) : (
              <div className="col-span-full py-40 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[80px] border-4 border-dashed border-slate-200 dark:border-slate-800 transition-colors group">
                <span className="text-9xl block mb-8 transition-transform group-hover:rotate-12 duration-500">🔍</span>
                <p className="text-4xl font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter max-w-md mx-auto leading-none">
                  {bt(translations.noResults)}
                </p>
                <button onClick={() => {setSearchTerm(''); setShowNearbyOnly(false);}} className="mt-10 px-8 py-3 bg-indigo-600 text-white text-xs font-black rounded-full uppercase tracking-widest hover:bg-indigo-700 transition-colors active:scale-95">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GujaratSpecialNeeds;
