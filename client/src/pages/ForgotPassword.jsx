import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { forgotPassword } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            const res = await dispatch(forgotPassword(email)).unwrap();
            toast.success(res.message || "Reset link sent to your email!");
            setEmail('');
        } catch (err) {
            toast.error(err || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/30 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-300/30 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-10 px-8 md:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border border-white dark:border-slate-800 rounded-[40px] transition-all">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl shadow-blue-500/20">
                            <FaEnvelope />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Forgot Password?</h2>
                        <p className="mt-3 text-slate-500 dark:text-slate-400 font-bold">No worries, we'll send you reset instructions.</p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1 transition-colors">
                                Email Address
                            </label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 bg-blue-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    'Send Reset Link ✨'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
