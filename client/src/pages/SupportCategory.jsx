import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchServicesByCategory } from '../redux/slices/supportServiceSlice';
import { fetchCategoryStats } from '../redux/slices/supportCategorySlice';
import { FiArrowLeft, FiMapPin, FiPhone, FiGlobe, FiUsers, FiHeart, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const SupportCategory = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const { categoryServices, currentCategory, isLoading, error } = useSelector(
    (state) => state.supportService
  );
  const { language } = useLanguage();

  // Translations
  const translations = {
    backToSupport: {
      en: 'Back to Support Programs',
      hi: 'सहायता कार्यक्रमों पर वापस जाएं'
    },
    servicesAvailable: {
      en: 'services available',
      hi: 'सेवाएं उपलब्ध'
    },
    browseServices: {
      en: 'Browse through the support services available in this category.',
      hi: 'इस श्रेणी में उपलब्ध सहायता सेवाओं को देखें।'
    },
    noServices: {
      en: 'No services available',
      hi: 'कोई सेवा उपलब्ध नहीं'
    },
    noServicesDesc: {
      en: 'There are currently no services listed in this category.',
      hi: 'इस श्रेणी में वर्तमान में कोई सेवा सूचीबद्ध नहीं है।'
    },
    requestHelp: {
      en: 'Request Help',
      hi: 'मदद के लिए अनुरोध करें'
    },
    requestHelpDesc: {
      en: 'Cannot find what you need? Submit a help request.',
      hi: 'आपको जो चाहिए वो नहीं मिल रहा? सहायता अनुरोध जमा करें।'
    },
    viewDetails: {
      en: 'View Details',
      hi: 'विवरण देखें'
    },
    category: {
      en: 'Category',
      hi: 'श्रेणी'
    }
  };

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchServicesByCategory(categoryId));
      dispatch(fetchCategoryStats(categoryId));
    }
  }, [dispatch, categoryId]);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-teal-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <Link
            to="/support/non-educated"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            {translations.backToSupport[language]}
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <span className="text-4xl">{currentCategory?.icon || '📋'}</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {currentCategory?.name || 'Category'}
              </h1>
              <p className="text-green-100 mt-2">
                {categoryServices?.length || 0} support programs available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerable Groups - Easy Access Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 rounded-3xl p-6 md:p-8 border-4 border-orange-300 dark:border-orange-900/50 transition-colors shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-orange-800 dark:text-orange-200 mb-6 transition-colors">
            {language === 'hi' ? 'विशेष देखभाल चाहने वालों के लिए' : 'For Those Who Need Special Care'}
          </h2>
          <p className="text-center text-orange-700 dark:text-orange-400 mb-8 text-lg opacity-80 transition-colors">
            {language === 'hi' 
              ? 'बुजुर्ग, बच्चे, दादा-दादी, विकलांग - आसान मदद यहाँ मिलेगी' 
              : 'Elderly, Children, Grandparents, Disabled - Easy help available here'}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Elderly */}
            <Link 
              to="/support/vulnerable"
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all border-2 border-blue-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 overflow-hidden"
            >
              <div className="text-5xl mb-2">👴</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm md:text-base transition-colors">
                {language === 'hi' ? 'वृद्धाश्रम' : 'Old Age Homes'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {language === 'hi' ? 'बुजुर्गों की देखभाल' : 'Elderly Care'}
              </div>
            </Link>

            {/* Children */}
            <Link 
              to="/support/vulnerable"
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all border-2 border-pink-200 dark:border-slate-800 hover:border-pink-400 dark:hover:border-pink-700 overflow-hidden"
            >
              <div className="text-5xl mb-2">👶</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm md:text-base transition-colors">
                {language === 'hi' ? 'बच्चों की देखभाल' : 'Children Care'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {language === 'hi' ? 'अनाथालय' : 'Orphanages'}
              </div>
            </Link>

            {/* Grandparents */}
            <Link 
              to="/support/vulnerable"
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all border-2 border-purple-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-700 overflow-hidden"
            >
              <div className="text-5xl mb-2">👵</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm md:text-base transition-colors">
                {language === 'hi' ? 'दादा-दादी' : 'Grandparents'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {language === 'hi' ? 'विशेष सहायता' : 'Special Help'}
              </div>
            </Link>

            {/* Disabled */}
            <Link 
              to="/support/vulnerable"
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all border-2 border-green-200 dark:border-slate-800 hover:border-green-400 dark:hover:border-green-700 overflow-hidden"
            >
              <div className="text-5xl mb-2">♿</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm md:text-base transition-colors">
                {language === 'hi' ? 'विकलांग सहायता' : 'Disabled Support'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {language === 'hi' ? 'विशेष देखभाल' : 'Special Care'}
              </div>
            </Link>

            {/* Widows */}
            <Link 
              to="/support/vulnerable"
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all border-2 border-orange-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-700 overflow-hidden"
            >
              <div className="text-5xl mb-2">🙏</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm md:text-base transition-colors">
                {language === 'hi' ? 'विधवा सहायता' : 'Widow Help'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {language === 'hi' ? 'आर्थिक मदद' : 'Financial Aid'}
              </div>
            </Link>

            {/* Mental Health */}
            <Link 
              to="/support/vulnerable"
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all border-2 border-teal-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-700 overflow-hidden"
            >
              <div className="text-5xl mb-2">🧠</div>
              <div className="font-bold text-gray-800 dark:text-white text-sm md:text-base transition-colors">
                {language === 'hi' ? 'मानसिक स्वास्थ्य' : 'Mental Health'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {language === 'hi' ? 'काउंसलिंग' : 'Counseling'}
              </div>
            </Link>
          </div>

          {/* Big Button to Vulnerable Support Page */}
          <div className="mt-8 text-center">
            <Link
              to="/support/vulnerable"
              className="inline-flex items-center gap-3 bg-linear-to-r from-orange-500 to-amber-500 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-3xl">🤝</span>
              {language === 'hi' ? 'सभी सहायता देखें' : 'See All Help'}
              <FiArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Category Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border dark:border-slate-800 transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors uppercase tracking-tight">About this Category</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
            {currentCategory?.description || 'No description available.'}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight transition-colors">
            Available Programs
          </h2>
          <Link
            to="/support/request-help"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md active:scale-95"
          >
            <FiHeart className="w-4 h-4" />
            Request Help
          </Link>
        </div>

        {categoryServices?.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border-4 border-dashed border-gray-100 dark:border-slate-800 transition-colors">
            <div className="text-7xl mb-6">📭</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase transition-colors">
              No programs available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium italic transition-colors">
              No support programs are currently available in this category.
            </p>
            <Link
              to="/support/non-educated"
              className="text-green-600 dark:text-green-400 font-bold hover:underline transiton-colors"
            >
              Browse other categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryServices?.map((service) => (
              <div
                key={service._id}
                className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm hover:shadow-2xl transition-all overflow-hidden border-2 border-gray-50 dark:border-slate-800 hover:border-green-100 dark:hover:border-green-900/40 group"
              >
                <div className="p-8">
                  {/* Service Type Badge */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-widest transition-colors">
                      {service.serviceType || 'Support'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors tracking-tight">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed transition-colors">
                    {service.description}
                  </p>

                  {/* Organization */}
                  <div className="flex items-center gap-3 mb-4 text-sm font-bold transition-colors">
                    <FiUsers className="w-5 h-5 text-indigo-400 dark:text-indigo-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {service.organizationId?.name}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 mb-4 text-sm font-bold transition-colors">
                    <FiMapPin className="w-5 h-5 text-pink-400 dark:text-pink-500" />
                    <span className="text-gray-600 dark:text-gray-400">{service.location}</span>
                  </div>

                  {/* Contact Info */}
                  {service.organizationId?.helpline && (
                    <div className="flex items-center gap-3 mb-4 text-sm font-bold transition-colors">
                      <FiPhone className="w-5 h-5 text-green-600 dark:text-green-400 animate-pulse" />
                      <span className="text-green-700 dark:text-green-400">
                        {service.organizationId.helpline}
                      </span>
                    </div>
                  )}

                  {/* Website */}
                  {service.organizationId?.website && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <FiGlobe className="w-4 h-4 text-gray-400" />
                      <a
                        href={service.organizationId.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {/* Requirements */}
                  {service.requirements && (
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 border border-gray-100 dark:border-slate-800 transition-colors">
                      <h4 className="text-xs font-black text-gray-500 dark:text-gray-500 mb-1 uppercase tracking-widest transition-colors">
                        Requirements:
                      </h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium transition-colors">{service.requirements}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      to={`/support/service/${service._id}`}
                      className="block w-full text-center bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all font-black text-sm uppercase tracking-widest active:scale-95 shadow-md"
                    >
                      View Details
                    </Link>
                    <a
                      href={`tel:${service.organizationId?.helpline}`}
                      className="block w-full text-center bg-white dark:bg-slate-850 border-2 border-green-600 text-green-700 dark:text-green-400 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all font-black text-sm uppercase tracking-widest active:scale-95"
                    >
                      Call Helpline
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Need Help CTA */}
      <div className="bg-gray-100 dark:bg-slate-900 py-20 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight transition-colors">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 font-medium transition-colors">
            Submit a help request and our team will assist you in finding the right support program.
          </p>
          <Link
            to="/support/request-help"
            className="inline-flex items-center gap-4 bg-green-600 text-white px-10 py-5 rounded-[20px] font-black text-xl hover:bg-green-700 transition-all shadow-xl active:scale-95 uppercase tracking-widest"
          >
            <FiHeart className="w-6 h-6" />
            Request Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportCategory;
