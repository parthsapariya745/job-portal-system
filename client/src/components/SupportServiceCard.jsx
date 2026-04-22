import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiGlobe, FiUsers, FiHeart } from 'react-icons/fi';

const SupportServiceCard = ({ 
  service,
  showActions = true,
  className = ''
}) => {
  const { 
    _id, 
    title, 
    description, 
    categoryId, 
    organizationId, 
    serviceType, 
    location,
    requirements 
  } = service;

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 ${className}`}>
      <div className="p-6">
        {/* Service Type Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            {serviceType || 'Support'}
          </span>
          {categoryId?.name && (
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
              {categoryId.name}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Organization */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <FiUsers className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 font-medium">
            {organizationId?.name || 'Unknown Organization'}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <FiMapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{location}</span>
        </div>

        {/* Helpline */}
        {organizationId?.helpline && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <FiPhone className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-medium">
              {organizationId.helpline}
            </span>
          </div>
        )}

        {/* Website */}
        {organizationId?.website && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <FiGlobe className="w-4 h-4 text-gray-400" />
            <a
              href={organizationId.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate max-w-[200px]"
            >
              Visit Website
            </a>
          </div>
        )}

        {/* Requirements Preview */}
        {requirements && (
          <div className="bg-yellow-50 rounded-lg p-3 mb-4">
            <h4 className="text-xs font-medium text-yellow-800 mb-1">
              Requirements:
            </h4>
            <p className="text-xs text-yellow-700 line-clamp-2">{requirements}</p>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <Link
              to={`/support/service/${_id}`}
              className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              View Full Details
            </Link>
            <div className="grid grid-cols-2 gap-2">
              {organizationId?.helpline && (
                <a
                  href={`tel:${organizationId.helpline}`}
                  className="block text-center bg-white border border-green-600 text-green-700 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
                >
                  <FiPhone className="w-4 h-4 inline-block mr-1" />
                  Call
                </a>
              )}
              <Link
                to="/support/request-help"
                className={`block text-center bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm ${!organizationId?.helpline ? 'col-span-2' : ''}`}
              >
                <FiHeart className="w-4 h-4 inline-block mr-1" />
                Apply
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportServiceCard;
