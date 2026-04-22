import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { logout, reset } from "../redux/slices/authSlice";
import { FaUserCircle, FaChevronDown, FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { name: "Home", path: "/" },
        { name: "Find Jobs", path: "/jobs/search" },
      ];
    }

    const baseLinks = [
      { name: "Home", path: "/" },
      { name: "Jobs", path: "/jobs" },
    ];

    if (user.role === "Job Seeker") {
      return [
        ...baseLinks,
        { name: "My Applications", path: "/applications" },
        { name: "Saved Jobs", path: "/saved-jobs" },
      ];
    }

    if (user.role === "Company" || user.role === "Company HR") {
      return [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Post Job", path: "/company/post-job" },
        { name: "Applications", path: "/company/applications" },
        { name: "Analytics", path: "/company/analytics" },
      ];
    }

    return baseLinks;
  };

  const getUserMenuItems = () => {
    if (!user) return [];

    const dashboardItem = { name: "Dashboard", path: "/dashboard" };

    if (user.role === "Job Seeker") {
      return [
        dashboardItem,
        { name: "Profile", path: "/profile" },
        { name: "Edit Profile", path: "/profile/edit" },
        { name: "Job Alerts", path: "/job-alerts" },
        { name: "Settings", path: "/settings" },
      ];
    }

    if (user.role === "Company" || user.role === "Company HR") {
      return [
        dashboardItem,
        { name: "Company Profile", path: "/company/profile" },
        { name: "Billing", path: "/company/billing" },
        { name: "Settings", path: "/settings" },
      ];
    }

    return [dashboardItem, { name: "Settings", path: "/settings" }];
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isHomePage && !isScrolled 
        ? "bg-transparent border-transparent" 
        : "glass-nav py-2"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          {/* Logo and Navigation */}
          <div className="flex items-center min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-1.5 xs:p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-0.5 xs:mr-1"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <FaTimes className="h-4 w-4 xs:h-5 xs:w-5" />
              ) : (
                <FaBars className="h-4 w-4 xs:h-5 xs:w-5" />
              )}
            </button>

            <Link to="/" className="flex-shrink-0 flex items-center min-w-0">
              <div className="flex items-center group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-black text-sm sm:text-base">JP</span>
                </div>
                <span className="text-lg sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                  <span className="hidden xs:inline">JobPortal</span>
                  <span className="xs:hidden">JP</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-4 sm:flex sm:space-x-2 lg:space-x-6">
              {getNavLinks().slice(0, 4).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 text-sm font-semibold transition-colors"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <FaMoon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <FaSun className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            {user ? (
              <>
                {/* Notifications - Hidden on very small screens */}
                <div className="hidden sm:block">
                  <NotificationDropdown />
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-sm rounded-full focus:outline-none p-1.5 hover-glass border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-white dark:border-slate-700">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="hidden md:block text-left min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[80px] sm:max-w-[100px]">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px] sm:max-w-[100px]">{user.role}</p>
                    </div>
                    <FaChevronDown className="h-3 w-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-44 xs:w-48 sm:w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-800 py-1 z-50">
                      <div className="px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-3 border-b border-gray-100 dark:border-slate-800">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mt-1">
                          {user.role}
                        </span>
                      </div>

                      {getUserMenuItems().map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowUserMenu(false)}
                          className="block px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors truncate"
                        >
                          {item.name}
                        </Link>
                      ))}

                      <div className="border-t border-gray-100 dark:border-slate-800 mt-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-1.5 py-1 xs:px-2 xs:py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-1.5 py-1 xs:px-2 xs:py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="sm:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="pt-1 pb-2 space-y-0.5">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setShowMobileMenu(false)}
                className="border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-white block pl-2 pr-3 py-1.5 border-l-4 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile-only notification link if user is logged in */}
            {user && (
              <Link
                to="/notifications"
                onClick={() => setShowMobileMenu(false)}
                className="border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-white block pl-2 pr-3 py-1.5 border-l-4 text-sm font-medium sm:hidden"
              >
                Notifications
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;