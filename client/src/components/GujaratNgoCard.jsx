import { useBilingual } from '../hooks/useBilingual';
import { FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const GujaratNgoCard = ({ ngo }) => {
  const { bt } = useBilingual();

  const labels = {
    call: { en: 'CALL NOW', hi: 'अभी कॉल करें', gu: 'કોલ કરો' },
    job: { en: 'WORK:', hi: 'काम:', gu: 'કામ:' },
    location: { en: 'Location:', hi: 'स्थान:', gu: 'સ્થળ:' }
  };

  return (
    <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-100 hover:border-blue-500 transition-all group flex flex-col h-full">
      {/* Photo Section */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={ngo.photo || '/ngo-building.png'} 
          alt={bt(ngo.name)}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-5 py-1.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg">
          {bt(ngo.city)}
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase leading-tight italic">
          {bt(ngo.name)}
        </h3>

        <div className="flex items-start gap-2 text-md font-bold text-gray-500 mb-6">
          <FiMapPin className="text-blue-500 mt-1 shrink-0" />
          <span>{bt(ngo.address)}</span>
        </div>

        <div className="bg-orange-50 p-5 rounded-3xl border-2 border-orange-100 mb-8 flex-1">
          <p className="text-xs text-orange-700 font-black uppercase tracking-wider mb-1">{bt(labels.job)}</p>
          <p className="text-xl font-black text-orange-900 leading-tight">{bt(ngo.job)}</p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <a
            href={`tel:${ngo.phone}`}
            className="col-span-4 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-5 rounded-3xl shadow-xl transition-all active:scale-95 border-b-8 border-green-800"
          >
            <span className="text-3xl">📞</span>
            <span className="text-2xl font-black tracking-tighter">{bt(labels.call)}</span>
          </a>
          <a 
            href={`https://wa.me/${ngo.whatsapp}`} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-center bg-green-100 text-green-600 rounded-3xl hover:bg-green-200 transition-all border-2 border-green-200"
          >
            <FaWhatsapp className="text-4xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GujaratNgoCard;
