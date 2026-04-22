import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaBuilding,
  FaGlobe,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaCamera,
  FaCheckCircle,
} from "react-icons/fa";
import Skeleton, { SkeletonRow } from "../../components/Skeleton";
import { calculateCompanyProfileCompletion } from "../../utils/profileUtils";

const CompanyProfile = () => {
  const { user, token, isLoading: authLoading } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 border dark:border-slate-800 transition-colors">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-lg dark:bg-slate-800" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-64 dark:bg-slate-800" />
                <Skeleton className="h-4 w-48 dark:bg-slate-800" />
              </div>
            </div>
          </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 space-y-4 border dark:border-slate-800 transition-colors">
                <Skeleton className="h-6 w-32 dark:bg-slate-800" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full dark:bg-slate-800" />
                  <Skeleton className="h-10 w-full dark:bg-slate-800" />
                  <Skeleton className="h-10 w-full dark:bg-slate-800" />
                  <Skeleton className="h-10 w-full dark:bg-slate-800" />
                </div>
                <Skeleton className="h-32 w-full dark:bg-slate-800" />
              </div>
            </div>
             <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 space-y-4 border dark:border-slate-800 transition-colors">
                <Skeleton className="h-6 w-32 dark:bg-slate-800" />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
    industry: "",
    size: "1-10",
    logo: "",
    foundedYear: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    benefits: "",
  });

  useEffect(() => {
    if (user && user.companyProfile) {
      const { companyProfile } = user;
      setFormData({
        companyName: companyProfile.companyName || "",
        description: companyProfile.description || "",
        website: companyProfile.website || "",
        location: companyProfile.location || "",
        industry: companyProfile.industry || "",
        size: companyProfile.size || "1-10",
        logo: companyProfile.logo || "",
        foundedYear: companyProfile.foundedYear || "",
        linkedin: companyProfile.socialLinks?.linkedin || "",
        twitter: companyProfile.socialLinks?.twitter || "",
        facebook: companyProfile.socialLinks?.facebook || "",
        instagram: companyProfile.socialLinks?.instagram || "",
        benefits: companyProfile.benefits
          ? companyProfile.benefits.join(", ")
          : "",
      });
    }
  }, [user]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const payload = {
        companyProfile: {
          companyName: formData.companyName,
          description: formData.description,
          website: formData.website,
          location: formData.location,
          industry: formData.industry,
          size: formData.size,
          logo: formData.logo,
          foundedYear: formData.foundedYear,
          socialLinks: {
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            facebook: formData.facebook,
            instagram: formData.instagram,
          },
          benefits: formData.benefits
            .split(",")
            .map((b) => b.trim())
            .filter((b) => b),
        },
      };

      const res = await axios.patch("/api/v1/users/profile", payload, config);

      if (res.data.status === "success") {
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable Input Component for consistent styling
   const InputGroup = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    icon: Icon,
    required,
  }) => (
    <div className="mb-4 transition-colors">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
       <div className="relative rounded-md shadow-sm group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors">
            <Icon size={14} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`block w-full ${
            Icon ? "pl-10" : "pl-3"
          } pr-3 py-2 sm:text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-400 dark:hover:border-slate-600`}
        />
      </div>
    </div>
  );

  const handleLogoUpload = async (file) => {
    const formPayload = new FormData();
    formPayload.append("avatar", file);

    try {
      const res = await axios.post("/api/v1/users/profile/avatar", formPayload, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setFormData((prev) => ({ ...prev, logo: res.data.data.avatarUrl }));
      toast.success("Logo uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Max 2MB, JPG/PNG only.");
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
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
         <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar: Profile Overview */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[60px] shadow-2xl border-2 border-white dark:border-slate-800 overflow-hidden sticky top-12 transition-all group">
              <div className="p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-indigo-500/10 to-transparent"></div>
                <div className="relative inline-block mb-8">
                  <div className="h-40 w-40 mx-auto bg-white dark:bg-slate-900 rounded-[45px] flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative group/logo transition-all duration-500 hover:scale-105 active:scale-95">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="h-full w-full object-cover group-hover/logo:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <FaBuilding className="h-20 w-20 text-slate-200 dark:text-slate-800 group-hover/logo:opacity-75 transition-opacity" />
                    )}
                     <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                      <FaCamera className="text-white text-3xl" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) handleLogoUpload(e.target.files[0]);
                      }}
                      title="Upload Company Logo"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white transition-colors uppercase italic tracking-tighter mb-2">
                  {formData.companyName || "Global Tech Hub"}
                </h3>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                   {formData.industry || "Pioneer Industry"}
                </div>
              </div>

               <div className="px-10 py-10 border-t-2 border-slate-50 dark:border-slate-800/50 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                    Digital Footprint
                  </span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 italic">
                    {calculateCompanyProfileCompletion(user)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner border border-white dark:border-slate-700">
                  <div
                    className="bg-indigo-600 h-full rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-1000 ease-out"
                    style={{
                      width: `${calculateCompanyProfileCompletion(user)}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-8 space-y-4">
                  {[
                    { label: "Core Identity", met: !!formData.companyName },
                    { label: "Visual Branding", met: !!formData.logo },
                    { label: "Market Position", met: !!formData.industry },
                    { label: "Global Reach", met: !!formData.website },
                  ].map((check, idx) => (
                    <div key={idx} className={`flex items-center text-[10px] font-black uppercase tracking-widest transition-colors ${check.met ? 'text-green-600 dark:text-green-400' : 'text-slate-300 dark:text-slate-700'}`}>
                      <FaCheckCircle className={`mr-3 ${check.met ? 'opacity-100' : 'opacity-20'}`} /> {check.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Forms */}
          <div className="w-full lg:w-2/3">
             <form onSubmit={handleSubmit} className="space-y-12">
              {/* Premium Ghost Header */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-4">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white transition-colors uppercase italic tracking-tighter">
                    Recalibrate Identity
                  </h2>
                  <p className="text-lg font-bold text-slate-500 dark:text-slate-400 italic transition-colors">
                    "Project your corporate vision to the world."
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[30px] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all border-b-[6px] border-slate-700 dark:border-slate-200 overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  {isLoading ? "Synchronizing..." : "Commit Updates"}
                </button>
              </div>

               {/* Section 1: Strategic Intel */}
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[60px] p-10 md:p-14 border-2 border-white dark:border-slate-800 shadow-2xl transition-all hover:bg-white/70 dark:hover:bg-slate-900/70 relative group/section">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover/section:bg-indigo-500/10 transition-colors duration-1000"></div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white transition-colors mb-12 flex items-center uppercase italic tracking-tighter">
                  <span className="flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mr-5 shadow-xl rotate-3 group-hover/section:-rotate-3 transition-transform duration-500">
                    <FaBuilding size={20} />
                  </span>
                  Strategic Intelligence
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <InputGroup
                    label="Corporate Title"
                    name="companyName"
                    value={formData.companyName}
                    onChange={onChange}
                    required
                    placeholder="E.g. SpaceX Systems"
                  />
                  <InputGroup
                    label="Nexus Domain"
                    name="website"
                    value={formData.website}
                    onChange={onChange}
                    icon={FaGlobe}
                    placeholder="https://spacex.nexus"
                  />

                   <div className="md:col-span-2 space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">
                       Vision Statement
                    </label>
                    <textarea
                      name="description"
                      rows={6}
                      value={formData.description}
                      onChange={onChange}
                      className="block w-full py-6 px-8 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-700/50 rounded-[35px] focus:outline-none focus:border-indigo-500 placeholder-slate-300 dark:placeholder-slate-600 transition-all font-bold shadow-inner resize-none text-lg leading-relaxed hover:border-indigo-300 dark:hover:border-indigo-900"
                      placeholder="Define the mission architecture..."
                    />
                  </div>
                </div>
              </div>

               {/* Section 2: Deployment Metrics */}
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[60px] p-10 md:p-14 border-2 border-white dark:border-slate-800 shadow-2xl transition-all hover:bg-white/70 dark:hover:bg-slate-900/70 relative group/section2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover/section2:bg-green-500/10 transition-colors duration-1000"></div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white transition-colors mb-12 flex items-center uppercase italic tracking-tighter">
                  <span className="flex items-center justify-center h-12 w-12 rounded-2xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 mr-5 shadow-xl -rotate-3 group-hover/section2:rotate-3 transition-transform duration-500">
                    <FaUsers size={20} />
                  </span>
                  Deployment Metrics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <InputGroup
                    label="Current Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={onChange}
                    placeholder="E.g. Quantum Computing"
                  />

                   <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">
                       Workforce Magnitude
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={onChange}
                      className="block w-full py-5 px-8 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-700/50 rounded-[25px] focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer transition-all font-bold uppercase tracking-widest text-xs hover:border-indigo-300 dark:hover:border-indigo-900"
                    >
                      <option value="1-10">Tactical Squad (1-10)</option>
                      <option value="11-50">Operational Platoon (11-50)</option>
                      <option value="51-200">Corporate Division (51-200)</option>
                      <option value="201-500">Regional Force (201-500)</option>
                      <option value="500+">Global Empire (500+)</option>
                    </select>
                  </div>

                  <InputGroup
                    label="Genesis Year"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={onChange}
                    icon={FaCalendarAlt}
                    placeholder="YYYY"
                  />
                  <InputGroup
                    label="Base of Ops"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    icon={FaMapMarkerAlt}
                    placeholder="Station, Sector"
                  />

                   <div className="md:col-span-2 space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">
                       Protocol Perks & Subsidies
                    </label>
                    <input
                      type="text"
                      name="benefits"
                      value={formData.benefits}
                      onChange={onChange}
                      className="block w-full py-5 px-8 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-700/50 rounded-[25px] focus:outline-none focus:border-indigo-500 placeholder-slate-300 dark:placeholder-slate-600 transition-all font-bold shadow-inner hover:border-indigo-300 dark:hover:border-indigo-900"
                      placeholder="E.g. Cybernetic Augmentation, Interstellar Travel (Comma separated)"
                    />
                  </div>
                </div>
              </div>

               {/* Section 3: Digital Presence */}
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[60px] p-10 md:p-14 border-2 border-white dark:border-slate-800 shadow-2xl transition-all hover:bg-white/70 dark:hover:bg-slate-900/70 relative group/section3">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover/section3:bg-pink-500/10 transition-colors duration-1000"></div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white transition-colors mb-12 flex items-center uppercase italic tracking-tighter">
                  <span className="flex items-center justify-center h-12 w-12 rounded-2xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 mr-5 shadow-xl rotate-3 group-hover/section3:-rotate-3 transition-transform duration-500">
                    <FaGlobe size={20} />
                  </span>
                  Digital Presence
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <InputGroup
                    label="Nexus (LinkedIn)"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={onChange}
                    icon={FaLinkedin}
                    placeholder="Link to Nexus"
                  />
                  <InputGroup
                    label="Signal (Twitter)"
                    name="twitter"
                    value={formData.twitter}
                    onChange={onChange}
                    icon={FaTwitter}
                    placeholder="Transmit Hub"
                  />
                  <InputGroup
                    label="Network (Facebook)"
                    name="facebook"
                    value={formData.facebook}
                    onChange={onChange}
                    icon={FaFacebook}
                    placeholder="Entity Node"
                  />
                  <InputGroup
                    label="Visions (Instagram)"
                    name="instagram"
                    value={formData.instagram}
                    onChange={onChange}
                    icon={FaInstagram}
                    placeholder="Visual Stream"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;