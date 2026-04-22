import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { FaBell, FaCheck, FaTrash, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const formatTime = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <FaCheckCircle className="text-green-500 h-6 w-6" />;
            case 'warning':
                return <FaExclamationCircle className="text-yellow-500 h-6 w-6" />;
            case 'info':
            default:
                return <FaInfoCircle className="text-blue-500 h-6 w-6" />;
        }
    };

    const formatNotificationMessage = (message) => {
        if (!message) return null;
        
        // "Company Name has posted a new job: Job Title. Check it out!"
        const newJobMatch = message.match(/^(.*?)\s+has posted a new job:\s+(.*?)\.\s+Check it out!/);
        if (newJobMatch) {
             return (
                <span>
                    <span className="font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 shadow-sm mr-1 transition-colors">{newJobMatch[1]}</span>
                    has posted a new job:
                    <span className="font-bold text-slate-900 dark:text-white ml-1 border-b-2 border-indigo-200 dark:border-indigo-800 transition-colors">{newJobMatch[2]}</span>. Check it out!
                </span>
            );
        }

        // "Your application for Job Title at Company Name has been marked as Status."
        const appStatusMatch = message.match(/^Your application for\s+(.*?)\s+at\s+(.*?)\s+has been marked as\s+(.*?)\./);
        if (appStatusMatch) {
             return (
                <span>
                    Your application for
                    <span className="font-bold text-slate-900 dark:text-white mx-1 border-b-2 border-indigo-200 dark:border-indigo-800 transition-colors">{appStatusMatch[1]}</span>
                    at
                    <span className="font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 shadow-sm mx-1 transition-colors">{appStatusMatch[2]}</span>
                    has been marked as
                    <span className={`mx-1 font-black uppercase tracking-wider text-xs px-2 py-0.5 rounded-md border shadow-sm transition-colors ${
                        appStatusMatch[3] === 'accepted' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' :
                        appStatusMatch[3] === 'rejected' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' :
                        'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    }`}>{appStatusMatch[3]}</span>.
                </span>
            );
        }

        // "User Name has applied for your job post: Job Title"
        const newAppMatch = message.match(/^(.*?)\s+has applied for your job post:\s+(.*)$/);
        if (newAppMatch) {
             return (
                <span>
                    <span className="font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 shadow-sm mr-1 transition-colors">{newAppMatch[1]}</span>
                    has applied for your job post:
                    <span className="font-bold text-slate-900 dark:text-white ml-1 border-b-2 border-indigo-200 dark:border-indigo-800 transition-colors">{newAppMatch[2]}</span>
                </span>
            );
        }

        return message;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-300 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 transition-colors">
                            <FaBell className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight transition-colors">Your Notifications</h1>
                            <p className="text-slate-500 dark:text-gray-400 font-medium transition-colors">You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{unreadCount}</span> unread messages</p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                         <button
                            onClick={markAllAsRead}
                            className="px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl transition-all shrink-0 flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 shadow-sm"
                        >
                            <FaCheck /> Mark all as read
                        </button>
                    )}
                </motion.div>

                <div className="space-y-4">
                     {notifications.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                <FaBell className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-700 dark:text-white mb-2 transition-colors">No active notifications</h3>
                            <p className="text-slate-500 dark:text-gray-400 font-medium transition-colors">We'll let you know when something important happens.</p>
                        </motion.div>
                    ) : (
                        notifications.map((notification, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={notification._id}
                                onClick={() => {
                                    if (!notification.read) {
                                        markAsRead(notification._id);
                                    }
                                    if (notification.actionUrl) {
                                        navigate(notification.actionUrl);
                                    } else {
                                        // Smart fallback for old notifications
                                        const titleCheck = notification.title?.toLowerCase() || "";
                                        if (titleCheck.includes('job posted')) {
                                            navigate('/jobs');
                                        } else if (titleCheck.includes('application')) {
                                            navigate('/applications');
                                        } else {
                                            navigate('/dashboard');
                                        }
                                    }
                                }}
                                 className={`p-6 rounded-2xl border transition-all cursor-pointer flex gap-5 group items-start sm:items-center shadow-sm ${
                                    !notification.read 
                                        ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:shadow-md' 
                                        : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md opacity-80'
                                }`}
                            >
                                <div className="shrink-0 mt-1 sm:mt-0 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-all">
                                    {getIcon(notification.type || 'info')}
                                </div>
                                 <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-1">
                                        <h3 className={`font-black text-lg transition-colors ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-gray-300'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs font-bold px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-gray-400 whitespace-nowrap shadow-sm shrink-0 transition-colors">
                                            {formatTime(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p className={`font-medium leading-relaxed transition-colors ${!notification.read ? 'text-slate-700 dark:text-gray-200' : 'text-slate-500 dark:text-gray-400'}`}>
                                        {formatNotificationMessage(notification.message)}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="shrink-0 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
