import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaBookmark,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Skeleton, { SkeletonRow } from "../../components/Skeleton";

const SavedJobs = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("/api/v1/users/saved-jobs", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      setJobs(res.data?.data?.savedJobs || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchSavedJobs();
    else setLoading(false);
  }, [accessToken]);

  const handleUnsave = async (jobId) => {
    try {
      await axios.delete(`/api/v1/users/saved-jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      toast.success("Job removed from saved list");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
       <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors">
          <FaBookmark className="mr-2 text-blue-600 dark:text-blue-400" /> Saved Jobs
        </h1>

        {loading ? (
          <div className="space-y-4">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
         ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-800 p-8 text-center transition-colors">
            <FaBookmark className="h-12 w-12 text-gray-300 dark:text-slate-700 mx-auto mb-4 transition-colors" />
            <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
              You haven't saved any jobs yet.
            </p>
            <Link to="/jobs" className="inline-flex px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-800 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex">
                     <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center transition-colors">
                      <FaBriefcase className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <div className="ml-4">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 transition-colors">
                        {job.company?.name || job.companyName}
                      </p>
                       <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400 space-x-4 transition-colors">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="h-3 w-3 mr-1 text-pink-500" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="h-3 w-3 mr-1 text-indigo-500" />
                          Saved: {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnsave(job._id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Remove from saved"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
