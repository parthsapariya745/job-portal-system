import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user, isError, isSuccess, message, isLoading: authLoading } = useSelector(
        (state) => state.auth
    );

    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            setIsLoading(false);
        }
        if (isSuccess) {
            toast.success('Login successful!');
            setIsLoading(false);
        }
        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        dispatch(login(formData));
    };

    const handleGoogleLogin = () => {
        window.location.href = '/api/v1/auth/google';
    };

    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
            {/* Left Side: Brand Identity (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-[url('/login-bg.png')] bg-cover bg-center text-white flex-col justify-between p-12 relative overflow-hidden shadow-[20px_0_60px_rgba(0,0,0,0.4)] z-20">
                <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[2px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
                
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white text-blue-900 rounded-xl flex items-center justify-center font-black text-xl shadow-xl">
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
                        Your next great opportunity is waiting.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-blue-100/80 font-medium"
                    >
                        Join millions of professionals who have found their dream jobs and build a career you'll love.
                    </motion.p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-sm font-semibold text-blue-200">
                    <span>© 2024 JobPortal.</span>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-slate-950">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 dark:from-blue-900/10 via-white dark:via-slate-950 to-white dark:to-slate-950 opacity-50 transition-colors duration-500"></div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">
                            JP
                        </div>
                    </div>

                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                            Welcome back
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                            Please enter your details to sign in.
                        </p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                             <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                                    placeholder="name@example.com"
                                />
                            </div>

                             <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm pr-12"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                         <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-transparent"
                                />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-bold text-gradient hover:opacity-80 transition-opacity">
                                Forgot password?
                            </Link>
                        </div>

                         <button
                            type="submit"
                            disabled={isLoading || authLoading}
                            className="w-full py-4 px-8 bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading || authLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                     <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800"></div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider px-2">Or connect with</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800"></div>
                    </div>

                     <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-3.5 px-4 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow"
                    >
                        <img src="/google-logo.png" alt="Google" className="w-5 h-5 flex-shrink-0" />
                        <span>Continue with Google</span>
                    </button>

                     <p className="mt-10 text-center text-gray-500 dark:text-gray-400 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4 transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
