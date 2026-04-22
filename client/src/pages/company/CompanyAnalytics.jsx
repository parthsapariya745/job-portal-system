import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaChartBar,
  FaUsers,
  FaBriefcase,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts/es6";
import Skeleton, { SkeletonStat } from "../../components/Skeleton";

const CompanyAnalytics = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    avgApplicationsPerJob: 0,
  });
  const [applicationStatusData, setApplicationStatusData] = useState([]);
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnalytics = async () => {
    try {
      // Parallel fetching
      const [jobsRes, appsRes] = await Promise.all([
        axios.get(`/api/v1/jobs?userId=${user._id}`),
        axios.get("/api/v1/applications/company", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);

      const jobs = jobsRes.data.jobs || [];
      const applications = appsRes.data.data?.applications || [];

      // Calculate Stats
      const totalJobs = jobs.length;
      const activeJobs = jobs.filter((job) => job.status === "open").length;
      const totalApplications = applications.length;
      const avgApplicationsPerJob =
        totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0;

      setStats({
        totalJobs,
        totalApplications,
        activeJobs,
        avgApplicationsPerJob,
      });

      // Process Data for Charts
      // 1. Application Status Distribution
      const statusCounts = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      const statusData = Object.keys(statusCounts).map((status) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: statusCounts[status],
      }));

      // Ensure we have data even if empty for chart rendering
      if (statusData.length === 0) {
        statusData.push({ name: "No Data", value: 0 });
      }

      setApplicationStatusData(statusData);

      // 2. Applications Over Time (Last 7 days mock or real if timestamps available)
      // Real implementation: Group by createdAt date
      const last7Days = [...Array(7)]
        .map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split("T")[0];
        })
        .reverse();

      const timeData = last7Days.map((date) => {
        const count = applications.filter((app) =>
          app.createdAt.startsWith(date)
        ).length;
        return {
          name: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          applications: count,
        };
      });

      setApplicationsOverTime(timeData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch analytics data");
      setLoading(false);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="h-80 w-full flex items-end space-x-2">
                <Skeleton className="h-1/4 flex-1" />
                <Skeleton className="h-1/2 flex-1" />
                <Skeleton className="h-3/4 flex-1" />
                <Skeleton className="h-1/3 flex-1" />
                <Skeleton className="h-2/3 flex-1" />
                <Skeleton className="h-full flex-1" />
                <Skeleton className="h-1/2 flex-1" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="h-80 w-full flex items-center justify-center">
                <Skeleton className="h-64 w-64 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className="mb-16">
           <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors mb-6">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             Strategic Overview
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white transition-colors tracking-tighter uppercase italic leading-none mb-4">
            Analytics Node
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl font-bold transition-colors italic opacity-80 max-w-2xl leading-relaxed">
            "Data is velocity. Track your hiring acceleration with high-fidelity telemetry."
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: "Total Jobs", value: stats.totalJobs, trend: `${stats.activeJobs} Active`, icon: FaBriefcase, color: "blue" },
            { label: "Applications", value: stats.totalApplications, trend: "Aggregated feed", icon: FaUsers, color: "indigo" },
            { label: "Efficiency", value: stats.avgApplicationsPerJob, trend: "Apps per job", icon: FaChartBar, color: "green" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[40px] shadow-2xl dark:shadow-none p-10 border-2 border-white dark:border-slate-800 transition-all hover:-translate-y-2 group">
              <div className="flex items-center justify-between mb-8">
                 <div className={`p-5 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-[25px] transition-colors group-hover:rotate-12 duration-500`}>
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 transition-colors">
                  {stat.label}
                </p>
                <p className="text-5xl font-black text-slate-900 dark:text-white transition-colors tracking-tight">
                  {stat.value}
                </p>
                </div>
              </div>
              <div className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400">
                 <span className={`w-2 h-2 rounded-full bg-${stat.color}-500 mr-3 animate-pulse`}></span>
                 {stat.trend}
              </div>
            </div>
          ))}

          <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group/elite">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-1000"></div>
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Pipeline Health</p>
                <p className="text-5xl font-black tracking-tight mb-2">94.8%</p>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-6 mb-8">
                   <div className="bg-white h-full w-[94.8%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                </div>
             </div>
             <button className="relative z-10 w-full py-5 bg-white/10 hover:bg-white text-white hover:text-indigo-600 backdrop-blur-md rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 duration-500">
                Transmit Full PDF Report
             </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Applications Over Time */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-12 rounded-[50px] shadow-2xl dark:shadow-none border-2 border-white dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 relative group/chart">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover/chart:bg-blue-500/20 transition-colors"></div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-12 uppercase italic tracking-tighter flex items-center gap-4 transition-colors">
               Feed Velocity
               <span className="text-[10px] font-black not-italic tracking-[0.3em] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase">Visual Feed</span>
            </h3>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationsOverTime}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 900, fontSize: 10, letterSpacing: '0.1em'}} dy={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 900, fontSize: 10}} />
                  <Tooltip
                    cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: "25px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: '20px',
                      color: '#fff',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#818CF8', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.2em' }}
                    labelStyle={{ color: '#fff', fontWeight: 900, marginBottom: '10px', fontSize: '12px' }}
                  />
                  <Bar
                    dataKey="applications"
                    fill="url(#indigoGradient)"
                    radius={[15, 15, 0, 0]}
                    barSize={40}
                  />
                  <defs>
                    <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Application Status Distribution */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-12 rounded-[50px] shadow-2xl dark:shadow-none border-2 border-white dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 relative group/chart2">
             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover/chart2:bg-indigo-500/20 transition-colors"></div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-12 uppercase italic tracking-tighter flex items-center gap-4 transition-colors">
               Pipeline Radar
               <span className="text-[10px] font-black not-italic tracking-[0.3em] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase">Distribution</span>
            </h3>
            <div className="h-96 w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                    {applicationStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'No Data' ? '#334155' : COLORS[index % COLORS.length]}
                        className="hover:scale-105 transition-transform duration-500 origin-center cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: "25px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: '20px',
                      color: '#fff',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    height={36}
                    iconType="rect"
                    iconSize={12}
                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mx-4 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
