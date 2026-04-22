import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaBuilding,
  FaCheckCircle,
  FaBookmark,
  FaRegBookmark,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import Skeleton from "../components/Skeleton";
import { motion } from "framer-motion";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (user && user.role === "Job Seeker") {
      checkApplicationStatus();
      checkSavedStatus();
      if (user.profile?.resume) {
        setResumeUrl(user.profile.resume);
      }
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`/api/v1/jobs/${id}`);
      setJob(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch job details");
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const res = await axios.get("/api/v1/applications/my", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Check if any application matches current job ID
      const applied = res.data.data.applications.some(
        (app) => app.job._id === id || app.job === id,
      );
      setHasApplied(applied);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const checkSavedStatus = async () => {
    try {
      const res = await axios.get("/api/v1/users/saved-jobs", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const savedList = res.data?.data?.savedJobs || res.data?.data || [];
      const saved = Array.isArray(savedList)
        ? savedList.some((s) => (s._id || s)?.toString?.() === id)
        : false;
      setIsSaved(saved);
    } catch (error) {
      console.error("Error checking saved status", error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeUrl) {
      toast.error("Please provide a resume URL or upload one in your profile.");
      return;
    }

    setApplying(true);
    try {
      await axios.post(
        "/api/v1/applications",
        { jobId: id, resume: resumeUrl },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      toast.success("Application submitted successfully!");
      setHasApplied(true);
      setShowApplyModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.info("Please login to save jobs");
      return;
    }

    try {
      if (isSaved) {
        await axios.delete(`/api/v1/users/saved-jobs/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsSaved(false);
        toast.info("Job removed from saved list");
      } else {
        await axios.post(
          `/api/v1/users/saved-jobs/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        setIsSaved(true);
        toast.success("Job saved successfully");
      }
    } catch (error) {
      toast.error("Failed to update saved status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-24" />
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-8 space-y-4 border-b border-gray-100 dark:border-slate-800">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

   if (!job) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Not Found</h2>
          <Link to="/jobs" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 block">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 dark:opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 dark:opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5"
        >
          <FaArrowLeft className="mr-2" /> Back to Jobs
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white dark:border-slate-800 overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 relative z-10 bg-gradient-to-br from-indigo-50/50 dark:from-indigo-900/20 to-white dark:to-slate-900">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-5 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-blue-200 dark:border-blue-800 shadow-sm transition-colors">
                    {job.type}
                  </span>
                  {job.isFeatured && (
                    <span className="px-5 py-2 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-yellow-200 dark:border-yellow-800 flex items-center shadow-sm transition-colors">
                      ✨ Featured
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight uppercase drop-shadow-sm">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-lg mb-6">
                  <div className="flex items-center text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50">
                    <FaBuilding className="mr-2 text-indigo-500" />
                    {job.company?.name || job.companyName}
                  </div>
                  <div className="flex items-center text-pink-700 dark:text-pink-300 font-bold bg-pink-50 dark:bg-pink-900/30 px-4 py-2 rounded-2xl border-2 border-pink-100 dark:border-pink-900/50">
                    <FaMapMarkerAlt className="mr-2 text-pink-500" />
                    {job.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm font-black text-slate-500 dark:text-slate-400">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
                    <FaBriefcase className="mr-2 text-slate-400" />
                    Level: {job.level}
                  </div>
                  <div className="flex items-center bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-5 py-2.5 rounded-2xl border border-green-200 dark:border-green-800 transition-colors text-base">
                    <FaMoneyBillWave className="mr-2 text-green-500" />
                    {job.salary?.min
                      ? `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()}`
                      : "Salary to be discussed"}
                  </div>
                  <div className="flex items-center bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-5 py-2.5 rounded-2xl border border-purple-200 dark:border-purple-800 transition-colors">
                    <FaClock className="mr-2 text-purple-500" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 min-w-[200px] w-full md:w-auto mt-6 md:mt-0">
                {user?.role === "Job Seeker" && (
                  <>
                    <button
                      onClick={() => !hasApplied && setShowApplyModal(true)}
                      disabled={hasApplied}
                      className={`w-full py-4 px-8 rounded-2xl font-black text-lg transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                        hasApplied
                          ? "bg-green-100 text-green-700 border-2 border-green-200 shadow-none cursor-default hover:-translate-y-0"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border-b-4 border-indigo-800"
                      }`}
                    >
                      {hasApplied ? (
                        <>
                          <FaCheckCircle className="mr-2 text-xl" /> APPLIED
                        </>
                      ) : (
                        <>
                          APPLY NOW <FaPaperPlane className="ml-2" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSave}
                      className={`w-full py-4 px-8 rounded-2xl font-black text-lg border-2 flex items-center justify-center transition-all hover:-translate-y-1 shadow-sm hover:shadow-md ${
                        isSaved
                          ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-900/50"
                          : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {isSaved ? (
                        <FaBookmark className="mr-2 text-xl" />
                      ) : (
                        <FaRegBookmark className="mr-2 text-xl" />
                      )}
                      {isSaved ? "SAVED" : "SAVE FOR LATER"}
                    </button>
                  </>
                )}

                {!user && (
                  <Link
                    to="/login"
                    className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 text-center border-b-4 border-indigo-800"
                  >
                    LOGIN TO APPLY ✨
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-10">
              <section className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-[32px] border-2 border-blue-50 dark:border-blue-900/30 shadow-sm">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100 p-2 rounded-xl mr-3 h-10 w-10 flex items-center justify-center">📄</span> Job Description
                </h3>
                <div className="prose prose-lg text-gray-700 dark:text-gray-300 whitespace-pre-line font-medium leading-relaxed">
                  {job.description}
                </div>
              </section>

              <section className="bg-indigo-50/30 dark:bg-indigo-900/10 p-8 rounded-[40px] border-2 border-indigo-100/50 dark:border-indigo-900/30 shadow-sm transition-colors">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center">
                  <span className="bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 p-2 rounded-2xl mr-4 h-12 w-12 flex items-center justify-center shadow-sm">🎯</span> Requirements
                </h3>
                <div className="bg-white/50 dark:bg-slate-900/50 p-8 rounded-3xl border-2 border-indigo-100 dark:border-indigo-900/50 shadow-inner">
                  <ul className="list-disc list-inside space-y-4 text-slate-700 dark:text-slate-300 font-bold text-lg leading-relaxed transition-colors">
                    {Array.isArray(job.requirements)
                      ? job.requirements.map((req, i) => <li key={i} className="pl-2">{req}</li>)
                      : job.requirements
                          ?.split(",")
                          .map((req, i) => <li key={i} className="pl-2">{req.trim()}</li>)}
                  </ul>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-pink-50 dark:from-pink-900/20 to-orange-50 dark:to-orange-900/20 p-8 rounded-[32px] border-4 border-white dark:border-slate-800 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 dark:bg-pink-900/40 rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200 dark:bg-orange-900/40 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-x-10 translate-y-10"></div>
                
                <h4 className="font-black text-xl text-gray-900 dark:text-white mb-6 flex items-center relative z-10">
                  <span className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm mr-3">🏢</span> About Company
                </h4>
                
                {job.company?.logo && (
                  <div className="mb-6 relative z-10 flex justify-center bg-white dark:bg-slate-800 p-4 rounded-3xl border-2 border-pink-100 dark:border-pink-900/50 shadow-inner">
                    <img
                      src={job.company.logo}
                      alt="Company Logo"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                )}
                <p className="text-gray-700 dark:text-gray-300 text-base font-medium mb-6 relative z-10 leading-relaxed">
                  {job.company?.description ||
                    "No company description available at this moment. You can visit their website for more details."}
                </p>
                {job.company?.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full py-3 bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 font-bold border-2 border-pink-200 dark:border-pink-900/50 rounded-2xl hover:bg-pink-50 dark:hover:bg-slate-800 hover:border-pink-300 dark:hover:border-pink-700 transition-colors shadow-sm relative z-10"
                  >
                    Visit Website 🌐
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl max-w-md w-full p-8 border-4 border-indigo-100 dark:border-indigo-900/50 animate-fade-in-up">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase">
              Apply for {job.title}
            </h3>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-8">
              at {job.company?.name || job.companyName}
            </p>

            <form onSubmit={handleApply}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Resume URL Link 🔗
                </label>
                <input
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://docs.google.com/..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-0 focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors text-lg font-medium text-gray-900 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  Provide a public link to your CV/Resume (Google Drive, LinkedIn profile, etc.)
                </p>
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center border-b-4 border-indigo-800"
                >
                  {applying ? (
                    <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
                  ) : null}
                  {applying ? "SENDING..." : "SUBMIT APPLICATION 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
