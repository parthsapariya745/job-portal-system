import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaBookmark,
  FaRegBookmark,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaSearch,
  FaFilter,
  FaTrash,
} from "react-icons/fa";

const SavedJobs = () => {
  const { user } = useSelector((state) => state.auth);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Mock saved jobs data
  const mockSavedJobs = [
    {
      _id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      description:
        "We are looking for a skilled Frontend Developer to join our team...",
      requirements: ["React", "TypeScript", "Node.js"],
      savedDate: "2024-01-15",
      postedDate: "2024-01-10",
      applicants: 45,
      logo: null,
    },
  ];

  useEffect(() => {
    setSavedJobs(mockSavedJobs);
  }, []);

  const handleUnsaveJob = (jobId) => {
    setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
  };

  const handleApply = (jobId) => {
    console.log("Applying to job:", jobId);
  };

  const filteredJobs = savedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || job.type.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Keep track of jobs you are interested in and apply when you are
            ready
          </p>
        </div>

         <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-slate-800 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
               <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              />
            </div>
            <div className="flex items-center space-x-4">
               <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
               <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
                saved
              </span>
            </div>
          </div>
        </div>

         {filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-12 text-center border border-gray-200 dark:border-slate-800 transition-colors">
            <FaBookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filter !== "all"
                ? "No matching saved jobs"
                : "No saved jobs yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filters."
                : "Start saving jobs you are interested in to keep track of them here."}
            </p>
            <Link
              to="/jobs/search"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              <FaSearch className="mr-2" />
              Find Jobs
            </Link>
          </div>
        ) : (
           <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <FaBuilding className="h-6 w-6 text-blue-600" />
                        </div>
                         <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors">
                            {job.company}
                          </p>
                           <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400 space-x-4 transition-colors">
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <FaBriefcase className="h-3 w-3 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center">
                              <FaClock className="h-3 w-3 mr-1" />
                              Saved{" "}
                              {new Date(job.savedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUnsaveJob(job._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove from saved jobs"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <FaBookmark className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                     <div className="mt-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">
                        <div className="flex items-center">
                          <FaDollarSign className="h-3 w-3 mr-1" />
                          {job.salary}
                        </div>
                        <div>{job.applicants} applicants</div>
                        <div>
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3 transition-colors">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.map((req, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs rounded-full transition-colors"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                     <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Saved on {new Date(job.savedDate).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
                          View Details
                        </button>
                        <button
                          onClick={() => handleApply(job._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
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

export default SavedJobs;
