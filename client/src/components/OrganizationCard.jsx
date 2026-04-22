import { FiPhone, FiGlobe, FiMail, FiMapPin, FiExternalLink } from 'react-icons/fi';

const OrganizationCard = ({ 
  organization,
  showFullDetails = false,
  className = ''
}) => {
  const { 
    name, 
    description, 
    governmentLevel, 
    website, 
    email, 
    helpline, 
    address, 
    location,
    isVerified 
  } = organization;

  const getLevelColor = (level) => {
    switch (level) {
      case 'Central':
        return 'bg-red-100 text-red-800';
      case 'State':
        return 'bg-blue-100 text-blue-800';
      case 'Local':
        return 'bg-green-100 text-green-800';
      case 'NGO':
        return 'bg-orange-100 text-orange-800';
      case 'Private':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${getLevelColor(governmentLevel)}`}>
              <span className="text-2xl">
                {governmentLevel === 'NGO' ? '🤝' : governmentLevel === 'Central' ? '🏛️' : governmentLevel === 'State' ? '🏢' : '📍'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <span className={`inline-block text-xs font-medium px-2 py-1 rounded mt-1 ${getLevelColor(governmentLevel)}`}>
                {governmentLevel}
              </span>
            </div>
          </div>
          {isVerified && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Contact Information */}
        <div className="space-y-3">
          {helpline && (
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FiPhone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Helpline</div>
                <a 
                  href={`tel:${helpline}`} 
                  className="text-green-700 font-medium hover:underline"
                >
                  {helpline}
                </a>
              </div>
            </div>
          )}

          {email && (
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiMail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <a 
                  href={`mailto:${email}`} 
                  className="text-blue-700 font-medium hover:underline truncate max-w-[200px] block"
                >
                  {email}
                </a>
              </div>
            </div>
          )}

          {website && (
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FiGlobe className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Website</div>
                <a 
                  href={website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-700 font-medium hover:underline truncate max-w-[200px] block flex items-center gap-1"
                >
                  Visit Website
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {(address || location) && (
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <FiMapPin className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <span className="text-gray-700">
                  {address || location}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Government Level Badge */}
        {showFullDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Organization Type: <span className="font-medium text-gray-700">{governmentLevel}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationCard;
