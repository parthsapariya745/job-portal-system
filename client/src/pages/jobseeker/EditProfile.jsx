import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { checkAuth } from "../../redux/slices/authSlice";
import {
  FaCloudUploadAlt,
  FaUserTie,
  FaBuilding,
  FaGraduationCap,
  FaFileAlt,
} from "react-icons/fa";

const EditProfile = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    bio: "",
    location: "",
    website: "",
    skills: "",
    industry: "",
    jobRole: "",
    noticePeriod: "",
    currentSalary: "",
    expectedSalary: "",
    salaryType: "Per Year",
    experienceYears: 0,
    resumeUrl: "",
    coverImage: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
        coverImage: user.coverImage || "",
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        website: user.profile?.website || "",
        skills: user.profile?.skills?.join(", ") || "",
        industry: user.profile?.industry || "",
        jobRole: user.profile?.jobRole || "",
        noticePeriod: user.profile?.noticePeriod || "",
        currentSalary: user.profile?.currentSalary || "",
        expectedSalary: user.profile?.expectedSalary || "",
        salaryType: user.profile?.salaryType || "Per Year",
        experienceYears: user.profile?.experienceYears || 0,
        resumeUrl: user.profile?.resume || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Resume too large! Max limit is 5MB.");
    }

    const formPayload = new FormData();
    formPayload.append("resume", file);

    setUploading(true);
    try {
      const res = await axios.post(
        "/api/v1/users/profile/resume",
        formPayload,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`
          },
          withCredentials: true,
        },
      );
      setFormData((prev) => ({ ...prev, resumeUrl: res.data.data.resumeUrl }));
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarChange = async (file) => {
    if (file.size > 25 * 1024 * 1024) {
      return toast.error("Image too large! Max limit for profile photo is 25MB.");
    }
    const formPayload = new FormData();
    formPayload.append("avatar", file);

    try {
      // Optimistic UI update could go here but let's wait for server
      const res = await axios.post(
        "/api/v1/users/profile/avatar",
        formPayload,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`
          },
          withCredentials: true,
        },
      );
      setFormData((prev) => ({ ...prev, avatar: res.data.data.avatarUrl }));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload image.");
    }
  };

  const handleCoverChange = async (file) => {
    if (file.size > 25 * 1024 * 1024) {
      return toast.error("Cover image too large! Max limit for background is 25MB.");
    }
    const formPayload = new FormData();
    formPayload.append("cover", file);
    try {
      const res = await axios.post("/api/v1/users/profile/cover", formPayload, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true,
      });
      setFormData((prev) => ({ ...prev, coverImage: res.data.data.coverUrl }));
      toast.success("Cover image updated!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload cover image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiData = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        profile: {
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          industry: formData.industry,
          jobRole: formData.jobRole,
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          noticePeriod: formData.noticePeriod,
          currentSalary: formData.currentSalary,
          expectedSalary: formData.expectedSalary,
          salaryType: formData.salaryType,
          experienceYears: Number(formData.experienceYears),
        },
      };

      await axios.patch("/api/v1/users/profile", apiData, {
        withCredentials: true,
      });

      toast.success("Profile updated successfully!");
      dispatch(checkAuth());
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-xl dark:shadow-none border dark:border-slate-800 rounded-2xl p-6 sm:p-10 transition-colors">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-slate-800 pb-4 transition-colors">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
           {/* Section 1: Basic Information */}
          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center transition-colors">
                <FaUserTie className="mr-3 text-blue-600 dark:text-blue-400" /> Basic Information
              </h2>
            </div>

             {/* Cover Image Upload */}
            <div className="relative h-32 sm:h-48 rounded-xl overflow-hidden bg-gray-200 dark:bg-slate-700 mb-12 group transition-colors">
              <img
                src={formData.coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80"}
                alt="Cover"
                className="w-full h-full object-cover group-hover:opacity-90 transition shadow-inner"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg transition-colors">
                  <FaCloudUploadAlt className="text-blue-600 dark:text-blue-400 text-2xl" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0])
                      handleCoverChange(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </label>
            </div>

             {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-8 -mt-16 sm:-mt-24 relative z-10">
              <div className="relative group cursor-pointer w-24 h-24 sm:w-32 sm:h-32">
                <img
                  src={
                    formData.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl group-hover:opacity-75 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <FaCloudUploadAlt className="text-white text-2xl" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0])
                      handleAvatarChange(e.target.files[0]);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-3 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                Change Photo
              </p>
            </div>

             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
               <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Bio / Headline
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                  placeholder="e.g. Senior React Developer with 5 years of experience..."
                />
              </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Portfolio / Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>

           {/* Section 2: Professional Details */}
          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center transition-colors">
              <FaBuilding className="mr-3 text-indigo-600 dark:text-indigo-400" /> Professional Details
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Industry / Sector */}
               <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Industry / Sector
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="" className="dark:bg-slate-900">Select Industry</option>
                  <option value="IT Services & Consulting" className="dark:bg-slate-900">
                    IT Services & Consulting (Software)
                  </option>
                  <option value="IT Hardware & Networking" className="dark:bg-slate-900">
                    IT Hardware & Networking
                  </option>
                  <option value="Banking & Finance (BFSI)" className="dark:bg-slate-900">
                    Banking & Financial Services (BFSI)
                  </option>
                  <option value="Education & Teaching" className="dark:bg-slate-900">
                    Education, Teaching & Training
                  </option>
                  <option value="Healthcare & Life Sciences" className="dark:bg-slate-900">
                    Healthcare & Life Sciences
                  </option>
                  <option value="Government / Public Administration" className="dark:bg-slate-900">
                    Government / Public Administration
                  </option>
                  <option value="Defense & Military" className="dark:bg-slate-900">Defense & Military</option>
                  <option value="Sales & Marketing" className="dark:bg-slate-900">Sales & Marketing</option>
                  <option value="Manufacturing & Production" className="dark:bg-slate-900">
                    Manufacturing & Production
                  </option>
                  <option value="Civil Engineering & Construction" className="dark:bg-slate-900">
                    Civil Engineering & Construction
                  </option>
                  <option value="BPO / KPO / Customer Support" className="dark:bg-slate-900">
                    BPO / KPO / Customer Support
                  </option>
                  <option value="Media, Advertising & Entertainment" className="dark:bg-slate-900">
                    Media, Advertising & Entertainment
                  </option>
                  <option value="Retail & Wholesale" className="dark:bg-slate-900">Retail & Wholesale</option>
                  <option value="Travel & Tourism" className="dark:bg-slate-900">Travel & Tourism</option>
                  <option value="Agriculture & Dairy" className="dark:bg-slate-900">
                    Agriculture & Dairy
                  </option>
                  <option value="Legal & Law Enforcement" className="dark:bg-slate-900">
                    Legal & Law Enforcement
                  </option>
                  <option value="Other" className="dark:bg-slate-900">Other</option>
                </select>
              </div>

               {/* Job Title / Role */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Current / Preferred Job Title
                </label>
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g. Software Engineer, Bank PO, Staff Nurse, UPSC Aspirant..."
                />
              </div>

               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Key Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="Java, Python, Accounting, Teaching..."
                />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 ml-1">
                  Separate with commas
                </p>
              </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Total Experience (Years)
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Current Salary
                </label>
                <input
                  type="text"
                  name="currentSalary"
                  value={formData.currentSalary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder={formData.salaryType === 'Per Month' ? "e.g. 50000" : "e.g. 12 LPA"}
                />
              </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Expected Salary
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder={formData.salaryType === 'Per Month' ? "e.g. 60000" : "e.g. 15-18 LPA"}
                />
              </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Salary Type
                </label>
                <select
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="Per Year" className="dark:bg-slate-900">Per Year</option>
                  <option value="Per Month" className="dark:bg-slate-900">Per Month</option>
                </select>
              </div>
               <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 ml-1 transition-colors">
                  Notice Period
                </label>
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="" className="dark:bg-slate-900">Select Notice Period</option>
                  <option value="Immediate" className="dark:bg-slate-900">Immediate</option>
                  <option value="15 Days" className="dark:bg-slate-900">15 Days</option>
                  <option value="1 Month" className="dark:bg-slate-900">1 Month</option>
                  <option value="2 Months" className="dark:bg-slate-900">2 Months</option>
                  <option value="3 Months" className="dark:bg-slate-900">3 Months</option>
                  <option value="More than 3 Months" className="dark:bg-slate-900">More than 3 Months</option>
                </select>
              </div>
            </div>
          </div>

           {/* Section 3: Resume Upload */}
          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center transition-colors">
              <FaFileAlt className="mr-3 text-pink-600 dark:text-pink-400" /> Resume / CV
            </h2>
             <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-8 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group">
              <FaCloudUploadAlt className="text-5xl text-gray-400 dark:text-slate-600 mb-3 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-6 transition-colors">
                Upload your resume (PDF, DOC, DOCX - Max 5MB)
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-blue-50 dark:file:bg-slate-800 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-slate-700 cursor-pointer transition-all"
              />
              {uploading && (
                <p className="text-blue-600 text-sm mt-2">Uploading...</p>
              )}
              {formData.resumeUrl && (
                <div className="mt-4 flex items-center text-green-600 text-sm">
                  <FaFileAlt className="mr-1" /> Resume uploaded
                </div>
              )}
            </div>
          </div>

           <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-8 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || uploading}
              className="px-8 py-3.5 border border-transparent shadow-lg text-sm font-black uppercase tracking-wider rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
