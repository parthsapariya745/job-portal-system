import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { checkAuth } from "../../redux/slices/authSlice";
import {
  FaUserEdit,
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaCamera,
} from "react-icons/fa";
import Skeleton, { SkeletonRow } from "../../components/Skeleton";

const Profile = () => {
  const { user, isLoading, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAvatarUpload = async (file) => {
    // 25MB limit check
    if (file.size > 25 * 1024 * 1024) {
      return toast.error("File is too large! Max limit is 25MB.");
    }
    const formPayload = new FormData();
    formPayload.append("avatar", file);
    try {
      await axios.post("/api/v1/users/profile/avatar", formPayload, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true,
      });
      toast.success("Profile picture updated!");
      dispatch(checkAuth());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image.");
    }
  };

  const handleCoverUpload = async (file) => {
    // 25MB limit check
    if (file.size > 25 * 1024 * 1024) {
      return toast.error("File is too large! Max limit is 25MB.");
    }
    const formPayload = new FormData();
    formPayload.append("cover", file);
    try {
      await axios.post("/api/v1/users/profile/cover", formPayload, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true,
      });
      toast.success("Cover background updated!");
      dispatch(checkAuth());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload cover image.");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none rounded-lg overflow-hidden border dark:border-slate-800 transition-colors">
            <Skeleton className="h-32 w-full rounded-none" />
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="-mt-16 mb-4 sm:mb-0">
                  <Skeleton className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-800" />
                </div>
                <div className="flex-1 text-center sm:text-left sm:pl-6 mt-4 sm:mt-0 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none rounded-lg p-6 space-y-4 border dark:border-slate-800 transition-colors">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none rounded-lg p-6 space-y-4 border dark:border-slate-800 transition-colors">
              <Skeleton className="h-6 w-32" />
              <SkeletonRow />
               <SkeletonRow />
            </div>
            <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none rounded-lg p-6 space-y-4 border dark:border-slate-800 transition-colors">
              <Skeleton className="h-6 w-32" />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { name, email, phoneNumber, avatar, coverImage, profile } = user;
  const { bio, location, website, skills, experience, education, resume } =
    profile || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
       <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none rounded-lg border dark:border-slate-800 overflow-hidden transition-colors">
          <div className="relative group h-32 sm:h-48 overflow-hidden bg-gray-200 dark:bg-slate-800">
            <img
              src={coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80"}
              alt="Cover"
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
            />
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <label className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-white transition-colors">
                 <FaCamera />
                 <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleCoverUpload(e.target.files[0])} />
               </label>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="-mt-16 sm:-mt-20 mb-4 sm:mb-0 relative group">
                <img
                  src={
                    avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                   }
                  alt={name}
                  className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-800 object-cover group-hover:opacity-80 transition-all"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                   <FaCamera className="text-white text-2xl" />
                   <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleAvatarUpload(e.target.files[0])} />
                </label>
              </div>
              <div className="flex-1 text-center sm:text-left sm:pl-6 mt-4 sm:mt-0 transition-colors">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{name}</h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium transition-colors">
                  {profile?.jobRole || "Job Seeker"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                  {email} • {profile?.industry || "Industry N/A"}
                </p>
                 {location && (
                  <div className="flex items-center justify-center sm:justify-start text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors">
                    <FaMapMarkerAlt className="mr-1" /> {location}
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <FaUserEdit className="mr-2" /> Edit Profile
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 border-t dark:border-slate-800 pt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 transition-colors">
               {phoneNumber && (
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-gray-400 dark:text-gray-500 transition-colors" /> {phoneNumber}
                </div>
              )}
              {website && (
                <div className="flex items-center">
                  <FaGlobe className="mr-2 text-gray-400 dark:text-gray-500 transition-colors" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                  >
                    {website}
                  </a>
                </div>
              )}
              {resume && (
                <div className="flex items-center">
                  <FaBriefcase className="mr-2 text-gray-400 dark:text-gray-500 transition-colors" />
                  <a
                    href={resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Bio & Skills */}
          <div className="md:col-span-1 space-y-6">
             {/* Bio */}
            <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none border dark:border-slate-800 rounded-lg p-6 transition-colors">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors">About</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line transition-colors">
                {bio || "No bio added yet."}
              </p>
            </div>

             {/* Professional Summary */}
            <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none border dark:border-slate-800 rounded-lg p-6 transition-colors">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors">
                Professional Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 transition-colors">Experience</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors">
                    {profile?.experienceYears || 0} Years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 transition-colors">Notice Period</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors">
                    {profile?.noticePeriod || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 transition-colors">Current Salary</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors">
                    {profile?.currentSalary || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 transition-colors">Expected Salary</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors">
                    {profile?.expectedSalary || "N/A"}
                  </span>
                </div>
              </div>
            </div>

             {/* Skills */}
            <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none border dark:border-slate-800 rounded-lg p-6 transition-colors">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills && skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">No skills added.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Experience & Education */}
          <div className="md:col-span-2 space-y-6">
             {/* Experience */}
            <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none border dark:border-slate-800 rounded-lg p-6 transition-colors">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors">
                <FaBriefcase className="mr-2 text-blue-500 dark:text-blue-400 transition-colors" /> Experience
              </h3>
              <div className="space-y-6">
                 {experience && experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-200 dark:border-slate-800 pl-4 py-1 transition-colors"
                    >
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white transition-colors">
                        {exp.jobTitle}
                      </h4>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                        {exp.company}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic transition-colors">
                        {new Date(exp.startDate).toLocaleDateString()} -{" "}
                        {exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString()
                          : "Present"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    No experience details added.
                  </p>
                )}
              </div>
            </div>

             {/* Education */}
            <div className="bg-white dark:bg-slate-900 shadow dark:shadow-none border dark:border-slate-800 rounded-lg p-6 transition-colors">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors">
                <FaGraduationCap className="mr-2 text-blue-500 dark:text-blue-400 transition-colors" /> Education
              </h3>
              <div className="space-y-6">
                 {education && education.length > 0 ? (
                  education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-200 dark:border-slate-800 pl-4 py-1 transition-colors"
                    >
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white transition-colors">
                        {edu.institution}
                      </h4>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                        {edu.degree} in {edu.fieldOfStudy}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic transition-colors">
                        {new Date(edu.startDate).toLocaleDateString()} -{" "}
                        {edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString()
                          : "Present"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors">
                        {edu.details}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                    No education details added.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
