import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchWorkOpportunityById, expressInterest } from '../redux/slices/workOpportunitySlice';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FiMapPin, FiPhone, FiBriefcase, FiCalendar, FiDollarSign, FiArrowLeft, FiGlobe, FiMail, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const WorkOpportunityDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { language, t } = useLanguage();
  const { currentOpportunity: job, isLoading } = useSelector((state) => state.workOpportunities);

  // Translations
  const translations = {
    backToJobs: {
      en: 'Back to Work Opportunities',
      hi: 'कार्य अवसरों पर वापस जाएं'
    },
    jobDetails: {
      en: 'Work Details',
      hi: 'कार्य विवरण'
    },
    location: {
      en: 'Location',
      hi: 'स्थान'
    },
    salary: {
      en: 'Salary/Wage',
      hi: 'वेतन/मजदूरी'
    },
    contact: {
      en: 'Contact Number',
      hi: 'संपर्क नंबर'
    },
    organization: {
      en: 'Organization',
      hi: 'संगठन'
    },
    postedOn: {
      en: 'Posted On',
      hi: 'पोस्ट की गई'
    },
    description: {
      en: 'Description',
      hi: 'विवरण'
    },
    requirements: {
      en: 'Requirements',
      hi: 'आवश्यकताएं'
    },
    workingHours: {
      en: 'Working Hours',
      hi: 'कार्य समय'
    },
    experience: {
      en: 'Experience Required',
      hi: 'अनुभव आवश्यक'
    },
    skills: {
      en: 'Skills Needed',
      hi: 'आवश्यक कौशल'
    },
    workType: {
      en: 'Work Type',
      hi: 'कार्य प्रकार'
    },
    contactEmployer: {
      en: 'Contact Employer',
      hi: 'नियोक्ता से संपर्क करें'
    },
    callNow: {
      en: 'Call Now',
      hi: 'अभी कॉल करें'
    },
    sendEmail: {
      en: 'Send Email',
      hi: 'ईमेल भेजें'
    },
    visitWebsite: {
      en: 'Visit Website',
      hi: 'वेबसाइट देखें'
    },
    interested: {
      en: 'I am Interested',
      hi: 'मुझे रुचि है'
    },
    peopleInterested: {
      en: 'people interested in this work',
      hi: 'लोग इस कार्य में रुचि रखते हैं'
    },
    negotiable: {
      en: 'Negotiable',
      hi: 'बातचीत योग्य'
    },
    notSpecified: {
      en: 'Not specified',
      hi: 'निर्दिष्ट नहीं'
    },
    share: {
      en: 'Share this opportunity',
      hi: 'इस अवसर को साझा करें'
    },
    report: {
      en: 'Report this listing',
      hi: 'इस लिस्टिंग की रिपोर्ट करें'
    },
    similarJobs: {
      en: 'Similar Work Opportunities',
      hi: 'समान कार्य अवसर'
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkOpportunityById(id));
    }
  }, [dispatch, id]);

  const handleExpressInterest = async () => {
    try {
      await dispatch(expressInterest(id)).unwrap();
      toast.success(language === 'hi' ? 'रुचि दर्ज की गई!' : 'Interest recorded!');
    } catch (error) {
      toast.error(error || (language === 'hi' ? 'त्रुटि हुई' : 'Error occurred'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight transition-colors">
            {language === 'hi' ? 'कार्य अवसर नहीं मिला' : 'Work Opportunity Not Found'}
          </h2>
          <Link to="/work-opportunities" className="text-orange-600 hover:underline">
            {translations.backToJobs[language]}
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-4000 pointer-events-none transition-colors duration-500"></div>

      {/* Premium Header */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-600 dark:from-blue-900 dark:to-slate-900 pt-16 pb-24 px-6 rounded-b-[70px] shadow-2xl relative overflow-hidden transition-all duration-700">
         <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
           <div className="grid grid-cols-10 h-full">
              {[...Array(100)].map((_, i) => <div key={i} className="border-r border-b border-white/20"></div>)}
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 px-4">
          <div className="flex justify-between items-center mb-12">
            <Link
              to="/work-opportunities"
              className="bg-white/20 hover:bg-white/40 p-4 rounded-[24px] backdrop-blur-md transition-all active:scale-90 group"
            >
              <FiArrowLeft className="text-3xl text-white group-hover:-translate-x-1 transition-transform" />
            </Link>
            <LanguageSwitcher />
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white/90 mb-8 border border-white/20">
               <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
               Opportunity details
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter drop-shadow-2xl leading-none">
              {job.title}
            </h1>
            <p className="text-xl md:text-2xl font-black text-indigo-100/80 uppercase tracking-[0.2em] italic">
              {job.organizationName}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[50px] shadow-2xl border-2 border-white dark:border-slate-800 transition-all overflow-hidden">
              {/* Context Bar */}
              <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {job.location && (
                    <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[30px] shadow-inner">
                      <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center">
                         <FiMapPin className="text-2xl text-rose-500" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{translations.location[language]}</p>
                         <p className="text-lg font-black text-slate-900 dark:text-white transition-colors">{job.location}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[30px] shadow-inner">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                       <FiDollarSign className="text-2xl text-green-500" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{translations.salary[language]}</p>
                       <p className="text-lg font-black text-slate-900 dark:text-white transition-colors">{job.salary || translations.negotiable[language]}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description body */}
              <div className="p-8 md:p-12 space-y-12">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase italic tracking-tighter flex items-center gap-3">
                    <span className="text-3xl">📄</span> {translations.description[language]}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed whitespace-pre-line font-bold transition-colors">
                    {job.description}
                  </p>
                </div>

                {/* Additional Details Grid */}
                {(job.requirements || job.workingHours || job.experience || job.skillsNeeded || job.workType) && (
                  <div className="pt-12 border-t border-slate-100 dark:border-slate-800 space-y-8 transition-colors">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase italic tracking-tighter flex items-center gap-3">
                       <span className="text-3xl">🧩</span> {translations.jobDetails[language]}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       {[
                         { id: 'workType', icon: <FiBriefcase />, color: 'orange', label: translations.workType[language], value: job.workType },
                         { id: 'requirements', icon: <FiCheckCircle />, color: 'green', label: translations.requirements[language], value: job.requirements },
                         { id: 'workingHours', icon: <FiCalendar />, color: 'blue', label: translations.workingHours[language], value: job.workingHours },
                         { id: 'experience', icon: <FiBriefcase />, color: 'purple', label: translations.experience[language], value: job.experience },
                         { id: 'skills', icon: <FiCheckCircle />, color: 'teal', label: translations.skills[language], value: job.skillsNeeded }
                       ].filter(item => item.value).map(item => (
                         <div key={item.id} className="group/item flex items-start gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-600 dark:text-${item.color}-400 group-hover/item:scale-110 group-hover/item:rotate-6`}>
                               {item.icon}
                            </div>
                            <div>
                               <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</span>
                               <span className="text-slate-900 dark:text-white font-black text-lg transition-colors">{item.value}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-slate-900 rounded-[50px] p-8 md:p-10 shadow-2xl border-b-[12px] border-slate-950 relative overflow-hidden group">
               <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent pointer-events-none"></div>
              
              <h3 className="text-2xl font-black text-white mb-10 uppercase italic tracking-tighter relative z-10 flex items-center gap-3">
                <span className="text-3xl group-hover:animate-shake">📞</span> {translations.contactEmployer[language]}
              </h3>
              
              <div className="space-y-6 relative z-10">
                {job.contactNumber && (
                  <a
                    href={`tel:${job.contactNumber}`}
                    className="flex items-center gap-5 bg-white/10 backdrop-blur-xl p-6 rounded-[30px] hover:bg-green-600 transition-all group/call border border-white/5 hover:border-green-400"
                  >
                    <div className="bg-green-500 p-4 rounded-2xl shadow-lg group-hover/call:scale-110 transition-transform">
                      <FiPhone className="text-2xl text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{translations.callNow[language]}</p>
                      <p className="font-black text-white text-xl">{job.contactNumber}</p>
                    </div>
                  </a>
                )}
                
                {job.email && (
                  <a
                    href={`mailto:${job.email}`}
                    className="flex items-center gap-5 bg-white/10 backdrop-blur-xl p-6 rounded-[30px] hover:bg-blue-600 transition-all group/email border border-white/5 hover:border-blue-400"
                  >
                    <div className="bg-blue-500 p-4 rounded-2xl shadow-lg group-hover/email:scale-110 transition-transform">
                      <FiMail className="text-2xl text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{translations.sendEmail[language]}</p>
                      <p className="font-black text-white text-sm break-all">{job.email}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Action Section */}
              <div className="mt-12 space-y-4 relative z-10">
                <button
                  onClick={handleExpressInterest}
                  className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-white py-6 rounded-[30px] font-black text-xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 border-b-[8px] border-orange-950"
                >
                  {translations.interested[language]}
                </button>

                {job.interestCount > 0 && (
                  <div className="flex items-center justify-center gap-3 py-2 px-4 bg-white/5 rounded-full backdrop-blur-md">
                     <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                     <p className="text-xs font-black text-slate-300 uppercase tracking-tighter">
                       <span className="text-orange-400">{job.interestCount}</span> {translations.peopleInterested[language]}
                     </p>
                  </div>
                )}
              </div>
            </div>

            {/* Share & Info */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[40px] p-8 border-2 border-white dark:border-slate-800 shadow-xl transition-all">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase italic tracking-tighter transition-colors">
                {translations.share[language]}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.info(language === 'hi' ? 'लिंक कॉपी किया गया!' : 'Opportunity link copied!');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-inner hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                  {language === 'hi' ? 'लिंक कॉपी करें' : 'Copy Opportunity Link'}
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                 <span>ID: {job._id.slice(-8)}</span>
                 <span className="flex items-center gap-2"><FiCalendar /> {formatDate(job.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOpportunityDetail;
