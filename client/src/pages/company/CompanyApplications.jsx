import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUsers, FaSearch } from "react-icons/fa";
import Skeleton, { SkeletonRow } from "../../components/Skeleton";

const CompanyApplications = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/api/v1/applications/company", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setApplications(res.data.data.applications || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch applications");
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.patch(
        `/api/v1/applications/${applicationId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400";
      case "interview":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400";
      case "accepted":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400";
      case "hired":
        return "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-400";
      default:
        return "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-300";
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    // Search by candidate name or job title
    const candidateName = app.applicant?.name || "";
    const jobTitle = app.job?.title || "";
    const matchesSearch =
      candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    interview: applications.filter((app) => app.status === "interview").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors mb-6">
             <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
             Talent Intelligence
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white transition-colors tracking-tighter uppercase italic leading-none mb-4">
            Applications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl font-bold transition-colors italic opacity-80 max-w-2xl leading-relaxed">
            "Every card is a future project leader. Choose with purpose."
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[50px] p-8 md:p-10 border-2 border-white dark:border-slate-800 shadow-2xl mb-12 transition-all group">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="relative flex-1 w-full group/inner">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <FaSearch className="text-slate-400 group-focus-within/inner:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Scan by candidate or role..."
                className="block w-full pl-14 pr-8 py-5 border-2 border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-[25px] focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide">
              {["all", "pending", "interview", "accepted", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-6 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                    statusFilter === status
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20 scale-105 active:scale-95"
                      : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {status} <span className="ml-2 px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded-lg">{statusCounts[status]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications Stream */}
        <div className="space-y-8 pb-20">
          {loading ? (
             [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-white/5 rounded-[40px] p-10 border-2 border-white dark:border-slate-800 space-y-6 animate-pulse">
                <div className="flex gap-6">
                   <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-[25px]"></div>
                   <div className="space-y-3 flex-1">
                      <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                      <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                   </div>
                </div>
              </div>
            ))
          ) : filteredApplications.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[60px] border-4 border-dashed border-slate-200 dark:border-slate-800 p-24 text-center transition-colors">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <FaUsers className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">
                No signal detected
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mb-10">
                Adjust your filters or initiate a new campaign
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application._id}
                className="group relative bg-white dark:bg-slate-900 rounded-[50px] p-8 md:p-10 border-2 border-white dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-start lg:items-center gap-8">
                    <div className="w-24 h-24 bg-slate-900 dark:bg-white rounded-[30px] flex items-center justify-center shadow-2xl group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
                      <span className="text-4xl font-black text-white dark:text-slate-900 uppercase">
                        {(application.applicant?.name || "U").charAt(0)}
                      </span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                          {application.applicant?.name || "Candidate Alpha"}
                        </h3>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 ${getStatusColor(application.status)} transition-colors`}>
                           {application.status}
                        </span>
                      </div>
                      <p className="text-indigo-600 dark:text-indigo-400 font-black text-lg uppercase italic tracking-tight transition-colors">
                        {application.job?.title || "Role Undefined"}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-2">
                         <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                         <span className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                         <span>ID: {application._id.slice(-8)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-5">
                    {application.resume && (
                      <a
                        href={`/${application.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border-b-4 border-slate-700 dark:border-slate-200 hover:scale-105 active:scale-95 transition-all text-center shadow-xl"
                      >
                        Source PDF 📄
                      </a>
                    )}

                    <div className="flex gap-3 w-full md:w-auto">
                      {application.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application._id, "interview")}
                            className="flex-1 md:flex-none px-6 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 active:scale-90 transition-all shadow-lg"
                          >
                            Recruit (Interview)
                          </button>
                          <button
                            onClick={() => handleStatusChange(application._id, "rejected")}
                            className="flex-1 md:flex-none px-6 py-4 bg-white dark:bg-slate-800 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 active:scale-90 transition-all shadow-sm"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {application.status === "interview" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application._id, "accepted")}
                            className="flex-1 md:flex-none px-6 py-4 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 active:scale-90 transition-all shadow-lg"
                          >
                            Finalize Hire
                          </button>
                          <button
                            onClick={() => handleStatusChange(application._id, "rejected")}
                            className="flex-1 md:flex-none px-6 py-4 bg-white dark:bg-slate-800 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10 active:scale-90 transition-all shadow-sm"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bottom Bar Decorations */}
                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-between opacity-50">
                    <div className="flex gap-2">
                       {[...Array(5)].map((_, i) => <div key={i} className="w-8 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tactical Asset Registry</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyApplications;
