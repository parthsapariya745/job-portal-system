import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaSearch,
  FaBriefcase,
  FaUsers,
} from "react-icons/fa";
import Skeleton, { SkeletonRow } from "../../components/Skeleton";

const ManageJobs = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJobs = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("/api/v1/jobs", {
        params: { userId: user._id, sort: "-createdAt", limit: 100 },
      });
      setJobs(Array.isArray(res.data?.jobs) ? res.data.jobs : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        };
        await axios.delete(`/api/v1/jobs/${jobId}`, config);
        toast.success("Job deleted successfully");
        setJobs(jobs.filter((job) => job._id !== jobId));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete job");
      }
    }
  };

  const filteredJobs = Array.isArray(jobs)
    ? jobs
        .filter(
          (job) =>
            (job?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (job?.location?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (job?.type?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (job?.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        )
        .filter((job) => statusFilter === "all" || (job?.status || "open") === statusFilter)
    : [];

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
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-10">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 dark:bg-blue-900/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
               Inventory Management
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white transition-colors tracking-tighter uppercase italic leading-none">
              Manage Jobs
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-bold transition-colors italic opacity-80">
              "Fine-tune your workforce requirements with precision."
            </p>
          </div>
          <Link
            to="/company/post-job"
            className="group relative flex items-center justify-center px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[30px] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all border-b-[6px] border-slate-700 dark:border-slate-200 overflow-hidden"
          >
            <FaPlus className="mr-3 text-lg group-hover:rotate-90 transition-transform duration-500" />
            Post New Job
          </Link>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[60px] p-8 border-2 border-white dark:border-slate-800 shadow-2xl overflow-hidden transition-colors">
          {/* Enhanced Toolbar */}
          <div className="p-6 md:p-10 bg-slate-50/50 dark:bg-slate-800/20 rounded-[45px] mb-10 flex flex-col lg:flex-row justify-between items-center gap-8 transition-colors border-2 border-slate-100 dark:border-white/5">
            <div className="flex flex-col md:flex-row gap-6 w-full lg:flex-1">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <FaSearch className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search listings..."
                  className="block w-full pl-14 pr-8 py-5 border-2 border-transparent bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-[25px] focus:outline-none focus:border-blue-500 transition-all font-bold placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-8 py-5 border-2 border-transparent bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-[25px] focus:outline-none focus:border-blue-500 transition-all font-black uppercase tracking-widest text-xs appearance-none cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 min-w-[200px]"
              >
                <option value="all">ALL STATUS</option>
                <option value="open">ACTIVE OPEN</option>
                <option value="closed">CLOSED</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 bg-white dark:bg-slate-800 px-6 py-3 rounded-full border border-slate-100 dark:border-white/5">
              REPORTING: <span className="text-slate-900 dark:text-white ml-2">{filteredJobs.length} NODES</span>
            </div>
          </div>

          {/* High-Fidelity Table/List */}
          <div className="overflow-x-auto px-2">
            <table className="min-w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                  <th className="px-8 pb-4 text-left">Opportunity Data</th>
                  <th className="px-8 pb-4 text-left">Status Radar</th>
                  <th className="px-8 pb-4 text-left">Telemetry</th>
                  <th className="px-8 pb-4 text-left">Timestamp</th>
                  <th className="px-8 pb-4 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="transition-colors">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5" className="px-8 py-6">
                        <SkeletonRow />
                      </td>
                    </tr>
                  ))
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="group bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-500 group"
                    >
                      <td className="px-8 py-8 first:rounded-l-[40px] border-y-2 first:border-l-2 border-slate-50 dark:border-white/5 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                        <div className="flex items-center">
                          <div className="w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <FaBriefcase className="text-xl text-white dark:text-slate-900" />
                          </div>
                          <div className="ml-6 flex flex-col gap-1">
                            <Link 
                              to={`/jobs/${job._id}`}
                              className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight italic"
                            >
                              {job.title}
                            </Link>
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic opacity-80">
                              {job.location} • {job.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 border-y-2 border-slate-50 dark:border-white/5 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                        <span
                          className={`px-5 py-2 inline-flex text-[10px] items-center gap-2 font-black rounded-full transition-all border-2 shadow-sm ${
                            job.status === "open"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${job.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {job.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-8 border-y-2 border-slate-50 dark:border-white/5 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                              <FaUsers className="text-blue-600 dark:text-blue-400" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{job.applicantsCount || 0}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scouts</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 border-y-2 border-slate-50 dark:border-white/5 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-8 last:rounded-r-[40px] border-y-2 last:border-r-2 border-slate-50 dark:border-white/5 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors">
                        <div className="flex items-center justify-end space-x-3">
                          <Link 
                            to={`/jobs/${job._id}`}
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-90 shadow-sm border border-slate-100 dark:border-white/5"
                            title="Intelligence Report"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/company/jobs/edit/${job._id}`}
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all active:scale-90 shadow-sm border border-slate-100 dark:border-white/5"
                            title="Recalibrate"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all active:scale-90 shadow-sm border border-slate-100 dark:border-white/5"
                            title="Decommission"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                   <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-24 text-center rounded-[50px] bg-slate-50/50 dark:bg-slate-800/20 border-4 border-dashed border-slate-200 dark:border-slate-800"
                    >
                      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <FaBriefcase className="text-3xl text-slate-300 dark:text-slate-600" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">No nodes active</h3>
                      <p className="text-slate-400 dark:text-slate-500 font-bold mb-8 uppercase tracking-widest">Initialize your company's hierarchy now</p>
                      <Link 
                         to="/company/post-job"
                         className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                      >
                         Post First Job
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
