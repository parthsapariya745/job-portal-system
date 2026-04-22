import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaUser, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Register = () => {
    const [role, setRole] = useState('Job Seeker');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        companyName: '', industry: '', companySize: '1-10', location: '', website: '', recruiterRole: 'Company'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('jobseeker');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isError, isSuccess, message, isLoading: authLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            setIsLoading(false);
        }
        if (isSuccess) {
            toast.success('Registration successful!');
            setIsLoading(false);
        }
        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setRole(tab === 'jobseeker' ? 'Job Seeker' : 'Company');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, companyName, industry, companySize, location, website } = formData;

        if (!name || !email || !password || !confirmPassword) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (activeTab === 'company' && !companyName) {
            toast.error('Company Name is required for recruiters');
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }
        
        setIsLoading(true);

        const userData = {
            name, email, password,
            role: activeTab === 'company' ? formData.recruiterRole : 'Job Seeker',
            ...(activeTab === 'company' && {
                companyProfile: { companyName, industry, size: companySize, location, website }
            })
        };

        dispatch(register(userData));
    };

    const handleGoogleSignup = () => {
        window.location.href = '/api/v1/auth/google';
    };

    if (user) return null;

    return (
        <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 font-sans h-screen transition-colors duration-300">
            {/* Left Side: Brand Identity */}
            <div className="hidden lg:flex w-1/2 bg-[url('/register-bg.png')] bg-cover bg-center text-white flex-col justify-between p-12 relative overflow-hidden shadow-[20px_0_60px_rgba(0,0,0,0.4)] z-20">
                <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[2px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
                
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white text-indigo-900 rounded-xl flex items-center justify-center font-black text-xl shadow-xl">
                            JP
                        </div>
                        <span className="text-3xl font-black tracking-tight">JobPortal</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-black mb-6 leading-tight tracking-tight"
                    >
                        Start your journey with us today.
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-800/50 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                                <FaCheckCircle className="text-indigo-300 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Verified Opportunities</h3>
                                <p className="text-indigo-200/80">Access thousands of verified jobs and top companies worldwide.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-800/50 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                                <FaBuilding className="text-purple-300 text-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Seamless Hiring</h3>
                                <p className="text-indigo-200/80">Tools designed to help recruiters find and hire the best talent faster.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-sm font-semibold text-indigo-200">
                    <span>© 2024 JobPortal.</span>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-10 lg:p-12 relative bg-white dark:bg-slate-950 overflow-y-auto h-full">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 dark:from-indigo-900/10 via-white dark:via-slate-950 to-white dark:to-slate-950 opacity-50 pointer-events-none transition-colors duration-500"></div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl w-full mx-auto relative z-10 pb-10"
                >
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">
                            JP
                        </div>
                    </div>

                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                            Create your account
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                            Join our community and unlock new possibilities.
                        </p>
                    </div>

                    {/* Role Selection Tabs */}
                    <div className="flex mb-8 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shadow-inner">
                        <button
                            onClick={() => handleTabChange('jobseeker')}
                            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === 'jobseeker'
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm transform scale-[1.02]'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <FaUser className={`mr-2.5 text-lg ${activeTab === 'jobseeker' ? 'text-indigo-500' : 'text-slate-400'}`} />
                            I'm a Job Seeker
                        </button>
                        <button
                            onClick={() => handleTabChange('company')}
                            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === 'company'
                                    ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm transform scale-[1.02]'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <FaBuilding className={`mr-2.5 text-lg ${activeTab === 'company' ? 'text-purple-500' : 'text-slate-400'}`} />
                            I'm a Recruiter
                        </button>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Common Fields */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <div className="sm:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Full Name</label>
                                <input
                                    name="name" type="text" required value={formData.name} onChange={onChange}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>
                             <div className="sm:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                                    {activeTab === 'company' ? 'Work Email' : 'Email Address'}
                                </label>
                                <input
                                    name="email" type="email" required value={formData.email} onChange={onChange}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                    placeholder={activeTab === 'company' ? 'name@company.com' : 'you@example.com'}
                                />
                            </div>

                             <div className="sm:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={onChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm pr-11"
                                        placeholder="Min 8 characters"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>


                             <div className="sm:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Confirm Password</label>
                                <input
                                    name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={onChange}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                    placeholder="Retype password"
                                />
                            </div>
                        </div>

                        {/* Company Specific Fields */}
                        {activeTab === 'company' && (
                             <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-6 border-t border-gray-100 dark:border-slate-800"
                            >
                                <h3 className="sm:col-span-2 text-xl font-bold text-gray-900 dark:text-white">Company Details</h3>
                                
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Your Role in Company</label>
                                    <select
                                        name="recruiterRole" value={formData.recruiterRole} onChange={onChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                    >
                                        <option className="dark:bg-slate-900" value="Company">Company Admin (Owner/Director)</option>
                                        <option className="dark:bg-slate-900" value="Company HR">Company HR (Manager/Recruiter)</option>
                                    </select>
                                </div>

                                 <div className="sm:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Company Name</label>
                                    <input
                                        name="companyName" type="text" required value={formData.companyName} onChange={onChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                 <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Industry</label>
                                    <input
                                        name="industry" type="text" value={formData.industry} onChange={onChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Company Size</label>
                                    <select
                                        name="companySize" value={formData.companySize} onChange={onChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                    >
                                        <option className="dark:bg-slate-900" value="1-10">1-10 employees</option>
                                        <option className="dark:bg-slate-900" value="11-50">11-50 employees</option>
                                        <option className="dark:bg-slate-900" value="51-200">51-200 employees</option>
                                        <option className="dark:bg-slate-900" value="201-500">201-500 employees</option>
                                        <option className="dark:bg-slate-900" value="500+">500+ employees</option>
                                    </select>
                                </div>
                                
                                 <div className="sm:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                                        Company Website <span className="text-gray-400 font-medium text-xs">(Optional)</span>
                                    </label>
                                    <input
                                        name="website" type="url" value={formData.website} onChange={onChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                        placeholder="https://company.com"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || authLoading}
                                className={`w-full py-4 px-8 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                                    activeTab === 'company' 
                                        ? 'bg-purple-600 hover:bg-purple-700' 
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                            >
                                {isLoading || authLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                                ) : (
                                    activeTab === 'company' ? 'Register As Company' : 'Create Account'
                                )}
                            </button>
                        </div>

                         <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800"></div>
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider px-2">Or continue with</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800"></div>
                        </div>

                         <button
                            type="button"
                            onClick={handleGoogleSignup}
                            className="w-full py-3.5 px-4 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow"
                        >
                            <img src="/google-logo.png" alt="Google" className="w-5 h-5 flex-shrink-0" />
                            <span>Continue with Google</span>
                        </button>
                        {activeTab === 'company' && (
                            <p className="mt-3 text-xs text-center text-gray-500 font-medium">
                                Note: Google Login will register you as a Job Seeker by default.
                            </p>
                        )}
                    </form>

                     <p className="mt-10 text-center text-gray-500 dark:text-gray-400 font-medium pb-10">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline underline-offset-4 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
