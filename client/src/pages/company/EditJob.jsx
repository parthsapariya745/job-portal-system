import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaDollarSign, FaListUl, FaLevelUpAlt } from 'react-icons/fa';

const EditJob = () => {
    const { id } = useParams();
    const { user, accessToken } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        requirements: '',
        location: '',
        type: 'Full-time',
        category: 'Tech',
        level: 'Mid Level',
        status: 'open',
        salaryMin: '',
        salaryMax: '',
        salaryNegotiable: false
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`/api/v1/jobs/${id}`);
                const job = res.data?.data || res.data;
                if (job) {
                    setFormData({
                        title: job.title || '',
                        companyName: job.company?.name || job.companyName || '',
                        description: job.description || '',
                        requirements: job.requirements || '',
                        location: job.location || '',
                        type: job.type || 'Full-time',
                        category: job.category || 'Tech',
                        level: job.level || 'Mid Level',
                        status: job.status || 'open',
                        salaryMin: job.salary?.min || '',
                        salaryMax: job.salary?.max || '',
                        salaryNegotiable: job.salary?.negotiable || false
                    });
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load job');
                navigate('/company/jobs');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchJob();
    }, [id, navigate]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${accessToken}` } };
            const payload = {
                title: formData.title,
                description: formData.description,
                requirements: formData.requirements,
                type: formData.type,
                category: formData.category,
                level: formData.level,
                location: formData.location,
                status: formData.status,
                salary: (formData.salaryMin || formData.salaryMax)
                    ? { min: formData.salaryMin ? Number(formData.salaryMin) : undefined, max: formData.salaryMax ? Number(formData.salaryMax) : undefined, negotiable: formData.salaryNegotiable }
                    : undefined
            };
            await axios.patch(`/api/v1/jobs/${id}`, payload, config);
            toast.success('Job updated successfully!');
            navigate('/company/jobs');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update job');
        }
    };

    if (user?.role !== 'Company' && user?.role !== 'Company HR') {
        return <div className="p-10 text-center text-red-500">Access Denied.</div>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-300/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-300/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors mb-6">
             <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
             Opportunity Recalibration
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white transition-colors tracking-tighter uppercase italic leading-none mb-4">
            Edit Listing
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-bold transition-colors italic opacity-80 max-w-2xl leading-relaxed">
            "Refine the parameters of your search for extreme talent velocity."
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[60px] p-8 md:p-14 border-2 border-white dark:border-slate-800 shadow-2xl transition-all relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>
          
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Job Designation</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-indigo-500">
                    <FaBriefcase />
                  </div>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full pl-14 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[25px] text-slate-900 dark:text-white font-bold transition-all outline-none shadow-inner" placeholder="E.g. Lead Orbital Engineer" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Entity Context</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                    <FaBuilding />
                  </div>
                  <input type="text" name="companyName" value={formData.companyName} readOnly className="w-full pl-14 pr-8 py-5 bg-slate-100/50 dark:bg-slate-800/20 border-2 border-slate-50 dark:border-slate-700/50 rounded-[25px] text-slate-400 dark:text-slate-500 font-bold outline-none cursor-not-allowed italic" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                 <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Temporal State</label>
                 <select name="type" value={formData.type} onChange={handleChange} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[25px] text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer transition-all outline-none shadow-inner">
                    <option value="Full-time">Full Cycle</option>
                    <option value="Part-time">Fractional Burst</option>
                    <option value="Contract">Targeted Sprint</option>
                    <option value="Internship">Prototype Role</option>
                    <option value="Freelance">On-Demand Node</option>
                 </select>
              </div>
              <div className="space-y-4">
                 <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Domain Sector</label>
                 <select name="category" value={formData.category} onChange={handleChange} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[25px] text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer transition-all outline-none shadow-inner">
                    <option value="Tech">Tech Matrix</option>
                    <option value="Non-Tech">Core Operations</option>
                    <option value="Marketing">Signal Propagation</option>
                    <option value="Finance">Capital Management</option>
                    <option value="Sales">Growth Acquisition</option>
                    <option value="HR">Force Enhancement</option>
                    <option value="Design">Visual Architecture</option>
                    <option value="Operations">Grid Control</option>
                 </select>
              </div>
              <div className="space-y-4">
                 <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Expertise Grade</label>
                 <select name="level" value={formData.level} onChange={handleChange} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[25px] text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] appearance-none cursor-pointer transition-all outline-none shadow-inner">
                    <option value="Entry Level">Alpha Build</option>
                    <option value="Mid Level">Production Grade</option>
                    <option value="Senior Level">Lead Architect</option>
                    <option value="Internship">Seed Project</option>
                 </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Node Radar Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-[25px] font-black uppercase tracking-[0.3em] text-[10px] appearance-none cursor-pointer transition-all outline-none shadow-2xl">
                  <option value="open">Active Beacon (Open)</option>
                  <option value="closed">Decommissioned (Closed)</option>
                  <option value="archived">Cold Storage (Archived)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Deployment Zone</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-pink-500">
                    <FaMapMarkerAlt />
                  </div>
                  <input type="text" name="location" value={formData.location} required onChange={handleChange} className="w-full pl-14 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[25px] text-slate-900 dark:text-white font-bold transition-all outline-none shadow-inner" placeholder="E.g. Mars Colony, Sector 7" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Compensation Range</label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-1 group/input">
                       <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-green-500">
                        <FaDollarSign />
                      </div>
                      <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="w-full pl-14 pr-4 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[25px] text-slate-900 dark:text-white font-bold transition-all outline-none shadow-inner" placeholder="Min" min="0" />
                    </div>
                    <span className="text-slate-300 font-black">—</span>
                    <div className="relative flex-1 group/input">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-green-500">
                        <FaDollarSign />
                      </div>
                      <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="w-full pl-14 pr-4 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[25px] text-slate-900 dark:text-white font-bold transition-all outline-none shadow-inner" placeholder="Max" min="0" />
                    </div>
                  </div>
                   <label className="flex items-center gap-4 group cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" name="salaryNegotiable" checked={formData.salaryNegotiable} onChange={handleChange} className="sr-only" />
                        <div className={`w-14 h-8 rounded-full transition-colors duration-300 flex items-center px-1 ${formData.salaryNegotiable ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                           <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${formData.salaryNegotiable ? 'translate-x-6' : 'translate-x-0'} shadow-lg`}></div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">Flexible Parameters</span>
                   </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Listing Narrative</label>
              <textarea name="description" rows={8} required value={formData.description} onChange={handleChange} className="w-full px-8 py-8 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[40px] text-slate-900 dark:text-white font-bold transition-all outline-none resize-none shadow-inner text-lg leading-relaxed" placeholder="Define the output required..." />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">Technical Protocols</label>
              <textarea name="requirements" rows={6} required value={formData.requirements} onChange={handleChange} className="w-full px-8 py-8 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[40px] text-slate-900 dark:text-white font-bold transition-all outline-none resize-none shadow-inner" placeholder="List the core dependencies..." />
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-6 pt-12 border-t-2 border-slate-50 dark:border-slate-800/50">
              <button type="button" onClick={() => navigate('/company/jobs')} className="px-12 py-5 border-b-[6px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-[30px] font-black uppercase tracking-widest text-[10px] hover:text-red-500 hover:border-red-100 transition-all active:scale-95">
                  Decline Update
              </button>
              <button type="submit" className="group relative px-14 py-5 bg-indigo-600 text-white rounded-[30px] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all border-b-[6px] border-indigo-800 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  Flush Update ✨
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
};

export default EditJob;