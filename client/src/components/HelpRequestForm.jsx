import { useState } from 'react';
import { FiUser, FiPhone, FiMapPin, FiFileText, FiCalendar, FiAlertCircle } from 'react-icons/fi';

const HelpRequestForm = ({ 
  categories = [],
  onSubmit,
  isLoading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    categoryId: '',
    description: '',
    location: '',
    contactNumber: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiUser className="w-4 h-4 inline-block mr-2" />
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Age and Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiCalendar className="w-4 h-4 inline-block mr-2" />
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="120"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            placeholder="Your age"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <FiAlertCircle className="w-4 h-4" />
              {errors.age}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiPhone className="w-4 h-4 inline-block mr-2" />
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.contactNumber ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            placeholder="10-digit phone number"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <FiAlertCircle className="w-4 h-4" />
              {errors.contactNumber}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category of Help Needed
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.categoryId ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white`}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.categoryId}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiMapPin className="w-4 h-4 inline-block mr-2" />
          Your Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          placeholder="City, State, or Village name"
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.location}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FiFileText className="w-4 h-4 inline-block mr-2" />
          Describe Your Need
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none`}
          placeholder="Please describe what kind of help you are looking for..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle className="w-4 h-4" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Submitting...
          </>
        ) : (
          'Submit Request'
        )}
      </button>
    </form>
  );
};

export default HelpRequestForm;
