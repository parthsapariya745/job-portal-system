import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createHelpRequest, clearRequestError, clearRequestSuccess } from '../redux/slices/supportRequestSlice';
import { fetchSupportCategories } from '../redux/slices/supportCategorySlice';
import { FiArrowLeft, FiCheckCircle, FiHeart, FiUser, FiPhone, FiMapPin, FiFileText, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const RequestHelp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.supportCategory);
  const { isLoading, success, error } = useSelector((state) => state.supportRequest);
  const { language } = useLanguage();

  // Translations
  const translations = {
    pageTitle: {
      en: 'Request Help',
      hi: 'मदद के लिए अनुरोध करें'
    },
    pageSubtitle: {
      en: 'Fill out the form below and our team will assist you',
      hi: 'नीचे दिया गया फॉर्म भरें और हमारी टीम आपकी सहायता करेगी'
    },
    backToSupport: {
      en: 'Back to Support Programs',
      hi: 'सहायता कार्यक्रमों पर वापस जाएं'
    },
    formTitle: {
      en: 'Help Request Form',
      hi: 'सहायता अनुरोध फॉर्म'
    },
    allFieldsRequired: {
      en: 'All fields are required',
      hi: 'सभी फ़ील्ड आवश्यक हैं'
    },
    fullName: {
      en: 'Full Name',
      hi: 'पूरा नाम'
    },
    age: {
      en: 'Age',
      hi: 'उम्र'
    },
    category: {
      en: 'Category of Help Needed',
      hi: 'आवश्यक सहायता की श्रेणी'
    },
    selectCategory: {
      en: 'Select a category',
      hi: 'श्रेणी चुनें'
    },
    location: {
      en: 'Your Location',
      hi: 'आपका स्थान'
    },
    contactNumber: {
      en: 'Contact Number',
      hi: 'संपर्क नंबर'
    },
    describeNeed: {
      en: 'Describe Your Need',
      hi: 'अपनी जरूरत का वर्णन करें'
    },
    submitRequest: {
      en: 'Submit Request',
      hi: 'अनुरोध जमा करें'
    },
    submitting: {
      en: 'Submitting...',
      hi: 'जमा किया जा रहा है...'
    },
    whatHappensNext: {
      en: 'What Happens Next?',
      hi: 'आगे क्या होगा?'
    },
    step1: {
      en: 'Our team will review your request within 24-48 hours',
      hi: 'हमारी टीम 24-48 घंटों के भीतर आपके अनुरोध की समीक्षा करेगी'
    },
    step2: {
      en: 'We will contact you on your provided phone number',
      hi: 'हम आपके दिए गए फोन नंबर पर आपसे संपर्क करेंगे'
    },
    step3: {
      en: 'We will connect you with the right support program',
      hi: 'हम आपको सही सहायता कार्यक्रम से जोड़ेंगे'
    },
    privacyProtected: {
      en: 'Privacy Protected',
      hi: 'गोपनीयता सुरक्षित'
    },
    privacyText: {
      en: 'Your information is secure and will only be shared with relevant support organizations.',
      hi: 'आपकी जानकारी सुरक्षित है और इसे केवल प्रासंगिक सहायता संगठनों के साथ साझा किया जाएगा।'
    },
    emergencyHelplines: {
      en: 'Emergency Helplines',
      hi: 'आपातकालीन हेल्पलाइन'
    },
    childline: {
      en: 'Childline India',
      hi: 'चाइल्डलाइन इंडिया'
    },
    womenHelpline: {
      en: 'Women Helpline',
      hi: 'महिला हेल्पलाइन'
    },
    seniorCitizen: {
      en: 'Senior Citizen',
      hi: 'वरिष्ठ नागरिक'
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contactNumber: '',
    category: '',
    location: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSupportCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success('Help request submitted successfully! We will contact you soon.');
      dispatch(clearRequestSuccess());
      navigate('/support/non-educated');
    }
    if (error) {
      toast.error(error);
      dispatch(clearRequestError());
    }
  }, [success, error, dispatch, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      errors.age = 'Please enter a valid age (1-120)';
    }
    if (!formData.category.trim()) errors.category = 'Please enter a category';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
      errors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    dispatch(createHelpRequest(formData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 py-4 xs:py-6 sm:py-8">
        <div className="max-w-full mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
          <div className="flex justify-end mb-2 sm:mb-4">
            <LanguageSwitcher />
          </div>
          <Link
            to="/support/non-educated"
            className="inline-flex items-center gap-1 xs:gap-2 text-green-100 hover:text-white mb-2 xs:mb-4 transition-colors text-xs xs:text-sm"
          >
            <FiArrowLeft className="w-4 h-4 xs:w-5 xs:h-5" />
            {translations.backToSupport[language]}
          </Link>
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white">{translations.pageTitle[language]}</h1>
          <p className="text-green-100 mt-1 xs:mt-2 text-xs xs:text-sm sm:text-base">
            {translations.pageSubtitle[language]}
          </p>
        </div>
      </div>

      <div className="max-w-full mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 py-6 xs:py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-4 xs:p-6 sm:p-10 border border-gray-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-4 xs:gap-5 mb-8 xs:mb-10">
                <div className="bg-green-100 dark:bg-green-900/30 p-3.5 rounded-2xl shadow-inner">
                  <FiHeart className="w-6 h-6 xs:w-8 xs:h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl xs:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight transition-colors italic">{translations.formTitle[language]}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase transition-colors">{translations.allFieldsRequired[language]}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-widest transition-colors">
                    <FiUser className="w-4 h-4 inline-block mr-2 text-indigo-500" />
                    {translations.fullName[language]}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
                    placeholder={language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-tight italic">{formErrors.name}</p>
                  )}
                </div>

                {/* Age and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-widest transition-colors">
                      <FiCalendar className="w-4 h-4 inline-block mr-2 text-pink-500" />
                      {translations.age[language]}
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      className={`w-full px-5 py-4 rounded-xl border-2 ${
                        formErrors.age ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                      } bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
                      placeholder={language === 'hi' ? 'आपकी उम्र' : 'Your age'}
                    />
                    {formErrors.age && (
                      <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-tight italic">{formErrors.age}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-widest transition-colors">
                      <FiPhone className="w-4 h-4 inline-block mr-2 text-green-500" />
                      {translations.contactNumber[language]}
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 rounded-xl border-2 ${
                        formErrors.contactNumber ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                      } bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
                      placeholder={language === 'hi' ? '10 अंकों का फोन नंबर' : '10-digit phone number'}
                    />
                    {formErrors.contactNumber && (
                      <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-tight italic">{formErrors.contactNumber}</p>
                    )}
                  </div>
                </div>

                {/* Category - Text Input */}
                <div>
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-widest transition-colors">
                    {translations.category[language]}
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
                    placeholder={language === 'hi' ? 'जैसे: स्वास्थ्य, शिक्षा, रोजगार...' : 'e.g., Health, Education, Employment...'}
                  />
                  {formErrors.category && (
                    <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-tight italic">{formErrors.category}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-widest transition-colors">
                    <FiMapPin className="w-4 h-4 inline-block mr-2 text-rose-500" />
                    {translations.location[language]}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      formErrors.location ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
                    placeholder={language === 'hi' ? 'शहर, राज्य या गांव का नाम' : 'City, State, or Village name'}
                  />
                  {formErrors.location && (
                    <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-tight italic">{formErrors.location}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-widest transition-colors">
                    <FiFileText className="w-4 h-4 inline-block mr-2 text-amber-500" />
                    {translations.describeNeed[language]}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none outline-none transition-all`}
                    placeholder={language === 'hi' ? 'कृपया वर्णन करें कि आप किस तरह की मदद चाहते हैं...' : 'Please describe what kind of help you are looking for...'}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-tight italic">{formErrors.description}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 dark:bg-green-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-green-700 dark:hover:bg-green-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 uppercase tracking-widest"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                      {translations.submitting[language]}
                    </>
                  ) : (
                    <>
                      <FiHeart className="w-7 h-7" />
                      {translations.submitRequest[language]}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* What Happens Next */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[32px] p-8 border border-blue-100 dark:border-blue-900/30 transition-colors">
              <h3 className="font-black text-blue-900 dark:text-blue-300 mb-6 uppercase tracking-widest italic transition-colors">{translations.whatHappensNext[language]}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 dark:bg-blue-700 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                    <span className="text-white font-black text-sm">1</span>
                  </div>
                  <p className="text-blue-800 dark:text-blue-400 text-sm font-bold leading-relaxed transition-colors">
                    {translations.step1[language]}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 dark:bg-blue-700 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                    <span className="text-white font-black text-sm">2</span>
                  </div>
                  <p className="text-blue-800 dark:text-blue-400 text-sm font-bold leading-relaxed transition-colors">
                    {translations.step2[language]}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 dark:bg-blue-700 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                    <span className="text-white font-black text-sm">3</span>
                  </div>
                  <p className="text-blue-800 dark:text-blue-400 text-sm font-bold leading-relaxed transition-colors">
                    {translations.step3[language]}
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-[32px] p-8 mt-6 border border-green-200 dark:border-green-900/30 transition-colors">
              <div className="flex items-start gap-4">
                <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-black text-green-900 dark:text-green-300 mb-1 uppercase tracking-tight transition-colors">{translations.privacyProtected[language]}</h3>
                  <p className="text-green-800 dark:text-green-400 text-sm font-medium transition-colors">
                    {translations.privacyText[language]}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Helplines */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-8 border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest italic transition-colors">{translations.emergencyHelplines[language]}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between group">
                  <span className="text-gray-700 dark:text-gray-400 text-sm font-bold uppercase transition-colors">{translations.childline[language]}</span>
                  <a href="tel:1098" className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-xl font-black text-sm hover:scale-105 transition-all">1098</a>
                </div>
                <div className="flex items-center justify-between group">
                  <span className="text-gray-700 dark:text-gray-400 text-sm font-bold uppercase transition-colors">{translations.womenHelpline[language]}</span>
                  <a href="tel:181" className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-xl font-black text-sm hover:scale-105 transition-all">181</a>
                </div>
                <div className="flex items-center justify-between group">
                  <span className="text-gray-700 dark:text-gray-400 text-sm font-bold uppercase transition-colors">{translations.seniorCitizen[language]}</span>
                  <a href="tel:14567" className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-xl font-black text-sm hover:scale-105 transition-all">14567</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHelp;
