import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { calculateCompanyProfileCompletion } from "../../utils/profileUtils";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaBriefcase,
  FaUsers,
  FaEye,
  FaChartLine,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import Skeleton, { SkeletonStat, SkeletonRow } from "../../components/Skeleton";

const CompanyDashboard = ({ role = "Company" }) => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    hiredCandidates: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [activeListings, setActiveListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      // Fetch Jobs
      const jobsRes = await axios.get(
        `/api/v1/jobs?userId=${user._id}&sort=-createdAt`,
      );
      const jobs = jobsRes.data.jobs || [];

      // Fetch Applications
      const appsRes = await axios.get(
        "/api/v1/applications/company",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const applications = appsRes.data.data?.applications || [];

      // Calculate Stats
      const activeJobsCount = jobs.filter(
        (job) => job.status === "open",
      ).length;
      const totalAppsCount = applications.length;
      const employedAppsCount = applications.filter(
        (app) => app.status === "accepted" || app.status === "hired",
      ).length; // Assuming status values
      // Mock "New" applications key or logic (e.g. created in last 24h)
      // For now, let's say "pending" is "new"
      const newAppsCount = applications.filter(
        (app) => app.status === "pending",
      ).length;

      setStats({
        activeJobs: activeJobsCount,
        totalApplications: totalAppsCount,
        newApplications: newAppsCount,
        hiredCandidates: employedAppsCount,
      });

      setRecentApplications(applications.slice(0, 5));
      setActiveListings(
        jobs.filter((job) => job.status === "open").slice(0, 3),
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 font-noto transition-colors duration-300 overflow-hidden relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700;900&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap');
        .font-noto { font-family: 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'Noto Sans', sans-serif; }
      `,
        }}
      />
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className="mb-16">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-16 w-3/4 rounded-3xl" />
              <Skeleton className="h-8 w-1/2 rounded-2xl" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors">
                   <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                   {role === "HR" ? "RECRUITER ACCESS" : "CORPORATE COMMAND"}
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white transition-colors tracking-tighter uppercase italic leading-none">
                  Hello, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl font-bold transition-colors italic opacity-80 max-w-2xl leading-relaxed">
                  "Ready to architect your next dream team? Your command center is live."
                </p>
              </div>
              <Link
                to="/company/post-job"
                className="group relative flex items-center justify-center px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[35px] font-black uppercase tracking-widest text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all border-b-[8px] border-slate-700 dark:border-slate-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <FaPlus className="mr-4 text-2xl group-hover:rotate-90 transition-transform duration-500" /> 
                <span>Post New Job</span>
              </Link>
            </div>
          )}
        </div>

        {/* High-Fidelity Stats Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[60px] p-10 border-2 border-white dark:border-slate-800 shadow-2xl dark:shadow-none mb-16 transition-colors group">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Active Jobs", value: stats.activeJobs, icon: FaBriefcase, color: "blue", trend: "+2 this week" },
              { label: "Applications", value: stats.totalApplications, icon: FaUsers, color: "green", trend: "12 new candidates" },
              { label: "Pending", value: stats.newApplications, icon: FaEye, color: "orange", trend: "needs review" },
              { label: "Success Rate", value: `${stats.totalApplications > 0 ? Math.round((stats.hiredCandidates / stats.totalApplications) * 100) : 0}%`, icon: FaChartLine, color: "purple", trend: "top 5% of portal" }
            ].map((stat, idx) => (
              <div key={idx} className="relative group/stat">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4 transition-colors">
                    {stat.label}
                  </span>
                  <div className="flex items-end gap-4">
                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">
                      {stat.value}
                    </span>
                    <div className={`mb-2 p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl group-hover/stat:rotate-12 transition-transform duration-500`}>
                      <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                  </div>
                  <span className={`text-[10px] font-black mt-2 text-${stat.color}-600 dark:text-${stat.color}-400/70 opacity-0 group-hover/stat:opacity-100 transition-opacity uppercase tracking-widest`}>
                     {stat.trend}
                  </span>
                </div>
                {idx < 3 && <div className="absolute -right-6 top-1/4 bottom-1/4 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Stage */}
          <div className="lg:col-span-2 space-y-12">
            {/* Mission Control / Quick Actions */}
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[60px] p-10 md:p-12 border-2 border-white dark:border-slate-800 transition-all hover:bg-white/70 dark:hover:bg-slate-900/70 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>
              
              <div className="flex items-center gap-4 mb-10">
                 <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-200 dark:to-slate-800"></div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors uppercase italic tracking-tighter px-4">
                  Command Center
                </h2>
                <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-200 dark:to-slate-800"></div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { to: "/company/post-job", icon: FaPlus, color: "blue", label: "Build Job" },
                  { to: "/company/applications", icon: FaUsers, color: "green", label: "Talent Pool" },
                  { to: "/company/jobs", icon: FaBriefcase, color: "purple", label: "Inventory" },
                  { to: "/company/analytics", icon: FaChartLine, color: "orange", label: "Performance" },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.to}
                    className="flex flex-col items-center justify-center p-8 rounded-[40px] bg-white dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 active:scale-95 transition-all group/card"
                  >
                    <div className={`p-5 rounded-[25px] bg-${action.color}-50 dark:bg-${action.color}-900/30 text-${action.color}-600 dark:text-${action.color}-400 mb-6 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 relative`}>
                      <action.icon className="h-8 w-8 relative z-10" />
                      <div className={`absolute inset-0 bg-${action.color}-400/20 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity`}></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors text-center">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Premium Recent Applicants */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[60px] p-12 border-2 border-white dark:border-slate-800 shadow-2xl transition-all relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none group-hover:bg-green-500/10 transition-colors duration-1000"></div>
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white transition-colors tracking-tighter uppercase italic">
                  Candidate Pipeline
                </h2>
                <Link
                  to="/company/applications"
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                >
                  Explore Pool
                </Link>
              </div>

              {loading ? (
                <div className="space-y-6">
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/30 rounded-[50px] border-4 border-dashed border-slate-200 dark:border-slate-700 relative z-10 group/empty">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl group-hover/empty:scale-110 group-hover/empty:rotate-12 transition-all duration-500">
                    <FaUsers className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-8">No scouts reported yet</p>
                  <Link
                    to="/company/post-job"
                    className="inline-flex items-center px-10 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                  >
                    Initiate First Listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  {recentApplications.map((application) => (
                    <div
                      key={application._id}
                      className="flex items-center justify-between p-7 bg-white/50 dark:bg-slate-800/30 border-2 border-slate-50 dark:border-slate-700 rounded-[40px] hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-2xl transition-all duration-500 group/row"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-[25px] flex items-center justify-center transition-all shadow-xl group-hover/row:-translate-x-2 group-hover/row:-rotate-6">
                          <span className="text-2xl font-black text-white dark:text-slate-900 uppercase">
                            {(application.applicant?.name || "U").charAt(0)}
                          </span>
                        </div>
                        <div className="ml-6">
                          <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors tracking-tight leading-none mb-2">
                            {application.applicant?.name || "Unknown Candidate"}
                          </h3>
                          <div className="flex items-center gap-3">
                             <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                               {application.job?.title || "Project Alpha"}
                            </span>
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Received: {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span
                          className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border-2 transition-all ${
                            application.status === "accepted" || application.status === "hired"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                              : application.status === "rejected"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          {application.status}
                        </span>
                         <Link to={`/company/applications/${application._id}`} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-90 shadow-sm">
                            <FaEye className="text-xl" />
                         </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Control Panel */}
          <div className="space-y-12">
            {/* Status Radar */}
            <div className="bg-slate-900 dark:bg-slate-950 rounded-[50px] p-10 border-b-[16px] border-slate-800 shadow-2xl relative overflow-hidden group/side">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover/side:bg-indigo-500/20 transition-colors duration-1000"></div>
              
              <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter relative z-10 flex items-center gap-4">
                 Radar Status
                 <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                 </span>
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 relative z-10">
                Pipeline distribution
              </p>
              
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center group/item">
                  <span className="text-sm font-black uppercase tracking-widest text-slate-400">Incoming Feed</span>
                  <span className="text-2xl font-black text-white bg-white/5 px-4 py-2 rounded-2xl transition-all group-hover/item:bg-white/10">
                    {stats.newApplications}
                  </span>
                </div>
                <div className="flex justify-between items-center group/item">
                  <span className="text-sm font-black uppercase tracking-widest text-green-400/70">Successful Hires</span>
                  <span className="text-2xl font-black text-green-400 bg-green-500/10 px-4 py-2 rounded-2xl transition-all group-hover/item:bg-green-500/20">
                    {stats.hiredCandidates}
                  </span>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Aggregate throughput</span>
                  <span className="text-xl font-black text-white/50 italic">
                    {stats.totalApplications}
                  </span>
                </div>
              </div>

              <Link
                to="/company/applications"
                className="group relative block w-full mt-12 py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-[30px] shadow-2xl hover:bg-indigo-500 text-center transition-all overflow-hidden"
              >
                 <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                 Full Ops Report 📊
              </Link>
            </div>

            {/* Profile Health HUD */}
            <div className="bg-indigo-700 rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden group/hud">
              <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-indigo-500/50 to-transparent pointer-events-none"></div>
              <h3 className="text-2xl font-black mb-8 uppercase italic tracking-tighter relative z-10">
                Corporate Identity
              </h3>
              <div className="mb-10 relative z-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-indigo-100">
                  <span>Profile Integrity</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">{calculateCompanyProfileCompletion(user)}%</span>
                </div>
                <div className="w-full bg-slate-950/40 rounded-full h-4 backdrop-blur-lg overflow-hidden border border-white/10">
                  <div
                    style={{ width: `${calculateCompanyProfileCompletion(user)}%` }}
                    className="bg-white h-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all duration-1000 ease-out relative"
                  >
                     <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
              <Link
                to="/company/profile"
                className="block w-full py-5 bg-white text-indigo-700 font-black text-[10px] font-black uppercase tracking-[0.4em] rounded-[30px] hover:bg-indigo-50 text-center transition-all active:scale-95 shadow-2xl hover:-rotate-2 duration-500"
              >
                Refine Brand ✨
              </Link>
            </div>

            {/* Premium Upsell HUD */}
            <div className="bg-linear-to-br from-slate-900 to-indigo-950 rounded-[50px] p-10 text-white relative overflow-hidden group/premium border-t-8 border-indigo-500/30">
               <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
              <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter relative z-10">Ascend to Elite</h3>
              <p className="text-sm font-bold text-slate-300 mb-10 leading-relaxed italic relative z-10 opacity-70">
                "Deploy AI-driven predictive hiring models and reach 5x more top-tier talent instantly."
              </p>
              <Link
                to="/company/billing"
                className="block w-full py-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[30px] hover:bg-white hover:text-slate-900 text-center transition-all active:scale-95 relative z-10 duration-500"
              >
                Unlock Universe 🚀
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
