import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaBriefcase, FaEye, FaEyeSlash } from 'react-icons/fa';

const CompanyRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        recruiterRole: 'Company'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) navigate('/dashboard');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = formData;
        
        if (!name || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        setIsLoading(true);
        dispatch(register({ name, email, password, role: formData.recruiterRole }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 py-12 px-4 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <FaBriefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Hire Top Talent</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Create your company account</p>
                </div>
                
                <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-lg rounded-[24px] border border-gray-100 dark:border-slate-800 transition-colors">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Your Full Name</label>
                            <input 
                                name="name" 
                                type="text" 
                                required 
                                value={formData.name} 
                                onChange={onChange} 
                                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm" 
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Your Role</label>
                            <select
                                name="recruiterRole"
                                value={formData.recruiterRole}
                                onChange={onChange}
                                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm"
                            >
                                <option className="dark:bg-slate-900" value="Company">Company Admin (Owner/Director)</option>
                                <option className="dark:bg-slate-900" value="Company HR">Company HR (Manager/Recruiter)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Work Email</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                value={formData.email} 
                                onChange={onChange} 
                                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm" 
                                placeholder="Enter your work email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <input 
                                    name="password" 
                                    type={showPassword ? 'text' : 'password'} 
                                    required 
                                    value={formData.password} 
                                    onChange={onChange} 
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm pr-11" 
                                    placeholder="Min 8 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Confirm Password</label>
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                required 
                                value={formData.confirmPassword} 
                                onChange={onChange} 
                                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-sm" 
                                placeholder="Retype password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-8 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Company Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-green-600 dark:text-green-400 hover:underline hover:text-green-500 transition-colors">Sign in</Link>
                        </p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Looking for a job?{' '}
                            <Link to="/register/jobseeker" className="font-bold text-green-600 dark:text-green-400 hover:underline hover:text-green-500 transition-colors">Register as Job Seeker</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyRegister;