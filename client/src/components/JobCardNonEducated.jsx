import { useBilingual } from "../hooks/useBilingual";
import QuickApplyButton from "./QuickApplyButton";
import { calculateDistance } from "../utils/geo";

const JobCardNonEducated = ({ job, userLocation }) => {
  const { bt, language } = useBilingual();

  const typeIcons = {
    Construction: "🏗️",
    Mazdoor: "🏗️",
    Delivery: "🚚",
    Cleaning: "🧹",
    Safai: "🧹",
    Security: "👞",
    Shop: "🏪",
    Dukan: "🏪",
    Repair: "🔧",
    Helper: "🤝",
  };

  const getIcon = (type, title) => {
    const combined = (type + " " + title).toLowerCase();
    if (
      combined.includes("mazdoor") ||
      combined.includes("construction") ||
      combined.includes("mistry")
    )
      return "🏗️";
    if (combined.includes("delivery") || combined.includes("courier"))
      return "🚚";
    if (
      combined.includes("safai") ||
      combined.includes("clean") ||
      combined.includes("sweeper")
    )
      return "🧹";
    if (combined.includes("security") || combined.includes("guard"))
      return "👞";
    if (
      combined.includes("shop") ||
      combined.includes("dukan") ||
      combined.includes("retail")
    )
      return "🏪";
    if (
      combined.includes("repair") ||
      combined.includes("mechanic") ||
      combined.includes("plumber")
    )
      return "🔧";
    return "💼";
  };

  const distance =
    job.lat && job.lng && userLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, job.lat, job.lng)
      : null;

  const translations = {
    pay: { en: "Pay", hi: "मजदूरी", gu: "મજૂરી" },
    callNow: { en: "CALL NOW", hi: "अभी फोन करें", gu: "અત્યારે કૉલ કરો" },
    nearby: { en: "NEARBY", hi: "पास में", gu: "નજીકમાં" },
    kmAway: { en: "km away", hi: "किमी दूर", gu: "કિમી દૂર" },
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[40px] shadow-xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border-2 border-white dark:border-slate-800 overflow-hidden hover:-translate-y-2 transition-all duration-500 group">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="bg-slate-900 dark:bg-white w-24 h-24 rounded-[30px] flex items-center justify-center text-6xl shadow-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 relative">
             <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-500 rounded-full opacity-50 blur-sm"></div>
            {getIcon(job.workType || "", job.title || "")}
          </div>
          {distance !== null && distance < 10 && (
            <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-6 py-2.5 rounded-full font-black flex items-center gap-2 border-2 border-indigo-200 dark:border-indigo-800 transition-colors shadow-sm text-xs tracking-widest uppercase">
              <span className="text-xl animate-pulse">📍</span>
              {bt(translations.nearby)}
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              {distance.toFixed(1)} {bt(translations.kmAway)}
            </div>
          )}
        </div>

        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 uppercase italic tracking-tighter transition-colors leading-none">
          {job.title}
        </h3>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 line-clamp-2 font-bold italic opacity-80 transition-colors leading-relaxed">
          {job.description}
        </p>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[30px] border-2 border-slate-100 dark:border-white/5 transition-all group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] mb-2">
              {bt(translations.pay)}
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              ₹{job.salary || "---"}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[30px] border-2 border-slate-100 dark:border-white/5 transition-all group-hover:border-blue-200 dark:group-hover:border-blue-500/30">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] mb-2">
              {language === "hi" ? "स्थान" : language === "gu" ? "સ્થાન" : "LOCATION"}
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase truncate italic">
              {job.location}
            </p>
          </div>
        </div>

        <div className="transform group-hover:scale-[1.02] transition-transform duration-500">
          <QuickApplyButton
            phoneNumber={job.contactNumber}
            label={bt(translations.callNow)}
          />
        </div>
      </div>
    </div>
  );
};

export default JobCardNonEducated;
