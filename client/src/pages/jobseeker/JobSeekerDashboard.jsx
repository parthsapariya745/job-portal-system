import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaBriefcase,
  FaBookmark,
  FaEye,
  FaUsers,
  FaChartLine,
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import Skeleton, { SkeletonStat, SkeletonRow } from "../../components/Skeleton";

const JobSeekerDashboard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    appliedJobs: 0,
    savedJobs: 0,
    profileViews: user?.profile?.profileViews || 0,
    connections: user?.profile?.connections || 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        };

        // Fetch Applications
        const appsRes = await axios.get("/api/v1/applications/my", config);
        const apps = appsRes.data?.data?.applications || [];
        setApplications(apps);

        // Fetch Saved Jobs
        const savedRes = await axios.get("/api/v1/users/saved-jobs", config);
        const saved = savedRes.data?.data?.savedJobs || [];

        // Fetch Recommended Jobs - filter by role when user has jobRole set
        const jobRole = user?.profile?.jobRole;
        const jobsQuery = new URLSearchParams({
          limit: "5",
          sort: "-createdAt",
        });
        if (jobRole) jobsQuery.set("keyword", jobRole);
        const jobsRes = await axios.get(`/api/v1/jobs?${jobsQuery}`);
        setRecentJobs(jobsRes.data?.jobs || jobsRes.data?.data?.jobs || []);

        setStats({
          appliedJobs: apps.length,
          savedJobs: saved.length,
          profileViews: user?.profile?.profileViews || 0,
          connections: user?.profile?.connections || 0,
        });
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && accessToken) fetchData();
  }, [user, accessToken]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] p-10 shadow-xl dark:shadow-indigo-900/20 text-white relative overflow-hidden transition-all">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10">
            {loading ? (
              <div className="space-y-4 flex flex-col items-center">
                <Skeleton className="h-12 w-64 bg-white/20" />
                <Skeleton className="h-6 w-96 bg-white/20" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                  Here's what's happening with your job search today. Let's find
                  your next big opportunity! ✨
                </p>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading ? (
            <>
              <SkeletonStat />
              <SkeletonStat />
              <SkeletonStat />
              <SkeletonStat />
            </>
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-lg dark:shadow-none border-4 border-blue-50 dark:border-slate-800 p-6 hover:-translate-y-1 transition-all group">
                <div className="flex items-center">
                  <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors border-2 border-white dark:border-slate-700 shadow-inner">
                    <FaBriefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors">
                      Applied Jobs
                    </p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1 transition-colors">
                      {stats.appliedJobs}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-lg dark:shadow-none border-4 border-yellow-50 dark:border-slate-800 p-6 hover:-translate-y-1 transition-all group">
                <div className="flex items-center">
                  <div className="p-4 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors border-2 border-white dark:border-slate-700 shadow-inner">
                    <FaBookmark className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors">
                      Saved Jobs
                    </p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1 transition-colors">
                      {stats.savedJobs}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-lg dark:shadow-none border-4 border-green-50 dark:border-slate-800 p-6 hover:-translate-y-1 transition-all group">
                <div className="flex items-center">
                  <div className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors border-2 border-white dark:border-slate-700 shadow-inner">
                    <FaEye className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors">
                      Profile Views
                    </p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1 transition-colors">
                      {stats.profileViews}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-lg dark:shadow-none border-4 border-purple-50 dark:border-slate-800 p-6 hover:-translate-y-1 transition-all group">
                <div className="flex items-center">
                  <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors border-2 border-white dark:border-slate-700 shadow-inner">
                    <FaUsers className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide transition-colors">
                      Connections
                    </p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white mt-1 transition-colors">
                      {stats.connections}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Layout Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Recommended Jobs */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-xl dark:shadow-none border-4 border-indigo-50 dark:border-slate-800 p-8 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center transition-colors">
                  <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-2 rounded-xl mr-3 transition-colors">
                    🌟
                  </span>
                  Recommended for You
                </h2>
                <Link
                  to="/jobs/search"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800 transition-all"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-6">
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : (
                  recentJobs.map((job) => (
                    <div
                      key={job._id}
                      className="border-2 border-gray-100 dark:border-slate-800 rounded-3xl p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all group bg-gray-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/jobs/${job._id}`)
                      }
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-700 shadow-inner transition-colors">
                          <FaBriefcase className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-400 transition-colors">
                            {job.company?.companyName || "Confidential"}
                          </p>
                          <div className="flex flex-wrap items-center mt-2 gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">
                            <div className="flex items-center bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-md text-pink-700 dark:text-pink-400 transition-colors">
                              <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-md text-purple-700 dark:text-purple-400 transition-colors">
                              <FaClock className="h-3 w-3 mr-1" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/jobs/${job._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white font-black rounded-xl transition-colors whitespace-nowrap border border-indigo-100 dark:border-indigo-900/50 mx-auto sm:mx-0"
                      >
                        Apply Now
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Completion */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl dark:shadow-none border-4 border-blue-50 dark:border-slate-800 p-8 relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 dark:bg-blue-950 rounded-full mix-blend-multiply opacity-50 translate-x-10 -translate-y-10 filter blur-xl transition-colors"></div>

              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center transition-colors">
                <span className="bg-blue-100 dark:bg-blue-900/30 p-2 text-blue-700 dark:text-blue-300 rounded-lg mr-3 transition-colors">
                  📈
                </span>{" "}
                Profile Strength
              </h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 transition-colors">
                  <span>Profile Completion</span>
                  <span className="text-blue-700 dark:text-blue-400">75%</span>
                </div>
                <div className="w-full bg-blue-50 dark:bg-slate-800 rounded-full h-3 border border-blue-100 dark:border-slate-700 transition-colors">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-3 font-medium text-gray-700 dark:text-gray-300 transition-colors">
                <div className="flex items-center text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50 transition-colors">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 shadow-sm"></div>
                  <span>Basic info added</span>
                </div>
                <div className="flex items-center text-sm p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800/50 transition-colors">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3 shadow-sm"></div>
                  <span>Add work experience</span>
                </div>
                <div className="flex items-center text-sm p-2 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 transition-colors">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full mr-3 shadow-sm"></div>
                  <span>Upload resume</span>
                </div>
              </div>
              <Link
                to="/profile/edit"
                className="block w-full mt-6 px-4 py-3 border-2 border-blue-200 dark:border-blue-800 text-sm font-black rounded-xl text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-center transition-all active:scale-95"
              >
                COMPLETE PROFILE
              </Link>
            </div>

            {/* Job Alerts */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl dark:shadow-none border-4 border-pink-50 dark:border-slate-800 p-8 transition-colors">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center transition-colors">
                <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 p-2 rounded-lg mr-3 transition-colors">
                  🔔
                </span>{" "}
                Job Alerts
              </h3>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6 leading-relaxed transition-colors">
                Stay ahead of the competition! Get notified instantly about new
                jobs matching your preferences.
              </p>
              <Link
                to="/job-alerts"
                className="block w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md text-sm font-black rounded-xl hover:from-pink-600 hover:to-rose-600 text-center transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                SET UP ALERTS
              </Link>
            </div>

            {/* Career Tips */}
            <div className="bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[32px] shadow-xl dark:shadow-none border-4 border-purple-100 dark:border-slate-800 p-8 transition-colors">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center transition-colors">
                <span className="bg-purple-200 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 p-2 rounded-lg mr-3 transition-colors">
                  💡
                </span>{" "}
                Career Tips
              </h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-purple-50 dark:border-slate-700 shadow-sm transition-colors">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1 transition-colors">
                    Optimize Your Profile
                  </h4>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors">
                    Profiles with photos and complete history get 40% more
                    views!
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-purple-50 dark:border-slate-700 shadow-sm transition-colors">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1 transition-colors">
                    Network Actively
                  </h4>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors">
                    Connect with industry leaders to unlock hidden
                    opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
