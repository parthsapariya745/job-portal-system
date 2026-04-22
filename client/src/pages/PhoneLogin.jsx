import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiSmartphone, FiLock, FiUser, FiCreditCard, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { loginSuccess } from '../redux/slices/authSlice';

const PhoneLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: phone, 2: OTP + details
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    otp: '',
    name: '',
    aadharCard: '',
  });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.otp || !/^[0-9]{6}$/.test(formData.otp)) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.aadharCard || !/^[0-9]{12}$/.test(formData.aadharCard)) {
      newErrors.aadharCard = 'Please enter a valid 12-digit Aadhar number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setIsLoading(true);
    try {
      const res = await axios.post('/api/v1/auth/send-otp', {
        phoneNumber: formData.phoneNumber,
      });

      if (res.data.status === 'success') {
        toast.success('OTP sent successfully!');
        if (res.data.otp) {
          toast.info(`Your OTP is: ${res.data.otp}`);
        }
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      const res = await axios.post('/api/v1/auth/verify-otp', {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp,
        name: formData.name,
        aadharCard: formData.aadharCard,
      });

      if (res.data.status === 'success') {
        toast.success('Login successful!');
        dispatch(loginSuccess(res.data.data.user));
        navigate('/support/non-educated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-300/30 dark:bg-green-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-300/30 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-10 px-8 md:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border border-white dark:border-slate-800 rounded-[40px] transition-all">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="bg-green-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20 group-hover:scale-110 transition-transform">
              <FiSmartphone className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
              {step === 1 ? 'Phone Login' : 'Verify OTP'}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 font-bold">
              {step === 1 
                ? 'Enter your number to receive OTP' 
                : 'Enter details to continue to work'}
            </p>
          </div>

          {/* Step 1: Phone Number */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1 transition-colors">
                  Phone Number
                </label>
                <div className="relative group">
                  <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-slate-100 dark:border-slate-700'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.phoneNumber}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-green-500/25 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Send OTP ✨
                    <FiArrowRight />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <Link to="/login" className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  Login with Email instead
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP + Details */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1 transition-colors">
                  OTP Code
                </label>
                <div className="relative group text-center">
                   <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="••••••"
                    maxLength={6}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl text-slate-900 dark:text-white font-black text-2xl tracking-[0.5em] focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700 ${
                      errors.otp ? 'border-red-500' : 'border-slate-100 dark:border-slate-700'
                    }`}
                  />
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.otp}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1 transition-colors">
                  Full Name
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 ${
                      errors.name ? 'border-red-500' : 'border-slate-100 dark:border-slate-700'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1 transition-colors">
                  Aadhar Card
                </label>
                <div className="relative group">
                  <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    name="aadharCard"
                    value={formData.aadharCard}
                    onChange={handleChange}
                    placeholder="12-digit number"
                    maxLength={12}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 ${
                      errors.aadharCard ? 'border-red-500' : 'border-slate-100 dark:border-slate-700'
                    }`}
                  />
                </div>
                {errors.aadharCard && (
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{errors.aadharCard}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-green-500/25 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiCheckCircle className="w-5 h-5" />
                    Verify & Login ✨
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Change Phone Number
              </button>
            </form>
          )}

          {/* Info */}
          <div className="mt-10 p-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-3xl">
            <p className="text-xs font-bold text-green-700 dark:text-green-300 leading-relaxed text-center">
              Aadhar card is required for identity verification for all physical work opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;
