import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBell, FaEnvelope, FaTrash, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Skeleton, { SkeletonRow } from "../../components/Skeleton";

const JobAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    keywords: "",
    location: "",
    frequency: "Daily",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("/api/v1/users/alerts", {
        withCredentials: true,
      });
      setAlerts(res.data.data.alerts || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch job alerts");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    try {
      await axios.delete(`/api/v1/users/alerts/${id}`, {
        withCredentials: true,
      });
      setAlerts(alerts.filter((alert) => alert._id !== id));
      toast.info("Alert deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete alert");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newAlert.keywords) return;

    try {
      const res = await axios.post(
        "/api/v1/users/alerts",
        newAlert,
        { withCredentials: true },
      );
      setAlerts(res.data.data.alerts);
      setNewAlert({ keywords: "", location: "", frequency: "Daily" });
      toast.success("Job alert created!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create alert");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight transition-colors italic">Job Alerts</h1>
          <p className="mt-4 text-xl font-bold text-slate-500 dark:text-slate-400 transition-colors">
            Get notified when new jobs match your dreams.
          </p>
        </div>

         {/* Create Alert Form */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl dark:shadow-none border border-white dark:border-slate-800 rounded-[40px] p-8 md:p-10 transition-colors">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center transition-colors uppercase tracking-widest text-sm">
            <span className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl mr-4">
              <FaBell className="text-yellow-500" />
            </span>
            Create New Alert
          </h2>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
          >
             <div className="md:col-span-1">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
                Keywords
              </label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
                <input
                  type="text"
                  placeholder="Java, React..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  value={newAlert.keywords}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, keywords: e.target.value })
                  }
                  required
                />
              </div>
            </div>
             <div className="md:col-span-1">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
                Location
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
                <input
                  type="text"
                  placeholder="Remote, Mumbai..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  value={newAlert.location}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, location: e.target.value })
                  }
                />
              </div>
            </div>
             <div className="md:col-span-1">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
                Frequency
              </label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                value={newAlert.frequency}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, frequency: e.target.value })
                }
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Instant">Instant</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Add Alert ✨
              </button>
            </div>
          </form>
        </div>

         {/* Active Alerts List */}
        <div className="bg-white shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-[40px] overflow-hidden transition-colors">
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Alerts</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {loading ? (
              <div className="p-8 space-y-4">
                <SkeletonRow />
                <SkeletonRow />
              </div>
             ) : alerts.length === 0 ? (
              <div className="p-20 text-center text-slate-400 dark:text-slate-600 transition-colors">
                <FaEnvelope className="mx-auto h-16 w-16 text-slate-100 dark:text-slate-800 mb-6 transition-colors" />
                <p className="text-xl font-bold uppercase tracking-tight">No alerts active yet.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                 <div
                  key={alert._id}
                  className="px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <FaBell />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white transition-colors">
                        {alert.keywords}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          {alert.location || "Anywhere"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                          {alert.frequency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(alert._id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAlerts;
