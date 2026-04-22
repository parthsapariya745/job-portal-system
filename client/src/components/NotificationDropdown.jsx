import { useState, useRef, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors"
            >
                <FaBell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    
                     <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400 py-8">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.slice(0, 3).map((notification) => (
                                 <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                                    }`}
                                    onClick={() => {
                                        if (!notification.read) {
                                            markAsRead(notification._id);
                                        }
                                        if (notification.actionUrl) {
                                            navigate(notification.actionUrl);
                                            setIsOpen(false);
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
                                            setIsOpen(false);
                                        }
                                    }}
                                >
                                     <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 transition-colors">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 italic transition-colors">
                                                {formatTime(notification.createdAt)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full ml-3 mt-1.5 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                     {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-100 dark:border-slate-800 text-center transition-colors">
                            <Link 
                                to="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;