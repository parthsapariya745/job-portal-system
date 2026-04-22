import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSupportCategories } from "../redux/slices/supportCategorySlice";
import { fetchSupportServices } from "../redux/slices/supportServiceSlice";
import { fetchSupportOrganizations } from "../redux/slices/supportOrganizationSlice";
import { createHelpRequest } from "../redux/slices/supportRequestSlice";
import {
  FiBriefcase,
  FiArrowRight,
  FiPhone,
  FiUser,
  FiHeart,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

const NonEducated = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.supportCategory);
  const { services } = useSelector((state) => state.supportService);
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    category: "",
    description: "",
  });

  const translations = {
    pageTitle: {
      en: "Support & Assistance Programs",
      hi: "सहायता और समर्थन कार्यक्रम",
      gu: "સહાય અને સમર્થન કાર્યક્રમો",
    },
    pageSubtitle: {
      en: "Find government welfare programs, NGO support services, and employment opportunities for those in need.",
      hi: "जरूरतमंदों के लिए सरकारी कार्यक्रम, एनजीओ सेवाएं और रोजगार के अवसर खोजें।",
      gu: "જરૂરિયાતમંદ લોકો માટે સરકારી યોજનાઓ, NGO સેવાઓ અને નોકરીની તકો શોધો.",
    },
    findWork: { en: "FIND WORK", hi: "काम खोजें", gu: "કામ શોધો" },
    gujaratHelp: {
      en: "GUJARAT SPECIAL HELP",
      hi: "गुजरात विशेष सहायता",
      gu: "ગુજરાત વિશેષ સહાય",
    },
    specialCareTitle: {
      en: "For Those Who Need Special Care",
      hi: "विशेष देखभाल चाहने वालों के लिए",
      gu: "ખાસ સંભાળની જરૂર હોય તેવા લોકો માટે",
    },
    specialCareSub: {
      en: "Elderly, Children, Sheltered, Disabled - Easy help available here",
      hi: "बुजुर्ग, बच्चे, आश्रय, विकलांग - आसान मदद यहाँ मिलेगी",
      gu: "વૃદ્ધો, બાળકો, આશ્રય, દિવ્યાંગો - અહીં સરળતાથી મદદ મળશે",
    },
    seeForHelp: {
      en: "See for Help",
      hi: "सभी सहायता देखें",
      gu: "બધી સહાય જુઓ",
    },
    callFormTitle: {
      en: "Call and Fill Simple Form",
      hi: "कॉल करें और सरल फॉर्म भरें",
      gu: "કોલ કરો અને સરળ ફોર્મ ભરો",
    },
    callFormSub: {
      en: "Tell us who you are and what you need. We will call you soon.",
      hi: "हमें बताएं कि आप कौन हैं और आपको क्या चाहिए। हम आपको जल्द ही कॉल करेंगे।",
      gu: "અમને જણાવો કે તમે કોણ છો અને તમારે શું જોઈએ છે. અમે તમને જલ્દી કોલ કરીશું.",
    },
    fullName: { en: "Your Name", hi: "आपका नाम", gu: "તમારું નામ" },
    phoneNum: { en: "Phone Number", hi: "फोन नंबर", gu: "ફોન નંબર" },
    selectCategory: {
      en: "Select Category",
      hi: "श्रेणी चुनें",
      gu: "કેટેગરી પસંદ કરો",
    },
    submitBtn: { en: "SUBMIT REQUEST", hi: "अनुरोध भेजें", gu: "વિનંતી મોકલો" },
  };

  const t = (key) => translations[key]?.[language] || translations[key]?.["en"];

  useEffect(() => {
    dispatch(fetchSupportCategories());
    dispatch(fetchSupportServices());
  }, [dispatch]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contactNumber) {
      toast.error(
        language === "hi"
          ? "नाम और नंबर जरूरी है"
          : "Name and Phone are required",
      );
      return;
    }
    dispatch(createHelpRequest(formData));
    toast.success(
      language === "hi"
        ? "अनुरोध भेजा गया! हम आपसे संपर्क करेंगे।"
        : "Request Sent! We will contact you soon.",
    );
    setFormData({ name: "", contactNumber: "", category: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-noto transition-colors duration-300 overflow-hidden relative">
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
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-orange-300/20 dark:bg-orange-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      {/* Hero Section */}
      <div
        className="relative py-20 lg:py-32 bg-slate-900 rounded-b-[80px] border-b-[12px] border-indigo-600 dark:border-indigo-900 shadow-2xl relative overflow-hidden transition-all duration-700"
      >
        <div className="absolute inset-0 z-0">
           <img src="/hero-bg.png" className="w-full h-full object-cover transform scale-105 opacity-60" alt="" />
           <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-slate-900/50 to-slate-900/80"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="flex justify-between items-center mb-12">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
               Community Support Portal
            </div>
            <LanguageSwitcher />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 uppercase italic tracking-tighter drop-shadow-2xl leading-none">
            {t("pageTitle")}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100/90 max-w-4xl mx-auto mb-16 italic px-4 leading-relaxed">
            "{t("pageSubtitle")}"
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <Link
              to="/support/gujarat"
              className="group relative inline-flex items-center gap-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 sm:px-12 py-5 sm:py-6 rounded-[40px] font-black hover:scale-105 transition-all shadow-2xl text-xl sm:text-2xl border-b-8 border-slate-200 dark:border-slate-950 active:scale-95"
            >
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] px-3 py-1 font-black uppercase tracking-widest rounded-bl-xl shadow-lg">
                Exclusive 📍
              </div>
              <span className="text-4xl group-hover:rotate-12 transition-transform">🏛️</span>{" "}
              {t("gujaratHelp")}
            </Link>
            <Link
              to="/work-opportunities"
              className="inline-flex items-center gap-4 bg-indigo-600 text-white px-8 sm:px-12 py-5 sm:py-6 rounded-[40px] font-black hover:bg-indigo-700 transition-all shadow-2xl text-xl sm:text-2xl border-b-8 border-indigo-900 active:scale-95"
            >
              <FiBriefcase className="w-8 h-8 sm:w-10 sm:h-10" />{" "}
              {t("findWork")}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-24 space-y-36">
        {/* Section: Special Care */}
        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[70px] p-10 md:p-20 border-2 border-white dark:border-slate-800 shadow-xl relative transition-all group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-orange-500/5 to-transparent pointer-events-none transition-colors duration-700"></div>
          
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic leading-none mb-6 tracking-tighter transition-colors">
              {t("specialCareTitle")}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-500 dark:text-slate-400 italic opacity-80 max-w-4xl mx-auto transition-colors">
              {t("specialCareSub")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
            {[
              {
                icon: "👴",
                n: { en: "Old Age", hi: "वृद्धाश्रम", gu: "વૃદ્ધાશ્રમ" },
                color: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30",
                path: "/support/elderly",
              },
              {
                icon: "👶",
                n: { en: "Children", hi: "बच्चों की", gu: "બાળકો" },
                color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
                path: "/support/vulnerable",
              },
              {
                icon: "🏠",
                n: { en: "Shelter", hi: "आश्रय", gu: "આશ્રય" },
                color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30",
                path: "/support/vulnerable",
              },
              {
                icon: "♿",
                n: { en: "Disabled", hi: "विकलांग", gu: "દિવ્યાંગ" },
                color: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30",
                path: "/support/vulnerable",
              },
              {
                icon: "🙏",
                n: { en: "Widows", hi: "विधवा", gu: "વિધવા" },
                color: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
                path: "/support/vulnerable",
              },
              {
                icon: "🧠",
                n: { en: "Mental", hi: "मानसिक", gu: "માનસિક" },
                color: "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/30",
                path: "/support/vulnerable",
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`${item.color} rounded-[40px] p-8 text-center shadow-lg hover:shadow-2xl transition-all border-4 border-white dark:border-slate-800 hover:-translate-y-2 group/card active:scale-95`}
              >
                <div className="text-6xl mb-4 group-hover/card:scale-125 transition-transform duration-500 drop-shadow-lg">
                  {item.icon}
                </div>
                <div className="font-black uppercase text-xs font-noto leading-tight transition-colors tracking-widest">
                  {item.n[language] || item.n.en}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 text-center relative z-10">
            <Link
              to="/support/vulnerable"
              className="inline-flex items-center gap-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl sm:text-2xl font-black px-12 sm:px-16 py-5 sm:py-6 rounded-[35px] shadow-2xl hover:scale-105 transition-all border-b-8 border-slate-700 dark:border-slate-300"
            >
              <FiHeart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" />
              {t("seeForHelp")}
              <FiArrowRight className="w-8 h-8 sm:w-10 sm:h-10 opacity-50" />
            </Link>
          </div>
        </section>

        {/* Section: Simple Form */}
        <section className="relative z-10 transition-colors">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[70px] p-10 md:p-20 shadow-2xl border-b-[16px] border-green-600 dark:border-green-900 border-r-8 border-white/50 dark:border-slate-800 transition-colors group overflow-hidden relative">
             <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-green-500/10 transition-colors duration-700"></div>
            
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
              <div className="w-32 h-32 bg-green-100 dark:bg-green-900/50 rounded-[40px] flex items-center justify-center text-6xl shadow-xl transition-all group-hover:rotate-12 group-hover:scale-110">
                📞
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic leading-none mb-6 tracking-tighter">
                  {t("callFormTitle")}
                </h2>
                <p className="text-xl md:text-2xl font-bold text-slate-400 dark:text-slate-500 italic max-w-2xl leading-relaxed">
                  {t("callFormSub")}
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 transition-colors">
                    <FiUser className="text-green-500 w-5 h-5" />{" "}
                    {t("fullName")}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-16 sm:h-20 px-8 text-xl sm:text-2xl font-black bg-slate-50 dark:bg-slate-800/50 border-4 border-slate-100 dark:border-slate-800 rounded-[35px] focus:border-green-500 dark:focus:border-green-500 outline-none transition-all font-noto text-slate-900 dark:text-white placeholder:opacity-20 shadow-inner"
                    placeholder="Enter your name..."
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 transition-colors">
                    <FiPhone className="text-green-500 w-5 h-5" />{" "}
                    {t("phoneNum")}
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                    className="w-full h-16 sm:h-20 px-8 text-xl sm:text-2xl font-black bg-slate-50 dark:bg-slate-800/50 border-4 border-slate-100 dark:border-slate-800 rounded-[35px] focus:border-green-500 dark:focus:border-green-500 outline-none transition-all font-noto text-slate-900 dark:text-white placeholder:opacity-20 shadow-inner"
                    placeholder="Enter phone number..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-6 sm:py-8 rounded-[40px] text-2xl sm:text-4xl font-black shadow-2xl hover:bg-green-700 transition-all active:scale-95 border-b-[12px] border-green-900 uppercase italic flex items-center justify-center gap-8 group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                <FiHeart className="w-10 h-10 md:w-14 md:h-14 group-hover/btn:scale-125 transition-transform" />
                <span>{t("submitBtn")}</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NonEducated;
