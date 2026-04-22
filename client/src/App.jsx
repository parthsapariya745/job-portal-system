import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./redux/slices/authSlice";
import { store } from "./redux/store";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobSeekerRegister from "./pages/JobSeekerRegister";
import CompanyRegister from "./pages/CompanyRegister";
import GoogleCallback from "./pages/GoogleCallback";

// Role-based pages
import JobSeekerDashboard from "./pages/jobseeker/JobSeekerDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyApplications from "./pages/company/CompanyApplications";
import CompanyProfile from "./pages/company/CompanyProfile";
import Billing from "./pages/company/Billing";
import ManageJobs from "./pages/company/ManageJobs";
import EditJob from "./pages/company/EditJob";
import CompanyAnalytics from "./pages/company/CompanyAnalytics";

// Profile & Settings
import Profile from "./pages/jobseeker/Profile";
import EditProfile from "./pages/jobseeker/EditProfile";
import JobAlerts from "./pages/jobseeker/JobAlerts";
import MyApplications from "./pages/jobseeker/MyApplications";
import SavedJobs from "./pages/jobseeker/SavedJobs";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";

// Support System Pages
import NonEducated from "./pages/NonEducated";
import SupportCategory from "./pages/SupportCategory";
import SupportService from "./pages/SupportService";
import RequestHelp from "./pages/RequestHelp";
import PhoneLogin from "./pages/PhoneLogin";

// Work Opportunity Pages
import WorkOpportunities from "./pages/WorkOpportunities";
import WorkOpportunityDetail from "./pages/WorkOpportunityDetail";
import PostWorkOpportunity from "./pages/PostWorkOpportunity";

// Vulnerable Groups Support
import VulnerableSupport from "./pages/VulnerableSupport";
import GujaratSpecialNeeds from "./pages/GujaratSpecialNeeds";
import ElderlyCare from "./pages/ElderlyCare";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Legacy pages
import Dashboard from "./pages/Dashboard";
import JobSearch from "./pages/JobSearch";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";

const AppContent = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={
                user ? <Navigate to="/dashboard" replace /> : <Register />
              }
            />
            <Route
              path="/forgot-password"
              element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
            />
            <Route
              path="/reset-password/:token"
              element={<ResetPassword />}
            />

            {/* Job Seeker Routes */}
            <Route
              path="/register/jobseeker"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <JobSeekerRegister />
                )
              }
            />
            <Route
              path="/register/company"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <CompanyRegister />
                )
              }
            />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/jobs/search" element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Protected Routes - Role-based Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === "Job Seeker" ? (
                    <JobSeekerDashboard />
                  ) : user?.role === "Company" ? (
                    <CompanyDashboard />
                  ) : user?.role === "Company HR" ? (
                    <CompanyDashboard role="HR" />
                  ) : (
                    <Dashboard />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Support & Opportunities Routes */}
            <Route path="/support/non-educated" element={<NonEducated />} />
            <Route path="/support/category/:categoryId" element={<SupportCategory />} />
            <Route path="/support/service/:serviceId" element={<SupportService />} />
            <Route path="/support/request-help" element={<RequestHelp />} />
            <Route path="/login-phone" element={<PhoneLogin />} />

            {/* Work Opportunity Routes - Dynamic Non-Educated Jobs */}
            <Route path="/work-opportunities" element={<WorkOpportunities />} />
            <Route path="/work-opportunity/:id" element={<WorkOpportunityDetail />} />
            <Route path="/post-work-opportunity" element={<PostWorkOpportunity />} />

            {/* Vulnerable Groups Support - Elderly, Children, etc. */}
            <Route path="/support/vulnerable" element={<VulnerableSupport />} />
            <Route path="/support/gujarat" element={<GujaratSpecialNeeds />} />
            <Route path="/support/elderly" element={<ElderlyCare />} />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={["Job Seeker"]}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-jobs"
              element={
                <ProtectedRoute allowedRoles={["Job Seeker"]}>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["Job Seeker"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute allowedRoles={["Job Seeker"]}>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-alerts"
              element={
                <ProtectedRoute allowedRoles={["Job Seeker"]}>
                  <JobAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Company Routes */}
            <Route
              path="/company/post-job"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/applications"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <CompanyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/jobs"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <ManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/jobs/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <EditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/analytics"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <CompanyAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/profile"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/billing"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <Billing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company/pipeline"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
                    <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl transition-colors">
                      <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 transition-colors">
                        🏗️
                      </div>
                      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
                        Hiring Pipeline
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 font-medium transition-colors">
                        This powerful feature is currently under development. Stay tuned!
                      </p>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Legacy route for backward compatibility */}
            <Route
              path="/post-job"
              element={
                <ProtectedRoute allowedRoles={["Company", "Company HR"]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />

            {/* Error Pages */}
            <Route
              path="/unauthorized"
              element={
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                  <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl transition-colors">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 transition-colors">
                      🚫
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter transition-colors">
                      403
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 font-bold transition-colors">
                      Access Denied. You don't have permission here.
                    </p>
                    <button
                      onClick={() => window.history.back()}
                      className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                  <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl transition-colors">
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 transition-colors">
                      🔍
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter transition-colors">
                      404
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 font-bold transition-colors">
                      Oops! The page you're looking for was lost in orbit.
                    </p>
                    <a
                      href="/"
                      className="px-10 py-4 bg-blue-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-500/25 active:scale-95"
                    >
                      Return Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </NotificationProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;