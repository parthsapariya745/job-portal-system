import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
    FaBriefcase, 
    FaClock, 
    FaCheckCircle, 
    FaTimesCircle,
    FaEye,
    FaCalendarAlt,
    FaFilter,
    FaSearch
} from 'react-icons/fa';

const Applications = () => {
    const { user } = useSelector((state) => state.auth);
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock applications data
    const mockApplications = [
        {
            _id: '1',
            jobTitle: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            appliedDate: '2024-01-15',
            status: 'pending',
            location: 'San Francisco, CA',
            salary: '$120,000 - $150,000',
            type: 'Full-time',
            lastUpdate: '2024-01-16'
        },
        {
            _id: '2',
            jobTitle: 'Product Manager',
            company: 'StartupXYZ',
            appliedDate: '2024-01-10',
            status: 'interview',
            location: 'Remote',
            salary: '$100,000 - $130,000',
            type: 'Full-time',
            lastUpdate: '2024-01-14',
            interviewDate: '2024-01-20'
        },
        {
            _id: '3',
            jobTitle: 'UX Designer',
            company: 'Design Studio',
            appliedDate: '2024-01-08',
            status: 'rejected',
            location: 'New York, NY',
            salary: '$80,000 - $100,000',
            type: 'Contract',
            lastUpdate: '2024-01-12'
        },
        {
            _id: '4',
            jobTitle: 'Full Stack Developer',
            company: 'Innovation Labs',
            appliedDate: '2024-01-05',
            status: 'accepted',
            location: 'Austin, TX',
            salary: '$110,000 - $140,000',
            type: 'Full-time',
            lastUpdate: '2024-01-13'
        }
    ];

    useEffect(() => {
        setApplications(mockApplications);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'interview':
                return 'bg-blue-100 text-blue-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaClock className="h-4 w-4" />;
            case 'interview':
                return <FaCalendarAlt className="h-4 w-4" />;
            case 'accepted':
                return <FaCheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <FaTimesCircle className="h-4 w-4" />;
            default:
                return <FaClock className="h-4 w-4" />;
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesFilter = filter === 'all' || app.status === filter;
        const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.company.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const statusCounts = {
        all: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        interview: applications.filter(app => app.status === 'interview').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight transition-colors">My Applications</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Track your job applications and their status</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-200 dark:border-slate-800 transition-colors group">
                        <div className="text-center">
                            <p className="text-3xl font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">{statusCounts.all}</p>
                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Total</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-200 dark:border-slate-800 transition-colors group">
                        <div className="text-center">
                            <p className="text-3xl font-black text-yellow-500 group-hover:scale-110 transition-transform">{statusCounts.pending}</p>
                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Pending</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-200 dark:border-slate-800 transition-colors group">
                        <div className="text-center">
                            <p className="text-3xl font-black text-blue-500 group-hover:scale-110 transition-transform">{statusCounts.interview}</p>
                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Interview</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-200 dark:border-slate-800 transition-colors group">
                        <div className="text-center">
                            <p className="text-3xl font-black text-green-500 group-hover:scale-110 transition-transform">{statusCounts.accepted}</p>
                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Accepted</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-200 dark:border-slate-800 transition-colors group">
                        <div className="text-center">
                            <p className="text-3xl font-black text-red-500 group-hover:scale-110 transition-transform">{statusCounts.rejected}</p>
                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Rejected</p>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-800 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex flex-wrap gap-3">
                            {['all', 'pending', 'interview', 'accepted', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-6 py-2.5 rounded-2xl text-sm font-black capitalize transition-all active:scale-95 ${
                                        filter === status
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {status} ({statusCounts[status]})
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search applications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-full md:w-80 transition-all font-medium text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    {filteredApplications.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                            <div className="bg-slate-50 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaBriefcase className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">No applications found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                                {filter === 'all' 
                                    ? "You haven't applied to any jobs yet." 
                                    : `No applications matching "${filter}".`
                                }
                            </p>
                            <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all">
                                Find Jobs ✨
                            </button>
                        </div>
                    ) : (
                        filteredApplications.map((application) => (
                            <div key={application._id} className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex gap-6">
                                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50 shadow-inner group-hover:scale-110 transition-transform">
                                                    <FaBriefcase className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                                                        {application.jobTitle}
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400 font-bold text-lg leading-tight mt-1">{application.company}</p>
                                                    <div className="flex flex-wrap items-center mt-4 gap-3">
                                                        <span className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">{application.location}</span>
                                                        <span className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 border border-blue-50 dark:border-blue-900/40">{application.type}</span>
                                                        <span className="bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400 border border-green-50 dark:border-green-900/40">{application.salary}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex self-start">
                                                <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm ${getStatusColor(application.status)}`}>
                                                    <span className="mr-2">{getStatusIcon(application.status)}</span>
                                                    {application.status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-slate-50 dark:border-slate-800 transition-colors">
                                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                <div>
                                                    <span className="text-slate-900 dark:text-slate-300">Applied:</span> {new Date(application.appliedDate).toLocaleDateString()}
                                                </div>
                                                <div>
                                                    <span className="text-slate-900 dark:text-slate-300">Updated:</span> {new Date(application.lastUpdate).toLocaleDateString()}
                                                </div>
                                                {application.interviewDate && (
                                                    <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                        <FaCalendarAlt className="h-3 w-3" />
                                                        Interview: {new Date(application.interviewDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                                    <FaEye className="h-3 w-3" />
                                                    View Job
                                                </button>
                                                {application.status === 'interview' && (
                                                    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-95">
                                                        Prepare
                                                    </button>
                                                )}
                                                {application.status === 'pending' && (
                                                    <button className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black uppercase tracking-widest transition-all group-hover:bg-red-600">
                                                        Withdraw
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {filteredApplications.length > 0 && (
                    <div className="flex justify-center mt-12 pb-10">
                        <nav className="flex items-center gap-2">
                            <button className="px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all disabled:opacity-50">
                                Prev
                            </button>
                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${
                                        page === 1
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;