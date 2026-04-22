import { useState } from "react";
import {
  FaCheckCircle,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaPrint,
} from "react-icons/fa";

const Billing = () => {
  // Mock Data
  const [currentPlan, setCurrentPlan] = useState("pro"); // free, pro, enterprise
  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-01-01",
      amount: "$49.00",
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      date: "2024-02-01",
      amount: "$49.00",
      status: "Paid",
    },
    {
      id: "INV-2024-003",
      date: "2024-03-01",
      amount: "$49.00",
      status: "Pending",
    },
  ];

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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-300/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob pointer-events-none transition-colors duration-500"></div>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-300/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors mb-6">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Financial Nexus
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white transition-colors tracking-tighter uppercase italic leading-none mb-4">
            Billing & Assets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-bold transition-colors italic opacity-80 max-w-2xl leading-relaxed">
            "Manage your corporate resource allocation and transaction telemetry."
          </p>
        </div>

        {/* Current Plan Section */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[60px] overflow-hidden border-2 border-white dark:border-slate-800 shadow-2xl mb-12 group transition-all">
          <div className="px-10 py-8 border-b-2 border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Operational Cycle
            </h3>
            <span className="inline-flex items-center px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-900/50">
              Active Stream
            </span>
          </div>
          <div className="p-10 md:p-14">
            <div className="lg:flex lg:items-center lg:justify-between gap-16">
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight transition-colors">
                    Pro Engine
                  </h4>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 italic transition-colors">$49/mo <span className="text-xs font-black uppercase tracking-widest text-slate-400 opacity-60 not-italic">• Automated Re-up</span></p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {[
                    "10 Active Slots/Month",
                    "Deep Candidate Search",
                    "Priority Nexus Support",
                    "Full Brand Integration",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                      <FaCheckCircle className="text-emerald-500 mr-4 text-lg" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 lg:mt-0 flex flex-col sm:flex-row gap-6">
                <button className="px-10 py-5 border-b-[6px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-[30px] font-black uppercase tracking-widest text-[10px] transition-all active:scale-95">
                  Recalibrate
                </button>
                <button className="group relative px-12 py-5 bg-indigo-600 text-white rounded-[30px] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all border-b-[6px] border-indigo-800 overflow-hidden">
                   <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  Upgrade to Enterprise ✨
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Payment Method */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[60px] overflow-hidden border-2 border-white dark:border-slate-800 shadow-2xl group transition-all">
            <div className="px-10 py-8 border-b-2 border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                Capital Source
              </h3>
            </div>
            <div className="p-10">
              <div className="flex items-center justify-between bg-white dark:bg-slate-800/50 p-8 rounded-[40px] border-2 border-slate-50 dark:border-slate-800 transition-all hover:border-indigo-500 shadow-inner">
                <div className="flex items-center">
                  <div className="p-5 bg-slate-900 dark:bg-white rounded-[20px] shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                    <FaCreditCard className="h-8 w-8 text-white dark:text-slate-900" />
                  </div>
                  <div className="ml-6">
                    <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      Visa • 4242
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mt-1">Status: Valid thru 12/25</p>
                  </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Invoices Notification/Quick Actions */}
          <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-[60px] p-12 text-white shadow-2xl shadow-blue-500/30 flex flex-col justify-between relative overflow-hidden group/elite">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-x-10 -translate-y-10 group-hover/elite:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-6">Aggregated Spend</h3>
              <p className="text-6xl font-black italic tracking-tighter mb-2">$588.00</p>
              <p className="text-blue-100/80 font-black uppercase tracking-widest text-[10px]">Telemetry Active since JAN'24</p>
            </div>
            <button className="relative z-10 mt-12 w-full py-5 bg-white text-indigo-800 rounded-[25px] font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all active:scale-95 shadow-2xl border-b-[6px] border-slate-200">
              Download Audit Summary 📥
            </button>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[60px] overflow-hidden border-2 border-white dark:border-slate-800 shadow-2xl transition-all pb-12">
          <div className="px-10 py-8 border-b-2 border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Archive Registry
            </h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-separate border-spacing-y-4 px-10">
                <thead>
                   <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                      <th className="pb-4">Registry ID</th>
                      <th className="pb-4">Timestamp</th>
                      <th className="pb-4 text-right">Value</th>
                      <th className="pb-4 text-center">Status</th>
                      <th className="pb-4 text-right">Ops</th>
                   </tr>
                </thead>
                <tbody>
                   {invoices.map((invoice) => (
                      <tr key={invoice.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-500">
                         <td className="py-6 first:rounded-l-[30px] border-y-2 first:border-l-2 border-slate-50 dark:border-slate-800/50 pl-6">
                            <div className="flex items-center">
                               <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform">
                                  <FaFileInvoiceDollar className="text-slate-400" />
                               </div>
                               <span className="text-lg font-black text-slate-900 dark:text-white italic">{invoice.id}</span>
                            </div>
                         </td>
                         <td className="py-6 border-y-2 border-slate-50 dark:border-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">{invoice.date}</td>
                         <td className="py-6 border-y-2 border-slate-50 dark:border-slate-800/50 text-right text-lg font-black text-slate-900 dark:text-white uppercase italic">{invoice.amount}</td>
                         <td className="py-6 border-y-2 border-slate-50 dark:border-slate-800/50 text-center px-4">
                            <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${
                               invoice.status === "Paid"
                                 ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800"
                                 : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                            }`}>
                               {invoice.status}
                            </span>
                         </td>
                         <td className="py-6 last:rounded-r-[30px] border-y-2 last:border-r-2 border-slate-50 dark:border-slate-800/50 pr-6 text-right">
                           <button className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90 border border-slate-100 dark:border-slate-800 shadow-sm">
                             <FaPrint />
                           </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
