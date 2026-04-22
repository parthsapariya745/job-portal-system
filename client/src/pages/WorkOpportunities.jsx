import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchNonEducatedOpportunities } from "../redux/slices/workOpportunitySlice";
import { useBilingual } from "../hooks/useBilingual";
import LanguageToggle from "../components/LanguageToggle";
import VoiceSearch from "../components/VoiceSearch";
import JobCardNonEducated from "../components/JobCardNonEducated";
import EmployerPostModal from "../components/EmployerPostModal";
import { getCurrentLocation, calculateDistance } from "../utils/geo";
import { FiPlus, FiNavigation, FiMessageSquare } from "react-icons/fi";
import { toast } from "react-toastify";

const WorkOpportunities = () => {
  const dispatch = useDispatch();
  const { bt, language } = useBilingual();
  const { nonEducatedOpportunities, isLoading } = useSelector(
    (state) => state.workOpportunities,
  );

  const locationParams = useLocation();
  const searchParams = new URLSearchParams(locationParams.search);
  const querySearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [userLocation, setUserLocation] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    dispatch(fetchNonEducatedOpportunities());
    // Auto-detect location for nearby feature
    getCurrentLocation()
      .then((loc) => setUserLocation(loc))
      .catch(() => console.log("Location access denied"));
  }, [dispatch]);

  const onVoiceResult = (text) => {
    setSearchTerm(text);
    toast.success(
      `${language === "hi" ? "खोज रहे हैं" : language === "gu" ? "શોધી રહ્યા છીએ" : "Searching for"}: ${text}`,
    );
  };

  const filteredOpportunities = nonEducatedOpportunities
    ?.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.workType?.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterCategory && job.workType !== filterCategory) {
        return false;
      }

      if (showNearbyOnly && userLocation && job.lat && job.lng) {
        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          job.lat,
          job.lng,
        );
        return matchesSearch && dist <= 5; // 5km radius
      }

      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by distance if location is available
      if (userLocation && a.lat && a.lng && b.lat && b.lng) {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.lat,
          a.lng,
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.lat,
          b.lng,
        );
        return distA - distB;
      }
      return 0;
    });

  const translations = {
    pageTitle: { en: "FIND WORK", hi: "काम खोजें", gu: "કામ શોધો" },
    pageSubtitle: {
      en: "Nearby jobs for you. Direct call to owners.",
      hi: "आपके पास के काम। मालिक को सीधा फोन करें।",
      gu: "તમારા માટે નજીકના કામ. માલિકોને સીધો કૉલ કરો.",
    },
    postWork: { en: "POST WORK", hi: "काम दें", gu: "કામ આપો" },
    searchHint: {
      en: "Speak or type work name...",
      hi: "काम का नाम बोलें या लिखें...",
      gu: "કામનું નામ બોલો અથવા લખો...",
    },
    nearbyBtn: { en: "SHOW NEARBY (5KM)", hi: "पास के काम (5किमी)", gu: "નજીકના કામ જુઓ (5 કિમી)" },
    smsAlerts: { en: "GET JOB SMS", hi: "काम के मैसेज पाएं", gu: "કામના મેસેજ મેળવો" },
    smsHint: {
      en: "Call 01234-56789 to register",
      hi: "पंजीकरण के लिए 01234-56789 पर कॉल करें",
      gu: "નોંધણી કરવા 01234-56789 પર કૉલ કરો",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-40 font-noto transition-colors duration-300 overflow-hidden relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700;900&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap');
        .font-noto { font-family: 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'Noto Sans', sans-serif; }
      `,
        }}
      />

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-4000 pointer-events-none transition-colors duration-500"></div>

      <LanguageToggle />

      {/* Hero Header */}
      <div className="bg-linear-to-b from-blue-700 to-indigo-600 dark:from-blue-900 dark:to-slate-900 text-white pt-16 pb-32 px-6 rounded-b-[80px] shadow-2xl relative overflow-hidden transition-all duration-700">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
           <div className="grid grid-cols-10 h-full">
              {[...Array(100)].map((_, i) => <div key={i} className="border-r border-b border-white/20"></div>)}
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white/90 mb-8 border border-white/20">
             <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
             Direct Hire network
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase italic tracking-tighter drop-shadow-2xl leading-none">
            {bt(translations.pageTitle)}
          </h1>
          <p className="text-xl md:text-3xl font-bold opacity-80 uppercase tracking-[0.1em] italic max-w-4xl mx-auto">
            {bt(translations.pageSubtitle)}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 space-y-8 relative z-20">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 md:p-6 rounded-[50px] shadow-2xl flex items-center gap-4 border-2 border-white dark:border-slate-800 transition-all hover:border-blue-400">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={bt(translations.searchHint)}
              className="w-full h-16 md:h-20 pl-8 pr-20 text-xl md:text-2xl font-black rounded-[30px] bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 text-slate-900 dark:text-white transition-all shadow-inner placeholder:opacity-30"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <VoiceSearch onResult={onVoiceResult} />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
           <select 
             value={filterCategory} 
             onChange={(e) => setFilterCategory(e.target.value)}
             className="flex-1 h-20 rounded-[35px] font-black px-6 border-b-[8px] bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none text-xl text-slate-900 dark:text-white shadow-xl"
           >
             <option value="">{language === 'hi' ? 'सभी काम' : language === 'gu' ? 'બધા કામ' : 'All Categories'}</option>
             <option value="Mazdoor">Mazdoor</option>
             <option value="Delivery">Delivery</option>
             <option value="Safai">Safai</option>
             <option value="Security">Security</option>
             <option value="Dukan">Dukan</option>
             <option value="Repair">Repair</option>
           </select>
          <button
            onClick={() => setShowNearbyOnly(!showNearbyOnly)}
            className={`flex-1 h-20 rounded-[35px] font-black flex items-center justify-center gap-4 border-b-[8px] transition-all text-xl active:scale-95 shadow-xl ${
              showNearbyOnly
                ? "bg-green-600 text-white border-green-800"
                : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 dark:border-slate-200"
            }`}
          >
            <FiNavigation className={`text-3xl ${showNearbyOnly ? 'animate-bounce' : ''}`} />
            <span className="uppercase tracking-widest">{bt(translations.nearbyBtn)}</span>
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex-1 h-20 bg-blue-600 text-white rounded-[35px] font-black flex items-center justify-center gap-4 border-b-[8px] border-blue-900 hover:bg-blue-700 active:scale-95 shadow-xl text-xl"
          >
            <FiPlus className="text-3xl" />
            <span className="uppercase tracking-widest">{bt(translations.postWork)}</span>
          </button>
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-5xl mx-auto px-4 mt-20 space-y-12 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center py-40 gap-8">
             <div className="relative">
                <div className="w-24 h-24 border-[12px] border-slate-200 dark:border-slate-800 rounded-full"></div>
                <div className="w-24 h-24 border-[12px] border-t-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
             </div>
            <p className="text-3xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest animate-pulse">
              Finding opportunities...
            </p>
          </div>
        ) : filteredOpportunities?.length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-24 rounded-[70px] text-center shadow-xl border-4 border-dashed border-slate-200 dark:border-slate-800 transition-colors group">
            <span className="text-9xl block mb-8 transition-transform group-hover:rotate-12 duration-500">🏠</span>
            <p className="text-4xl font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter transition-colors max-w-sm mx-auto leading-none">
              {language === "hi" ? "कोई काम नहीं मिला" : language === "gu" ? "કોઈ કામ મળ્યું નથી" : "No work found at the moment"}
            </p>
            <button onClick={() => {setSearchTerm(''); setShowNearbyOnly(false);}} className="mt-10 px-8 py-3 bg-blue-600 text-white text-xs font-black rounded-full uppercase tracking-widest hover:bg-blue-700 transition-colors active:scale-95">Clear Search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {filteredOpportunities.map((job) => (
              <JobCardNonEducated
                key={job._id}
                job={job}
                userLocation={userLocation}
              />
            ))}
          </div>
        )}
      </div>

      {/* SMS Alert Section */}
      <div className="max-w-5xl mx-auto px-4 mt-32 mb-20 relative z-10">
        <div className="bg-indigo-900 dark:bg-indigo-950 text-white p-16 rounded-[70px] shadow-2xl flex flex-col md:flex-row items-center text-center md:text-left gap-12 border-b-[16px] border-indigo-950 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-blue-600/20 to-transparent pointer-events-none"></div>
          
          <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[45px] shadow-2xl relative z-10 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 border border-white/20">
            <FiMessageSquare className="text-7xl text-indigo-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
          </div>
          
          <div className="flex-1 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter leading-none">
              {bt(translations.smsAlerts)}
            </h2>
            <p className="text-xl md:text-2xl font-bold opacity-70 italic max-w-xl">
              {bt(translations.smsHint)}
            </p>
          </div>
          
          <a
            href="tel:0123456789"
            className="bg-white text-indigo-900 px-16 py-8 rounded-[35px] text-3xl font-black shadow-2xl hover:scale-110 hover:rotate-3 transition-all active:scale-95 border-b-8 border-slate-200 relative z-10 group/call overflow-hidden"
          >
             <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-50 to-transparent translate-x-[-100%] group-hover/call:translate-x-[100%] transition-transform duration-700"></div>
            {language === "hi" ? "मिस्डकॉल दें" : language === "gu" ? "મિસ્ડ કૉલ આપો" : "GIVE MISSED CALL"}
          </a>
          
          {/* Animated decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 border-[15px] border-white/5 rounded-full animate-ping"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 border-[10px] border-white/5 rounded-full animate-pulse"></div>
        </div>
      </div>

      <EmployerPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
};

export default WorkOpportunities;
