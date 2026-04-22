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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
                        <FaBriefcase className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Hire Top Talent</h2>
                    <p className="mt-2 text-sm text-gray-600">Create your company account</p>
                </div>
                
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Full Name</label>
                            <input 
                                name="name" 
                                type="text" 
                                required 
                                value={formData.name} 
                                onChange={onChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" 
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Role</label>
                            <select
                                name="recruiterRole"
                                value={formData.recruiterRole}
                                onChange={onChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="Company">Company Admin (Owner/Director)</option>
                                <option value="Company HR">Company HR (Manager/Recruiter)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Work Email</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                value={formData.email} 
                                onChange={onChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" 
                                placeholder="Enter your work email"
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
                                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" 
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" 
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Company Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">Sign in</Link>
                        </span>
                        <br />
                        <span className="text-sm text-gray-600">
                            Looking for a job?{' '}
                            <Link to="/register/jobseeker" className="font-medium text-green-600 hover:text-green-500">Register as Job Seeker</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyRegister;