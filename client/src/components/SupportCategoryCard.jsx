import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const SupportCategoryCard = ({ 
  category,
  showDescription = true,
  className = ''
}) => {
  const { _id, name, description, icon, slug } = category;

  return (
    <Link
      to={`/support/category/${_id}`}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
            <span className="text-2xl">{icon || '📋'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
              {name}
            </h3>
            {showDescription && description && (
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            View programs
          </span>
          <FiArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default SupportCategoryCard;
