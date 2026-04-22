import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const JobSeekerRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        dispatch(register({ ...formData, role: 'Job Seeker' }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                        <FaUser className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Find Your Dream Job</h2>
                    <p className="mt-2 text-sm text-gray-600">Create your job seeker account</p>
                </div>
                
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                name="name" 
                                type="text" 
                                required 
                                value={formData.name} 
                                onChange={onChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                value={formData.email} 
                                onChange={onChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input 
                                    name="password" 
                                    type={showPassword ? 'text' : 'password'} 
                                    required 
                                    value={formData.password} 
                                    onChange={onChange} 
                                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? <FaEyeSlash className="h-4 w-4 text-gray-400" /> : <FaEye className="h-4 w-4 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                required 
                                value={formData.confirmPassword} 
                                onChange={onChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Job Seeker Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
                        </span>
                        <br />
                        <span className="text-sm text-gray-600">
                            Want to hire talent?{' '}
                            <Link to="/register/company" className="font-medium text-blue-600 hover:text-blue-500">Register as Company</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerRegister;