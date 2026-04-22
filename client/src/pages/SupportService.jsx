import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSupportServiceById } from '../redux/slices/supportServiceSlice';
import { FiArrowLeft, FiMapPin, FiPhone, FiGlobe, FiUsers, FiMail, FiHeart, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const SupportService = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentService, isLoading, error } = useSelector((state) => state.supportService);
  const { language } = useLanguage();

  // Translations
  const translations = {
    back: {
      en: 'Back',
      hi: 'वापस'
    },
    serviceDetails: {
      en: 'Service Details',
      hi: 'सेवा विवरण'
    },
    description: {
      en: 'Description',
      hi: 'विवरण'
    },
    requirements: {
      en: 'Requirements',
      hi: 'आवश्यकताएं'
    },
    serviceType: {
      en: 'Service Type',
      hi: 'सेवा प्रकार'
    },
    location: {
      en: 'Location',
      hi: 'स्थान'
    },
    organization: {
      en: 'Organization',
      hi: 'संगठन'
    },
    contactInfo: {
      en: 'Contact Information',
      hi: 'संपर्क जानकारी'
    },
    helpline: {
      en: 'Helpline',
      hi: 'हेल्पलाइन'
    },
    email: {
      en: 'Email',
      hi: 'ईमेल'
    },
    website: {
      en: 'Website',
      hi: 'वेबसाइट'
    },
    visitWebsite: {
      en: 'Visit Website',
      hi: 'वेबसाइट देखें'
    },
    requestHelp: {
      en: 'Request Help',
      hi: 'मदद के लिए अनुरोध करें'
    },
    requestHelpDesc: {
      en: 'Need assistance with this service? Submit a help request.',
      hi: 'इस सेवा के साथ सहायता चाहिए? सहायता अनुरोध जमा करें।'
    },
    notFound: {
      en: 'Service not found',
      hi: 'सेवा नहीं मिली'
    },
    browseOther: {
      en: 'Browse other support programs',
      hi: 'अन्य सहायता कार्यक्रम देखें'
    }
  };

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchSupportServiceById(serviceId));
    }
  }, [dispatch, serviceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4 italic font-bold">⚠️ {error}</div>
          <Link to="/support/non-educated" className="text-green-600 dark:text-green-400 font-bold hover:underline">
            Back to Support Programs
          </Link>
        </div>
      </div>
    );
  }

  const service = currentService;
  const organization = service?.organizationId;
  const category = service?.categoryId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            {translations.back[language]}
          </button>
          <div className="flex items-center gap-2 text-green-100 text-sm mb-3">
            <Link to="/support/non-educated" className="hover:text-white">
              {language === 'hi' ? 'सहायता कार्यक्रम' : 'Support Programs'}
            </Link>
            <span>/</span>
            <Link to={`/support/category/${category?._id}`} className="hover:text-white">
              {category?.name || (language === 'hi' ? 'श्रेणी' : 'Category')}
            </Link>
            <span>/</span>
            <span>{translations.serviceDetails[language]}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {service?.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight transition-colors">
                {translations.description[language]}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg transition-colors">
                {service?.description || (language === 'hi' ? 'कोई विवरण उपलब्ध नहीं' : 'No description available')}
              </p>
            </div>

            {/* Requirements */}
            {service?.requirements && (
              <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight transition-colors">
                  {translations.requirements[language]}
                </h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border-l-4 border-yellow-400 dark:border-yellow-600">
                  <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{service.requirements}</p>
                </div>
              </div>
            )}

            {/* Service Type & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter transition-colors">Service Type</h3>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl">
                    <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">{service?.serviceType}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter transition-colors">Location</h3>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl">
                    <FiMapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">{service?.location}</span>
                </div>
              </div>
            </div>

            {/* How to Apply */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight transition-colors">
                How to Apply
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="bg-green-600 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg -rotate-6">
                    <span className="text-white font-black text-xl">1</span>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white text-lg transition-colors uppercase italic">Contact the Organization</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed transition-colors">
                      Call the helpline number or visit the website to get more information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-green-600 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg rotate-3">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white text-lg transition-colors uppercase italic">Prepare Documents</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed transition-colors">
                      Gather all required documents as mentioned in the requirements section.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-green-600 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg -rotate-2">
                    <span className="text-white font-black text-xl">3</span>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white text-lg transition-colors uppercase italic">Submit Application</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed transition-colors">
                      Apply through the official channels provided by the organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight transition-colors">
                {translations.serviceType[language]}
              </h3>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-colors mb-6 inline-block">
                {service?.serviceType || (language === 'hi' ? 'सामान्य' : 'General')}
              </span>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 font-medium transition-colors">
                  <FiMapPin className="w-5 h-5 text-pink-500" />
                  <span>{service?.location || (language === 'hi' ? 'स्थान उपलब्ध नहीं' : 'Location not available')}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 font-medium transition-colors">
                  <FiUsers className="w-5 h-5 text-indigo-500" />
                  <span>{translations.organization[language]}: {organization?.name || (language === 'hi' ? 'अज्ञात' : 'Unknown')}</span>
                </div>
              </div>
            </div>

            {/* Request Help Card */}
            <div className="bg-gradient-to-br from-green-600 to-teal-700 rounded-[32px] shadow-xl p-8 text-white relative overflow-hidden transition-all">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 blur-xl"></div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight relative z-10">
                {translations.requestHelp[language]}
              </h3>
              <p className="text-green-50/80 mb-8 font-medium relative z-10">
                {translations.requestHelpDesc[language]}
              </p>
              <Link
                to="/support/request-help"
                className="block w-full text-center bg-white text-green-700 py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all active:scale-95 relative z-10"
              >
                {translations.requestHelp[language]}
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organization Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight transition-colors">
                {translations.organization[language]}
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-3.5 rounded-2xl shadow-inner">
                  <FiUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 dark:text-white uppercase transition-colors">{organization?.name}</h4>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {organization?.governmentLevel}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed transition-colors">
                {organization?.description}
              </p>
              {organization?.address && (
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
                  <strong className="text-gray-900 dark:text-white uppercase text-xs mr-2 transition-colors">Address:</strong> {organization.address}
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight transition-colors">
                Contact Information
              </h3>
              <div className="space-y-6">
                {organization?.helpline && (
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-2xl">
                      <FiPhone className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors mb-0.5">Helpline</div>
                      <a
                        href={`tel:${organization.helpline}`}
                        className="text-green-700 dark:text-green-400 font-black text-lg hover:underline transition-colors"
                      >
                        {organization.helpline}
                      </a>
                    </div>
                  </div>
                )}
                {organization?.email && (
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-2xl">
                      <FiMail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors mb-0.5">Email</div>
                      <a
                        href={`mailto:${organization.email}`}
                        className="text-blue-700 dark:text-blue-400 font-black hover:underline transition-colors break-all"
                      >
                        {organization.email}
                      </a>
                    </div>
                  </div>
                )}
                {organization?.website && (
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-2xl">
                      <FiGlobe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors mb-0.5">Website</div>
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 dark:text-purple-400 font-black hover:underline truncate block max-w-[150px] transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {organization?.helpline && (
                <a
                  href={`tel:${organization.helpline}`}
                  className="block w-full text-center bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition-all font-black uppercase tracking-widest shadow-lg active:scale-95"
                >
                  <FiPhone className="w-5 h-5 inline-block mr-2" />
                  Call Helpline
                </a>
              )}
              <Link
                to="/support/request-help"
                className="block w-full text-center bg-white dark:bg-slate-800 border-2 border-green-600 text-green-700 dark:text-green-400 py-4 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all font-black uppercase tracking-widest active:scale-95"
              >
                <FiHeart className="w-5 h-5 inline-block mr-2" />
                Request Help
              </Link>
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[32px] p-8 border border-blue-100 dark:border-blue-900/30 transition-colors">
              <h4 className="font-black text-blue-900 dark:text-blue-300 mb-2 uppercase italic transition-colors">
                Need immediate assistance?
              </h4>
              <p className="text-blue-700 dark:text-blue-400 text-sm mb-6 font-medium leading-relaxed transition-colors">
                Our support team can help you connect with the right program.
              </p>
              <Link
                to="/support/request-help"
                className="text-blue-800 dark:text-blue-400 font-black hover:underline uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
              >
                Submit a request <FiArrowLeft className="rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportService;
