import { useState } from "react";
import { useDispatch } from "react-redux";
import { createWorkOpportunity } from "../redux/slices/workOpportunitySlice";
import { toast } from "react-toastify";
import { getCurrentLocation } from "../utils/geo";
import { useBilingual } from "../hooks/useBilingual";

const EmployerPostModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { bt } = useBilingual();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    contactNumber: "",
    organizationName: "",
    lat: null,
    lng: null,
    workType: "Mazdoor",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGetLocation = async () => {
    try {
      setLoading(true);
      toast.info(bt({ en: "Detecting GPS...", hi: "GPS ढूँढ रहे हैं...", gu: "GPS શોધી રહ્યા છીએ..." }));
      const coords = await getCurrentLocation();
      setFormData({ ...formData, lat: coords.lat, lng: coords.lng });
      toast.success(bt({ en: "Location detected!", hi: "स्थान मिल गया!", gu: "સ્થાન મળી ગયું!" }));
    } catch (err) {
      console.error(err);
      toast.error(
        bt({
          en: "GPS failed. Please check browser permissions.",
          hi: "GPS काम नहीं कर रहा। कृपया अनुमति चेक करें।",
          gu: "GPS નિષ્ફળ. કૃપા કરીને બ્રાઉઝર પરવાનગીઓ તપાસો.",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await dispatch(
        createWorkOpportunity({
          ...formData,
          description: formData.description || formData.title, // Ensure description is sent
          targetAudience: "non-educated",
        }),
      ).unwrap();
      toast.success(bt({ en: "Job posted!", hi: "नौकरी पोस्ट हो गई!", gu: "કામ પોસ્ટ થઈ ગયું!" }));
      onClose();
    } catch (err) {
      toast.error(err || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    title: { en: "Job Name / Title", hi: "काम का naam", gu: "કામનું નામ" },
    desc: { en: "Short Description", hi: "छोटा विवरण (क्या काम है?)", gu: "ટૂંકું વર્ણન (શું કામ છે?)" },
    pay: { en: "Set Pay (₹)", hi: "मजदूरी तय करें (₹)", gu: "મજૂરી નક્કી કરો (₹)" },
    phone: { en: "Phone Number", hi: "फोन नंबर", gu: "ફોન નંબર" },
    detectGps: {
      en: "📍 USE MY CURRENT LOCATION",
      hi: "📍 मेरा अभी का स्थान चुनें",
      gu: "📍 મારું વર્તમાન સ્થાન પસંદ કરો",
    },
    postBtn: { en: "🚀 POST JOB NOW", hi: "🚀 अभी पोस्ट करें", gu: "🚀 હમણાં જ પોસ્ટ કરો" },
    employerName: { en: "Your Name / Shop", hi: "आपका नाम / दुकान", gu: "તમારું નામ / દુકાન" },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border-8 border-green-100 flex flex-col max-h-[95vh]">
        <div className="bg-green-600 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-black text-white uppercase italic">
            {bt(translations.postBtn)}
          </h2>
          <button onClick={onClose} className="text-white text-5xl font-black">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
          {/* Big Buttons for categories */}
          <div className="grid grid-cols-3 gap-3">
            {[
              "Mazdoor",
              "Delivery",
              "Safai",
              "Security",
              "Dukan",
              "Repair",
            ].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, workType: type })}
                className={`py-4 rounded-2xl font-black text-xl border-4 transition-all ${
                  formData.workType === type
                    ? "bg-orange-600 text-white border-orange-300 scale-95"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input
              required
              placeholder={bt(translations.title)}
              className="w-full h-16 px-6 text-xl font-bold bg-gray-50 border-4 border-gray-200 rounded-3xl focus:border-green-500 outline-none"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <textarea
              required
              placeholder={bt(translations.desc)}
              className="w-full h-24 px-6 py-4 text-xl font-bold bg-gray-50 border-4 border-gray-200 rounded-3xl focus:border-green-500 outline-none resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="number"
                placeholder={bt(translations.pay)}
                className="w-full h-16 px-6 text-xl font-bold bg-gray-50 border-4 border-gray-200 rounded-3xl focus:border-green-500 outline-none"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
              />
              <input
                required
                type="tel"
                placeholder={bt(translations.phone)}
                className="w-full h-16 px-6 text-xl font-bold bg-gray-50 border-4 border-gray-200 rounded-3xl focus:border-green-500 outline-none"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
              />
            </div>

            <input
              required
              placeholder={bt(translations.employerName)}
              className="w-full h-16 px-6 text-xl font-bold bg-gray-50 border-4 border-gray-200 rounded-3xl focus:border-green-500 outline-none"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
            />

            <input
              required
              placeholder={bt({
                en: "City / Area Name",
                hi: "शहर / इलाके का नाम",
                gu: "શહેર / વિસ્તારનું નામ",
              })}
              className="w-full h-16 px-6 text-xl font-bold bg-gray-50 border-4 border-gray-200 rounded-3xl focus:border-green-500 outline-none"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loading}
              className={`w-full h-20 rounded-3xl font-black text-xl border-4 transition-all ${
                formData.lat
                  ? "bg-green-100 text-green-700 border-green-500"
                  : "bg-blue-600 text-white border-blue-400 hover:bg-blue-700 shadow-lg"
              }`}
            >
              {formData.lat
                ? `✅ ${bt({ en: "LOCATION SAVED", hi: "स्थान सुरक्षित है", gu: "સ્થાન સેવ થઈ ગયું" })}`
                : bt(translations.detectGps)}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-20 bg-green-600 hover:bg-green-700 text-white rounded-[40px] text-2xl font-black shadow-xl transition-all active:scale-95 border-b-8 border-green-800"
          >
            {loading ? "..." : bt(translations.postBtn)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployerPostModal;
