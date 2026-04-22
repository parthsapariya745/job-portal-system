import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createWorkOpportunity } from '../redux/slices/workOpportunitySlice';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { FiArrowLeft, FiBriefcase, FiMapPin, FiPhone, FiDollarSign, FiGlobe, FiMail, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PostWorkOpportunity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    contactNumber: '',
    organizationName: '',
    email: '',
    website: '',
    requirements: '',
    workingHours: '',
    experience: '',
    workType: '',
    skillsNeeded: '',
    targetAudience: 'non-educated'
  });

  // Translations
  const translations = {
    pageTitle: {
      en: 'Post a Work Opportunity',
      hi: 'कार्य अवसर पोस्ट करें'
    },
    pageSubtitle: {
      en: 'Hire workers for any type of work - no predefined categories. Drivers, helpers, tailors, cleaners, and more.',
      hi: 'किसी भी प्रकार के कार्य के लिए कर्मचारी किराए पर लें - कोई पूर्वनिर्धारित श्रेणियां नहीं। ड्राइवर, हेल्पर, दर्जी, सफाई कर्मचारी, और अधिक।'
    },
    backToJobs: {
      en: 'Back to Work Opportunities',
      hi: 'कार्य अवसरों पर वापस जाएं'
    },
    workTitle: {
      en: 'Work Title *',
      hi: 'कार्य का शीर्षक *'
    },
    workTitlePlaceholder: {
      en: 'e.g., Driver Required, Cleaning Staff Needed, Tailoring Work Available',
      hi: 'जैसे: ड्राइवर चाहिए, सफाई कर्मचारी चाहिए, दर्जी का काम उपलब्ध'
    },
    description: {
      en: 'Description *',
      hi: 'विवरण *'
    },
    descriptionPlaceholder: {
      en: 'Describe the work, responsibilities, and what you are looking for...',
      hi: 'कार्य, जिम्मेदारियां और आप क्या खोज रहे हैं का वर्णन करें...'
    },
    location: {
      en: 'Location *',
      hi: 'स्थान *'
    },
    locationPlaceholder: {
      en: 'City, Area, or Full Address',
      hi: 'शहर, क्षेत्र, या पूरा पता'
    },
    salary: {
      en: 'Salary/Wage (Optional)',
      hi: 'वेतन/मजदूरी (वैकल्पिक)'
    },
    salaryPlaceholder: {
      en: 'e.g., ₹500 per day, ₹15,000 per month, Negotiable',
      hi: 'जैसे: ₹500 प्रति दिन, ₹15,000 प्रति माह, बातचीत योग्य'
    },
    contactNumber: {
      en: 'Contact Number *',
      hi: 'संपर्क नंबर *'
    },
    contactPlaceholder: {
      en: '10-digit phone number',
      hi: '10 अंकों का फोन नंबर'
    },
    organizationName: {
      en: 'Organization/Employer Name *',
      hi: 'संगठन/नियोक्ता का नाम *'
    },
    orgPlaceholder: {
      en: 'Your company, shop, or personal name',
      hi: 'आपकी कंपनी, दुकान, या व्यक्तिगत नाम'
    },
    email: {
      en: 'Email (Optional)',
      hi: 'ईमेल (वैकल्पिक)'
    },
    website: {
      en: 'Website (Optional)',
      hi: 'वेबसाइट (वैकल्पिक)'
    },
    additionalDetails: {
      en: 'Additional Details (Optional)',
      hi: 'अतिरिक्त विवरण (वैकल्पिक)'
    },
    requirements: {
      en: 'Requirements',
      hi: 'आवश्यकताएं'
    },
    requirementsPlaceholder: {
      en: 'Any specific requirements for the worker...',
      hi: 'कर्मचारी के लिए कोई विशिष्ट आवश्यकताएं...'
    },
    workingHours: {
      en: 'Working Hours',
      hi: 'कार्य समय'
    },
    workingHoursPlaceholder: {
      en: 'e.g., 9 AM - 6 PM, Flexible',
      hi: 'जैसे: सुबह 9 - शाम 6, लचीला'
    },
    experience: {
      en: 'Experience Required',
      hi: 'अनुभव आवश्यक'
    },
    experiencePlaceholder: {
      en: 'e.g., 1-2 years, Freshers welcome',
      hi: 'जैसे: 1-2 साल, नए लोग स्वागत योग्य'
    },
    workType: {
      en: 'Work Type',
      hi: 'कार्य प्रकार'
    },
    workTypePlaceholder: {
      en: 'e.g., Full-time, Part-time, Contract, Daily Wage',
      hi: 'जैसे: पूर्णकालिक, अंशकालिक, अनुबंध, दैनिक मजदूरी'
    },
    skillsNeeded: {
      en: 'Skills Needed',
      hi: 'आवश्यक कौशल'
    },
    skillsPlaceholder: {
      en: 'e.g., Driving, Sewing, Cleaning, Lifting heavy items',
      hi: 'जैसे: ड्राइविंग, सिलाई, सफाई, भारी सामान उठाना'
    },
    targetAudience: {
      en: 'Target Audience',
      hi: 'लक्षित दर्शक'
    },
    nonEducated: {
      en: 'Non-Educated Workers',
      hi: 'गैर-शिक्षित कर्मचारी'
    },
    educated: {
      en: 'Educated Workers',
      hi: 'शिक्षित कर्मचारी'
    },
    both: {
      en: 'Both',
      hi: 'दोनों'
    },
    submit: {
      en: 'Post Work Opportunity',
      hi: 'कार्य अवसर पोस्ट करें'
    },
    submitting: {
      en: 'Posting...',
      hi: 'पोस्ट हो रहा है...'
    },
    tipsTitle: {
      en: 'Tips for better response:',
      hi: 'बेहतर प्रतिक्रिया के लिए सुझाव:'
    },
    tip1: {
      en: 'Write a clear and detailed description',
      hi: 'स्पष्ट और विस्तृत विवरण लिखें'
    },
    tip2: {
      en: 'Mention specific location/area',
      hi: 'विशिष्ट स्थान/क्षेत्र का उल्लेख करें'
    },
    tip3: {
      en: 'Provide clear salary/wage information',
      hi: 'स्पष्ट वेतन/मजदूरी की जानकारी दें'
    },
    tip4: {
      en: 'Include working hours if applicable',
      hi: 'यदि लागू हो तो कार्य समय शामिल करें'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.contactNumber || !formData.organizationName) {
      toast.error(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
      toast.error(language === 'hi' ? 'कृपया वैध 10 अंकों का फोन नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(createWorkOpportunity(formData)).unwrap();
      toast.success(language === 'hi' ? 'कार्य अवसर सफलतापूर्वक पोस्ट किया गया!' : 'Work opportunity posted successfully!');
      navigate('/work-opportunities');
    } catch (error) {
      toast.error(error || (language === 'hi' ? 'त्रुटि हुई, कृपया पुनः प्रयास करें' : 'Error occurred, please try again'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-teal-700 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <Link
            to="/work-opportunities"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            {translations.backToJobs[language]}
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {translations.pageTitle[language]}
          </h1>
          <p className="text-green-100">
            {translations.pageSubtitle[language]}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 p-8 md:p-10 space-y-8 transition-colors">
              {/* Work Title */}
              <div>
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                  <FiBriefcase className="w-4 h-4 inline-block mr-1 text-green-500" />
                  {translations.workTitle[language]}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={translations.workTitlePlaceholder[language]}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                  {translations.description[language]}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={translations.descriptionPlaceholder[language]}
                  rows={5}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none"
                  required
                />
              </div>

              {/* Location & Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    <FiMapPin className="w-4 h-4 inline-block mr-1 text-rose-500" />
                    {translations.location[language]}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={translations.locationPlaceholder[language]}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    <FiDollarSign className="w-4 h-4 inline-block mr-1 text-green-500" />
                    {translations.salary[language]}
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder={translations.salaryPlaceholder[language]}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Contact & Organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    <FiPhone className="w-4 h-4 inline-block mr-1 text-blue-500" />
                    {translations.contactNumber[language]}
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder={translations.contactPlaceholder[language]}
                    maxLength={10}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    <FiBriefcase className="w-4 h-4 inline-block mr-1 text-indigo-500" />
                    {translations.organizationName[language]}
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder={translations.orgPlaceholder[language]}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Email & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    <FiMail className="w-4 h-4 inline-block mr-1 text-indigo-500" />
                    {translations.email[language]}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    <FiGlobe className="w-4 h-4 inline-block mr-1 text-blue-500" />
                    {translations.website[language]}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-10 transition-colors">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight italic transition-colors">
                  {translations.additionalDetails[language]}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                      {translations.workType[language]}
                    </label>
                    <input
                      type="text"
                      name="workType"
                      value={formData.workType}
                      onChange={handleChange}
                      placeholder={translations.workTypePlaceholder[language]}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                      {translations.workingHours[language]}
                    </label>
                    <input
                      type="text"
                      name="workingHours"
                      value={formData.workingHours}
                      onChange={handleChange}
                      placeholder={translations.workingHoursPlaceholder[language]}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    {translations.experience[language]}
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder={translations.experiencePlaceholder[language]}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  />
                </div>

                <div className="mt-8">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    {translations.skillsNeeded[language]}
                  </label>
                  <input
                    type="text"
                    name="skillsNeeded"
                    value={formData.skillsNeeded}
                    onChange={handleChange}
                    placeholder={translations.skillsPlaceholder[language]}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  />
                </div>

                <div className="mt-8">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                    {translations.requirements[language]}
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder={translations.requirementsPlaceholder[language]}
                    rows={3}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-10 transition-colors">
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 transition-colors">
                  {translations.targetAudience[language]}
                </label>
                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="targetAudience"
                      value="non-educated"
                      checked={formData.targetAudience === 'non-educated'}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 dark:bg-slate-800 border-gray-300 dark:border-slate-700 focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-bold group-hover:text-green-600 transition-colors">{translations.nonEducated[language]}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="targetAudience"
                      value="educated"
                      checked={formData.targetAudience === 'educated'}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 dark:bg-slate-800 border-gray-300 dark:border-slate-700 focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-bold group-hover:text-green-600 transition-colors">{translations.educated[language]}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="targetAudience"
                      value="both"
                      checked={formData.targetAudience === 'both'}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 dark:bg-slate-800 border-gray-300 dark:border-slate-700 focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-bold group-hover:text-green-600 transition-colors">{translations.both[language]}</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-b-8 border-green-900 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                    {translations.submitting[language]}
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-8 h-8" />
                    {translations.submit[language]}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Tips Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[32px] p-8 sticky top-6 border-b-8 border-blue-100 dark:border-blue-900/40 transition-colors">
              <h3 className="font-black text-blue-900 dark:text-blue-300 mb-6 flex items-center gap-3 text-xl uppercase tracking-tight italic transition-colors">
                <FiInfo className="w-6 h-6" />
                {translations.tipsTitle[language]}
              </h3>
              <ul className="space-y-4 text-base text-blue-800 dark:text-blue-200 font-bold transition-colors">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-black">1.</span>
                  {translations.tip1[language]}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-black">2.</span>
                  {translations.tip2[language]}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-black">3.</span>
                  {translations.tip3[language]}
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-black">4.</span>
                  {translations.tip4[language]}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostWorkOpportunity;
