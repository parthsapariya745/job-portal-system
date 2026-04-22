import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Skeleton, { SkeletonRow } from "../../components/Skeleton";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/v1/applications/my", {
          withCredentials: true,
        });
        setApplications(res.data.data.applications || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="flex items-center px-4 py-2 rounded-full text-sm font-black bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-800/50 shadow-sm uppercase tracking-wide transition-colors">
            <FaCheckCircle className="mr-2 text-lg" /> Accepted
          </span>
        );
      case "interview":
        return (
          <span className="flex items-center px-4 py-2 rounded-full text-sm font-black bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800/50 shadow-sm uppercase tracking-wide transition-colors">
            <FaCalendarAlt className="mr-2 text-lg" /> Interview
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center px-4 py-2 rounded-full text-sm font-black bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-800/50 shadow-sm uppercase tracking-wide transition-colors">
            <FaTimesCircle className="mr-2 text-lg" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center px-4 py-2 rounded-full text-sm font-black bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-2 border-yellow-200 dark:border-yellow-800/50 shadow-sm uppercase tracking-wide transition-colors">
            <FaClock className="mr-2 text-lg" /> {status?.toUpperCase() || 'PENDING'}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
       <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-10 flex items-center justify-center md:justify-start drop-shadow-sm uppercase transition-colors">
          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-2xl mr-4 shadow-sm transition-colors">🚀</span> 
          My Applications
        </h1>

         {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border-4 border-indigo-50 dark:border-slate-800 p-8 space-y-6 transition-colors">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
         ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border-4 border-indigo-50 dark:border-slate-800 p-12 text-center relative overflow-hidden transition-colors">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-24 w-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-400 dark:text-indigo-300 rounded-full flex items-center justify-center mb-6 shadow-inner transition-colors">
                <FaBriefcase className="h-10 w-10" />
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-bold mb-8 max-w-md mx-auto transition-colors">
                You haven't applied to any jobs yet. Let's find your dream job today! ✨
              </p>
              <Link 
                to="/jobs/search" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 hover:from-blue-700 hover:to-indigo-700 transition-all border-b-4 border-indigo-800 dark:border-indigo-950"
              >
                FIND JOBS NOW
              </Link>
            </div>
          </div>
        ) : (
           <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <div 
                key={app._id} 
                className="bg-white dark:bg-slate-900 rounded-[32px] shadow-lg border-4 border-indigo-50 dark:border-slate-800 p-6 sm:p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-600 shadow-inner mr-5 transition-colors">
                      <FaBriefcase className="h-8 w-8 text-indigo-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase leading-tight transition-colors"
                      >
                        {app.job?.title || "Unknown Job"}
                      </Link>
                      <p className="text-sm font-bold text-indigo-500 dark:text-indigo-400 mt-1 uppercase tracking-wide transition-colors">
                        {app.company?.name || "Confidential Company"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                    {getStatusBadge(app.status)}
                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
