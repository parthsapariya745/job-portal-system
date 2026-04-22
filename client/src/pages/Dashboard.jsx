import { useSelector } from 'react-redux';
import { FaBriefcase, FaBookmark, FaUsers, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/30 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-300/30 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white flex items-center tracking-tight transition-colors uppercase italic">
                        Dashboard
                    </h1>
                    <p className="mt-4 text-xl font-bold text-slate-500 dark:text-slate-400 transition-colors">
                        Welcome back, <span className="text-blue-600 dark:text-blue-400">{user.name}</span>. You are logged in as <span className="uppercase tracking-widest text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border dark:border-slate-700 ml-2">{user.role}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {user.role === 'Job Searcher' ? (
                        <>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[32px] shadow-xl dark:shadow-none border border-white dark:border-slate-800 transition-all hover:-translate-y-1 group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                                        <FaBriefcase className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Applied</span>
                                </div>
                                <p className="text-4xl font-black text-slate-900 dark:text-white transition-colors">0</p>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[32px] shadow-xl dark:shadow-none border border-white dark:border-slate-800 transition-all hover:-translate-y-1 group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl text-yellow-600 dark:text-yellow-400">
                                        <FaBookmark className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Saved Jobs</span>
                                </div>
                                <p className="text-4xl font-black text-slate-900 dark:text-white transition-colors">0</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[32px] shadow-xl dark:shadow-none border border-white dark:border-slate-800 transition-all hover:-translate-y-1 group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                                        <FaBriefcase className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Active Listings</span>
                                </div>
                                <p className="text-4xl font-black text-slate-900 dark:text-white transition-colors">0</p>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[32px] shadow-xl dark:shadow-none border border-white dark:border-slate-800 transition-all hover:-translate-y-1 group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600 dark:text-green-400">
                                        <FaUsers className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total Applicants</span>
                                </div>
                                <p className="text-4xl font-black text-slate-900 dark:text-white transition-colors">0</p>
                            </div>
                        </>
                    )}
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[32px] shadow-xl dark:shadow-none border border-white dark:border-slate-800 transition-all hover:-translate-y-1 group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
                                <FaChartLine className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Performance</span>
                        </div>
                        <p className="text-4xl font-black text-slate-900 dark:text-white transition-colors">High</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
