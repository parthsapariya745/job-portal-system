import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { searchJobs } from '../redux/slices/jobsSlice';
import { 
    FaSearch, 
    FaMapMarkerAlt, 
    FaFilter, 
    FaBriefcase, 
    FaClock, 
    FaBookmark,
    FaRegBookmark,
    FaDollarSign,
    FaBuilding,
    FaUsers
} from 'react-icons/fa';
import Skeleton, { SkeletonCard } from '../components/Skeleton';
import { motion } from 'framer-motion';
// Simple custom debounce if lodash is not available
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const JobSearch = () => {
    const dispatch = useDispatch();
    const { jobs: reduxJobs, isLoading } = useSelector((state) => state.jobs);
    const { user, accessToken } = useSelector((state) => state.auth);
    const userJobRole = user?.profile?.jobRole || '';
    
    const locationParams = useLocation();
    const searchParams = new URLSearchParams(locationParams.search);
    const queryKeyword = searchParams.get('keyword') || '';

    const [filters, setFilters] = useState({
        keyword: queryKeyword,
        location: '',
        jobType: '',
        experience: '',
        category: '',
        salary: '',
        salaryType: '',
        company: '',
        sort: 'latest'
    });
    
    const [showFilters, setShowFilters] = useState(false);
    const [savedJobs, setSavedJobs] = useState(new Set());
    const [savingJobId, setSavingJobId] = useState(null);

    useEffect(() => {
        const fetchSaved = async () => {
            if (user && accessToken) {
                try {
                    const res = await axios.get("/api/v1/users/saved-jobs", {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        withCredentials: true,
                    });
                    const list = res.data?.data?.savedJobs || [];
                    setSavedJobs(new Set(list.map((j) => j._id?.toString?.() || j)));
                } catch (e) {
                    console.error("Failed to fetch saved jobs", e);
                }
            }
        };
        fetchSaved();
    }, [user, accessToken]);

    // Debounce keyword and location to avoid too many API calls
    const debouncedKeyword = useDebounce(filters.keyword, 500);
    const debouncedLocation = useDebounce(filters.location, 500);

    // Fetch jobs when filters change
    useEffect(() => {
        const query = {};
        
        if (debouncedKeyword) query.keyword = debouncedKeyword;
        if (debouncedLocation) query.location = debouncedLocation;
        if (filters.jobType) query.type = filters.jobType;
        if (filters.experience) query.experience = filters.experience;
        if (filters.category) query.category = filters.category;
        if (filters.sort) query.sort = filters.sort;
        
        // Parse Salary
        if (filters.salary) {
            if (filters.salary.includes('+')) {
                query.minSalary = filters.salary.replace('+', '').replace(/,/g, '');
            } else if (filters.salary.includes('-')) {
                const [min, max] = filters.salary.split('-');
                if (min) query.minSalary = min;
                if (max) query.maxSalary = max;
            }
        }
        
        if (filters.salaryType) {
            query.salaryType = filters.salaryType;
        }

        dispatch(searchJobs(query));
    }, [debouncedKeyword, debouncedLocation, filters.jobType, filters.experience, filters.category, filters.salary, filters.salaryType, filters.sort, dispatch]);

    const applyRoleFilter = () => {
        if (userJobRole) {
            setFilters(prev => ({ ...prev, keyword: userJobRole }));
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleSaveJob = async (jobId) => {
        if (!user || !accessToken) {
            toast.info("Please login to save jobs");
            return;
        }
        setSavingJobId(jobId);
        try {
            const isSaved = savedJobs.has(jobId);
            const config = { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true };
            if (isSaved) {
                await axios.delete(`/api/v1/users/saved-jobs/${jobId}`, config);
                setSavedJobs((prev) => {
                    const next = new Set(prev);
                    next.delete(jobId);
                    return next;
                });
                toast.info("Removed from saved jobs");
            } else {
                await axios.post(`/api/v1/users/saved-jobs/${jobId}`, {}, config);
                setSavedJobs((prev) => new Set([...prev, jobId]));
                toast.success("Job saved");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update saved status");
        } finally {
            setSavingJobId(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 overflow-hidden">
            <div className="max-w-7xl mx-auto relative relative z-10">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 dark:opacity-20 animate-blob pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 dark:opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

                {/* Colorful Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 text-center bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 rounded-[40px] p-12 shadow-[0_20px_50px_rgba(30,58,138,0.3)] text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <span className="inline-block bg-white/20 text-blue-50 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-6 backdrop-blur-md border border-white/20 shadow-sm">
                            EXPLORE OPPORTUNITIES
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-md">Find Your Dream Job ✨</h1>
                        <p className="text-blue-100 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">Discover top opportunities matching your skills and start your career journey today.</p>
                        {userJobRole && (
                            <button
                                onClick={applyRoleFilter}
                                className="mt-8 inline-flex items-center px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xl transition-all hover:scale-105 font-bold text-lg border border-blue-50 dark:border-blue-900/40"
                            >
                                <FaBriefcase className="mr-3 h-5 w-5" />
                                Search jobs for {userJobRole}
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-card p-4 sm:p-6 mb-10 border border-slate-200/50 relative z-20 -mt-16 mx-4 sm:mx-10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-indigo-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Job title, keywords..."
                                value={filters.keyword}
                                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-gray-900 dark:text-white font-medium placeholder-slate-400 shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaMapMarkerAlt className="h-5 w-5 text-pink-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="City, state, remote..."
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-gray-900 dark:text-white font-medium placeholder-slate-400 shadow-sm"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center justify-center px-6 py-4 border rounded-2xl transition-all font-bold text-lg flex-1 md:flex-[0.4] ${showFilters ? 'bg-indigo-500 text-white border-transparent shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <FaFilter className="h-5 w-5 mr-2" />
                            </button>
                            <button className="flex-[2] flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-bold text-lg shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:scale-95 transition-all">
                                Search 🚀
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-100 animate-fade-in-down">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <select
                                    value={filters.jobType}
                                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                    className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-xl font-medium focus:border-indigo-400 focus:ring-0 text-gray-900 dark:text-white"
                                >
                                    <option className="dark:bg-slate-900" value="">All Job Types</option>
                                    <option className="dark:bg-slate-900" value="Full-time">Full-time</option>
                                    <option className="dark:bg-slate-900" value="Part-time">Part-time</option>
                                    <option className="dark:bg-slate-900" value="Contract">Contract</option>
                                    <option className="dark:bg-slate-900" value="Internship">Internship</option>
                                    <option className="dark:bg-slate-900" value="Freelance">Freelance</option>
                                </select>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-xl font-medium focus:border-indigo-400 focus:ring-0 text-gray-900 dark:text-white"
                                    title="Filter by role/category"
                                >
                                    <option className="dark:bg-slate-900" value="">All Categories</option>
                                    <option className="dark:bg-slate-900" value="Tech">Tech</option>
                                    <option className="dark:bg-slate-900" value="Non-Tech">Non-Tech</option>
                                    <option className="dark:bg-slate-900" value="Marketing">Marketing</option>
                                    <option className="dark:bg-slate-900" value="Finance">Finance</option>
                                    <option className="dark:bg-slate-900" value="Sales">Sales</option>
                                    <option className="dark:bg-slate-900" value="HR">HR</option>
                                    <option className="dark:bg-slate-900" value="Design">Design</option>
                                    <option className="dark:bg-slate-900" value="Operations">Operations</option>
                                </select>
                                <select
                                    value={filters.experience}
                                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                                    className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-xl font-medium focus:border-indigo-400 focus:ring-0 text-gray-900 dark:text-white transition-colors"
                                >
                                    <option className="dark:bg-slate-900" value="">Any Experience</option>
                                    <option className="dark:bg-slate-900" value="entry">Entry Level</option>
                                    <option className="dark:bg-slate-900" value="mid">Mid Level</option>
                                    <option className="dark:bg-slate-900" value="senior">Senior Level</option>
                                    <option className="dark:bg-slate-900" value="executive">Executive</option>
                                </select>
                                <select
                                    value={filters.salary}
                                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                                    className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-xl font-medium focus:border-indigo-400 focus:ring-0 text-gray-900 dark:text-white transition-colors"
                                >
                                    <option className="dark:bg-slate-900" value="">Any Salary</option>
                                    <option className="dark:bg-slate-900" value="0-50000">$0 - $50k</option>
                                    <option className="dark:bg-slate-900" value="50000-100000">$50k - $100k</option>
                                    <option className="dark:bg-slate-900" value="100000-150000">$100k - $150k</option>
                                    <option className="dark:bg-slate-900" value="150000+">$150k+</option>
                                </select>
                                <select
                                    value={filters.salaryType}
                                    onChange={(e) => handleFilterChange('salaryType', e.target.value)}
                                    className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-xl font-medium focus:border-indigo-400 focus:ring-0 text-gray-900 dark:text-white transition-colors"
                                >
                                    <option className="dark:bg-slate-900" value="">Any Pay Type</option>
                                    <option className="dark:bg-slate-900" value="Per Year">Per Year</option>
                                    <option className="dark:bg-slate-900" value="Per Month">Per Month</option>
                                </select>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-100 dark:border-indigo-900/50 rounded-xl font-bold text-indigo-700 dark:text-indigo-300 focus:border-indigo-400 focus:ring-0"
                                >
                                    <option className="dark:bg-slate-900" value="latest">Sort: Newest First</option>
                                    <option className="dark:bg-slate-900" value="oldest">Sort: Oldest First</option>
                                    <option className="dark:bg-slate-900" value="salary-high">Salary: High to Low</option>
                                    <option className="dark:bg-slate-900" value="salary-low">Salary: Low to High</option>
                                </select>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Results Header */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-between items-center mb-6 pl-2 relative z-10"
                >
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-widest uppercase">
                        {isLoading ? 'Searching...' : `🌟 FOUND ${reduxJobs?.length || 0} JOBS FOR YOU`}
                    </p>
                </motion.div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : Array.isArray(reduxJobs) && reduxJobs.length > 0 ? (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-6 relative z-10 pb-12"
                    >
                        {reduxJobs.map((job) => (
                            <motion.div 
                                variants={itemVariants}
                                key={job._id} 
                                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 group relative overflow-hidden"
                            >
                                {/* subtle hover gradient flare */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 dark:from-indigo-900/20 via-white dark:via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                <div className="flex flex-col sm:flex-row justify-between items-start relative z-10">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-start justify-between relative">
                                            <div className="flex flex-col sm:flex-row sm:items-center w-full gap-5">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm p-3 group-hover:shadow-md transition-shadow">
                                                    {job.company?.logo ? (
                                                        <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <FaBuilding className="h-8 w-8 text-indigo-400 dark:text-indigo-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg leading-snug">{job.company?.name || job.companyName}</p>
                                                    <div className="flex flex-wrap items-center mt-3 gap-2">
                                                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300">
                                                            <FaMapMarkerAlt className="h-3.5 w-3.5 mr-1.5 text-pink-500" />
                                                            {job.location}
                                                        </div>
                                                        <div className="flex items-center bg-blue-50/50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-lg text-sm font-bold text-blue-700 dark:text-blue-300">
                                                            <FaBriefcase className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                                            {job.type}
                                                        </div>
                                                        <div className="flex items-center bg-purple-50/50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 px-3 py-1 rounded-lg text-sm font-bold text-purple-700 dark:text-purple-300">
                                                            <FaClock className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                                                            {new Date(job.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {user?.role === "Job Seeker" && (
                                                <button
                                                    onClick={() => toggleSaveJob(job._id)}
                                                    disabled={savingJobId === job._id}
                                                    className="absolute sm:relative top-0 right-0 sm:top-auto sm:right-auto p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-200 dark:hover:border-yellow-900/40 text-slate-400 hover:text-yellow-500 transition-all shadow-sm focus:ring-2 disabled:opacity-50"
                                                    title={savedJobs.has(job._id) ? "Remove from saved" : "Save job"}
                                                >
                                                    {savedJobs.has(job._id) ? (
                                                        <FaBookmark className="h-5 w-5 text-yellow-500" />
                                                    ) : (
                                                        <FaRegBookmark className="h-5 w-5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex items-center space-x-3 text-sm font-bold mb-4">
                                                {job.salary && (
                                                    <div className="flex items-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-xl border border-green-200/50 dark:border-green-800/50 shadow-sm">
                                                        {job.salary.min ? `₹${job.salary.min.toLocaleString()}` : ''} 
                                                        {job.salary.max ? ` - ₹${job.salary.max.toLocaleString()}` : ''}
                                                        {job.salary.salaryType === 'Per Month' ? ' / month' : ' LPA'}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed line-clamp-2">
                                                {job.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-5">
                                                {(Array.isArray(job.requirements) ? job.requirements : job.requirements?.split(',') || []).slice(0, 5).map((req, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 uppercase tracking-widest"
                                                    >
                                                        {typeof req === 'string' ? req.trim() : req}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 gap-4">
                                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                {job.level && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">LVL: {job.level}</span>}
                                                {job.category && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{job.category}</span>}
                                            </div>
                                            <div className="flex space-x-3 w-full sm:w-auto">
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="flex-1 justify-center sm:flex-none px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl transition-colors shadow-sm flex items-center"
                                                >
                                                    DETAILS
                                                </Link>
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className="flex-1 justify-center sm:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center"
                                                >
                                                    APPLY NOW ✨
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border-4 border-indigo-50 dark:border-indigo-900/20 shadow-xl mt-4">
                        <div className="mx-auto h-24 w-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                            <FaSearch className="h-10 w-10 text-indigo-300 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase">No jobs found 😢</h3>
                        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 font-medium">Try adjusting your filters or searching with different keywords.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSearch;