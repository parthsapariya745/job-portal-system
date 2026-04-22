import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { searchJobs } from "../redux/slices/jobsSlice";
import { fetchNonEducatedOpportunities } from "../redux/slices/workOpportunitySlice";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaRocket,
  FaArrowRight,
  FaUserGraduate,
  FaHandsHelping,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { language } = useLanguage();
  const { jobs: educatedJobs } = useSelector((state) => state.jobs);
  const { nonEducatedOpportunities } = useSelector((state) => state.workOpportunities);

  const [eduSearch, setEduSearch] = useState('');
  const [nonEduSearch, setNonEduSearch] = useState('');

  useEffect(() => {
    dispatch(searchJobs({}));
    dispatch(fetchNonEducatedOpportunities());
  }, [dispatch]);

  const handleEduSearch = (e) => {
    e.preventDefault();
    if (eduSearch.trim()) {
      navigate(`/jobs/search?keyword=${encodeURIComponent(eduSearch.trim())}`);
    } else {
      navigate(user ? '/jobs/search' : '/register/jobseeker');
    }
  };

  const handleNonEduSearch = (e) => {
    e.preventDefault();
    if (nonEduSearch.trim()) {
      navigate(`/work-opportunities?search=${encodeURIComponent(nonEduSearch.trim())}`);
    } else {
      navigate('/support/non-educated');
    }
  };

  const labels = {
    heroTitle_1: { en: "Find Your", hi: "अपना", gu: "તમારી" },
    heroTitle_2: { en: "Dream Job", hi: "सपनों की नौकरी", gu: "સપનાની નોકરી" },
    heroTitle_3: { en: "Today", hi: "पाएं आज ही", gu: "મેળવો આજે જ" },
    heroSub: { 
      en: "Connect with top companies and discover opportunities that match your skills. Join thousands of professionals.", 
      hi: "शीर्ष कंपनियों से जुड़ें और अपने कौशल से मेल खाने वाले अवसरों की खोज करें। हजारों पेशेवरों में शामिल हों।",
      gu: "ટોચની કંપનીઓ સાથે જોડાઓ અને તમારી કુશળતાને અનુરૂપ તકો શોધો. હજારો વ્યાવસાયિકો સાથે જોડાઓ."
    },
    findJobs: { en: "Find Jobs", hi: "नौकरी खोजें", gu: "નોકરી શોધો" },
    hireTalent: { en: "Hire Talent", hi: "हायर करें", gu: "સ્ટાફ શોધો" },
    dashboard: { en: "Go to Dashboard", hi: "डैशबोर्ड पर जाएं", gu: "ડેશબોર્ડ" },
    statsJobs: { en: "Active Jobs", hi: "सक्रिय नौकरियां", gu: "સક્રિય નોકરીઓ" },
    statsCos: { en: "Companies", hi: "कंपनियां", gu: "કંપનીઓ" },
    statsUsers: { en: "Job Seekers", hi: "नौकरी चाहने वाले", gu: "ઉમેદવારો" },
    statsSuccess: { en: "Success Rate", hi: "सफलता दर", gu: "સફળતા દર" },
    gujaratCtaTitle: { en: "GUJARAT SPECIAL HELP", hi: "गुजरात विशेष सहायता", gu: "ગુજરાત વિશેષ સહાય" },
    gujaratCtaSub: { 
      en: "Special NGO jobs and support for those in need in Rajkot, Ahmedabad, and Surat.", 
      hi: "राजकोट, अहमदाबाद और सूरत में जरूरतमंदों के लिए विशेष एनजीओ नौकरियां और सहायता।",
      gu: "રાજકોટ, અમદાવાદ અને સુરતમાં જરૂરિયાતમંદ લોકો માટે ખાસ NGO જોબ્સ અને સહાય."
    },
    getHelp: { en: "GET HELP", hi: "मदद पाएं", gu: "મદદ મેળવો" },
    motiveTitle: { en: "Who is this Portal For?", hi: "यह पोर्टल किसके लिए है?", gu: "આ પોર્ટલ કોના માટે છે?" },
    motiveSub: { 
      en: "Our simple motive: To help educated individuals find great corporate jobs instantly by uploading their resume, and to support non-educated individuals in finding daily reliable work and essential help.",
      hi: "हमारा सरल उद्देश्य: शिक्षित व्यक्तियों को रेज़्यूमे अपलोड कर तुरंत अच्छी नौकरी खोजने में मदद करना, और अशिक्षित/मजदूर वर्ग को दैनिक काम और आवश्यक सहायता खोजने में समर्थन देना।",
      gu: "અમારો સરળ ઉદ્દેશ્ય: શિક્ષિત વ્યક્તિઓને રેઝ્યૂમે અપલોડ કરી તરત જ સારી નોકરી શોધવામાં મદદ કરવી, અને અશિક્ષિત/મજૂર વર્ગને દૈનિક કામ અને જરૂરી મદદ શોધવામાં ટેકો આપવો."
    },
    educatedTitle: { en: "For Educated Seekers", hi: "शिक्षित उम्मीदवारों के लिए", gu: "શિક્ષિત ઉમેદવારો માટે" },
    educatedDesc: { en: "Upload your resume and let our system automatically match you with the best professional jobs and companies.", hi: "अपना रेज़्यूमे अपलोड करें और हमारे सिस्टम को आपको सर्वश्रेष्ठ पेशेवर नौकरियों और कंपनियों से मिलाने दें।", gu: "તમારો રેઝ્યૂમે અપલોડ કરો અને અમારી સિસ્ટમને તમને શ્રેષ્ઠ વ્યવસાયિક નોકરીઓ અને કંપનીઓ સાથે જોડવા દો." },
    educatedBtn: { en: "Upload Resume & Apply", hi: "रेज़्यूमे अपलोड करें", gu: "રેઝ્યૂમે અપલોડ કરો" },
    nonEducatedTitle: { en: "For Non-Educated Seekers", hi: "अशिक्षित / श्रमिक वर्ग के लिए", gu: "અશિક્ષિત / મજૂર વર્ગ માટે" },
    nonEducatedDesc: { en: "No degree? Connect directly with daily wage work, physical labor opportunities, and get special help from NGOs.", hi: "कोई डिग्री नहीं? सीधे दैनिक वेतन कार्य, शारीरिक श्रम के अवसरों से जुड़ें, और गैर सरकारी संगठनों से विशेष मदद प्राप्त करें।", gu: "કોઈ ડિગ્રી નથી? દૈનિક વેતન કાર્ય, મજૂરીની તકો સાથે સીધા જ જોડાઓ અને એનજીઓ (NGO) તરફથી ખાસ મદદ મેળવો." },
    nonEducatedBtn: { en: "Find Work & Help", hi: "काम और मदद खोजें", gu: "કામ અને મદદ શોધો" }
  };

  const t = (key) => labels[key]?.[language] || labels[key]?.['en'];

  const stats = [
    { number: "50K+", label: t('statsJobs') },
    { number: "10K+", label: t('statsCos') },
    { number: "100K+", label: t('statsUsers') },
    { number: "95%", label: t('statsSuccess') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700;900&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap');
        .font-noto { font-family: 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'Plus Jakarta Sans', sans-serif; }
      `}} />

      {/* Hero Section with Motivational Background */}
      <section className="relative pt-0 pb-32 overflow-hidden flex items-center justify-center min-h-screen">
        {/* Main Background Image */}
        <div className="absolute inset-0 bg-[url('/home-hero-bg.png')] bg-cover bg-center bg-no-repeat transition-transform duration-1000">
           <div className="absolute inset-0 bg-linear-to-b from-slate-50/80 via-white/40 to-slate-50 dark:from-slate-950/80 dark:via-slate-950/40 dark:to-slate-950"></div>
           <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 mix-blend-overlay"></div>
        </div>

        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-noto pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-blue-800 dark:text-blue-300 font-bold text-sm tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Reimagined Job Search Experience
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
              <span className="inline-block">{t('heroTitle_1')}</span> <span className="text-gradient inline-block">{t('heroTitle_2')}</span>
              <br />
              <span className="inline-block">{t('heroTitle_3')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto font-medium opacity-90 leading-relaxed">
              {t('heroSub')}
            </p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
            {user ? (
              <>
                <Link
                  to="/jobs/search"
                  className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-xl font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                >
                  <FaSearch className="mr-3" />
                  {t('findJobs')}
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-10 py-5 border-2 border-slate-200 dark:border-slate-700 text-xl font-bold rounded-2xl text-slate-800 dark:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-md active:scale-95 group"
                >
                  {t('dashboard')}
                  <FaArrowRight className="ml-3 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register/jobseeker"
                  className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-xl font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                >
                  <FaRocket className="mr-3" />
                  {t('findJobs')}
                </Link>
                <Link
                  to="/register/company"
                  className="inline-flex items-center justify-center px-10 py-5 border-2 border-slate-200 dark:border-slate-700 text-xl font-bold rounded-2xl text-slate-800 dark:text-white bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-md active:scale-95 group"
                >
                  {t('hireTalent')}
                  <FaArrowRight className="ml-3 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-10 font-noto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200 dark:divide-slate-800">
              {stats.map((stat, index) => (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="text-center px-4"
                >
                  <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-500 font-bold tracking-wide text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Purpose / Motive Section */}
      <section className="py-24 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-noto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              {t('motiveTitle')}
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed">
              {t('motiveSub')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Educated Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-[40px] p-10 md:p-14 border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FaUserGraduate />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {t('educatedTitle')}
              </h3>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-black text-xs mb-8 border border-blue-100 dark:border-blue-800 transition-colors uppercase tracking-widest leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-2.5"></span>
                {educatedJobs?.length || 0} Openings Found
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium leading-relaxed h-[80px]">
                {t('educatedDesc')}
              </p>
              
              <form onSubmit={handleEduSearch} className="mb-6 flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <input 
                  type="text" 
                  placeholder="Search fields, job title..." 
                  value={eduSearch} 
                  onChange={e => setEduSearch(e.target.value)} 
                  className="w-full px-4 h-12 text-base font-semibold outline-none bg-transparent placeholder-slate-400 text-slate-900 dark:text-white" 
                />
                <button type="submit" className="h-12 w-14 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                  <FaSearch/>
                </button>
              </form>
              
              <Link
                to={user ? "/jobs/search" : "/register/jobseeker"}
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-1 w-full"
              >
                {t('educatedBtn')} <FaArrowRight className="ml-3" />
              </Link>
            </motion.div>

            {/* Non-Educated Card */}
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 rounded-[40px] p-10 md:p-14 border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <FaHandsHelping />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {t('nonEducatedTitle')}
              </h3>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-black text-xs mb-8 border border-orange-100 dark:border-orange-800 transition-colors uppercase tracking-widest leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse mr-2.5"></span>
                {nonEducatedOpportunities?.length || 0} Openings Found
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium leading-relaxed h-[80px]">
                {t('nonEducatedDesc')}
              </p>
              
              <form onSubmit={handleNonEduSearch} className="mb-6 flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                <input 
                  type="text" 
                  placeholder="Search physical work, skills..." 
                  value={nonEduSearch} 
                  onChange={e => setNonEduSearch(e.target.value)} 
                  className="w-full px-4 h-12 text-base font-semibold outline-none bg-transparent placeholder-slate-400 text-slate-900 dark:text-white" 
                />
                <button type="submit" className="h-12 w-14 flex items-center justify-center bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg">
                  <FaSearch/>
                </button>
              </form>
              
              <Link
                to="/support/non-educated"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-1 w-full"
              >
                {t('nonEducatedBtn')} <FaArrowRight className="ml-3" />
            </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gujarat Special Help CTA - High Visibility */}
      <section className="py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-noto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 rounded-[40px] p-10 md:p-16 shadow-[0_30px_60px_-15px_rgba(30,58,138,0.4)] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
          >
            {/* Decors */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

            <div className="flex-1 text-center md:text-left text-white relative z-10">
              <span className="inline-block bg-white text-blue-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 shadow-sm">
                Gujarat Exclusive 📍
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                {language === 'gu' ? 'ગુજરાત વિશેષ સહાય' : language === 'hi' ? 'ગુજરાત विशेष सहायता' : 'GUJARAT SPECIAL HELP'}
              </h2>
              <p className="text-xl md:text-2xl font-medium mb-10 text-blue-100 max-w-2xl leading-relaxed">
                {t('gujaratCtaSub')}
              </p>
              <Link
                to="/support/gujarat"
                className="inline-flex items-center gap-3 bg-white text-blue-900 px-10 py-5 rounded-2xl font-black text-xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:bg-slate-50 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group"
              >
                <span>🤝</span>
                {t('getHelp')}
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="w-full md:w-1/3 flex justify-center relative z-10 hidden sm:flex">
              <div className="relative">
                <div className="w-64 h-64 bg-white/10 rounded-[40px] flex items-center justify-center text-[120px] rotate-6 border border-white/20 backdrop-blur-md shadow-2xl transition-transform hover:rotate-12 duration-500">
                  📍
                </div>
                <div className="absolute -top-6 -right-6 px-4 py-2 bg-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-xl font-black text-white text-sm tracking-wide">
                  NEW
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 py-20 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-8 shadow-2xl shadow-blue-500/20">
             JP
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-900 dark:text-white tracking-tighter transition-colors">JobPortal</h2>
          <p className="text-lg font-medium mb-10 max-w-md mx-auto leading-relaxed transition-colors">
            Connecting talented individuals with world-class opportunities across India.
          </p>
          <div className="flex justify-center gap-8 mb-12">
            {['About', 'Jobs', 'Privacy', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-sm font-black uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 transition-colors transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-10 text-xs font-black uppercase tracking-[0.2em] transition-colors">
            &copy; {new Date().getFullYear()} JobPortal. Built with ❤️ for everyone.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
