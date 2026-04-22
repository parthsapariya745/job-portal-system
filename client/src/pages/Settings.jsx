import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/slices/authSlice";
import { FaUserShield, FaBell, FaLock, FaTrashAlt } from "react-icons/fa";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    jobRecommendations: true,
    applicationUpdates: true,
    marketingEmails: false,
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.preferences) {
      setNotifications(user.preferences);
    }
  }, [user]);

  const handleNotificationChange = async (e) => {
    const { name, checked } = e.target;
    // Optimistic update
    setNotifications({ ...notifications, [name]: checked });

    try {
      const updatedPreferences = { ...notifications, [name]: checked };
      const res = await axios.patch(
        "/api/v1/users/profile",
        { preferences: updatedPreferences },
        { withCredentials: true },
      );

      // Update Redux state
      dispatch(updateUser({ preferences: updatedPreferences }));
      toast.success("Preferences updated");
    } catch (error) {
      // Revert on error
      setNotifications({ ...notifications, [name]: !checked });
      toast.error("Failed to update preferences");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      await axios.patch(
        "/api/v1/users/update-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        },
        {
          withCredentials: true,
        },
      );
      toast.success("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: "account",
      label: "Account Security",
      icon: <FaUserShield className="mr-2" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell className="mr-2" />,
    },
    { id: "privacy", label: "Privacy", icon: <FaLock className="mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-10 uppercase tracking-tight transition-colors">Settings</h1>

        <div className="bg-white dark:bg-slate-900 shadow-xl dark:shadow-none rounded-[40px] overflow-hidden min-h-[600px] flex flex-col md:flex-row border border-slate-100 dark:border-slate-800 transition-colors">
          {/* Sidebar / Tabs */}
          <div className="w-full md:w-1/3 bg-slate-50/50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 transition-colors">
            <nav className="flex flex-col p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95"
                      : "text-slate-500 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-300"
                  }`}
                >
                  <span className={`p-2 rounded-xl mr-4 ${activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-slate-200/50 dark:bg-slate-800'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-2/3 p-10 md:p-12">
            {activeTab === "account" && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight italic transition-colors">
                    Change Password
                  </h2>
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4 max-w-md"
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1 transition-colors">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwords.currentPassword}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1 transition-colors">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwords.newPassword}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1 transition-colors">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwords.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold text-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isLoading ? "Updating..." : "Update Password ✨"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="pt-10 border-t border-slate-100 dark:border-slate-800 transition-colors">
                  <h2 className="text-xl font-black text-red-600 mb-4 flex items-center uppercase tracking-tight italic">
                    <FaTrashAlt className="mr-3" /> Danger Zone
                  </h2>
                  <p className="text-slate-500 dark:text-slate-500 font-bold mb-6">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <button
                    onClick={() => toast.info("This feature is coming soon!")}
                    className="px-8 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-2 border-red-100 dark:border-red-900/30 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100 dark:hover:bg-red-900/20 transition-all shadow-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight italic transition-colors">
                    Email Notifications
                  </h2>
                  <div className="space-y-8">
                    <div className="flex items-start group">
                      <div className="flex items-center h-6">
                        <input
                          id="emailAlerts"
                          name="emailAlerts"
                          type="checkbox"
                          checked={notifications.emailAlerts}
                          onChange={handleNotificationChange}
                          className="w-6 h-6 text-blue-600 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-blue-500 bg-white dark:bg-slate-800 transition-all cursor-pointer"
                        />
                      </div>
                      <div className="ml-5 text-sm">
                        <label
                          htmlFor="emailAlerts"
                          className="text-lg font-black text-slate-900 dark:text-white block transition-colors cursor-pointer"
                        >
                          Job Alerts
                        </label>
                        <p className="text-slate-500 dark:text-slate-500 font-bold transition-colors">
                          Get notified when new jobs match your preferences.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      <div className="flex items-center h-6">
                        <input
                          id="applicationUpdates"
                          name="applicationUpdates"
                          type="checkbox"
                          checked={notifications.applicationUpdates}
                          onChange={handleNotificationChange}
                          className="w-6 h-6 text-blue-600 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-blue-500 bg-white dark:bg-slate-800 transition-all cursor-pointer"
                        />
                      </div>
                      <div className="ml-5 text-sm">
                        <label
                          htmlFor="applicationUpdates"
                          className="text-lg font-black text-slate-900 dark:text-white block transition-colors cursor-pointer"
                        >
                          Application Status
                        </label>
                        <p className="text-slate-500 dark:text-slate-500 font-bold transition-colors">
                          Receive updates when your application status changes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start group">
                      <div className="flex items-center h-6">
                        <input
                          id="marketingEmails"
                          name="marketingEmails"
                          type="checkbox"
                          checked={notifications.marketingEmails}
                          onChange={handleNotificationChange}
                          className="w-6 h-6 text-blue-600 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-blue-500 bg-white dark:bg-slate-800 transition-all cursor-pointer"
                        />
                      </div>
                      <div className="ml-5 text-sm">
                        <label
                          htmlFor="marketingEmails"
                          className="text-lg font-black text-slate-900 dark:text-white block transition-colors cursor-pointer"
                        >
                          Marketing & Offers
                        </label>
                        <p className="text-slate-500 dark:text-slate-500 font-bold transition-colors">
                          Receive emails about new features and special offers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight italic transition-colors">
                  Privacy Settings
                </h2>
                <p className="text-slate-500 dark:text-slate-500 font-bold text-lg mb-8 transition-colors">
                  Manage how your profile is viewed by others.
                </p>

                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-8 rounded-[32px] transition-all">
                  <div className="flex gap-4">
                    <span className="text-3xl">🛠️</span>
                    <div>
                      <p className="text-amber-800 dark:text-amber-200 font-bold leading-relaxed transition-colors">
                        Privacy controls are currently under development. All
                        profiles are visible to registered employers by default to maximize your job chances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
