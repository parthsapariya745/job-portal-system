import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiArrowRight } from 'react-icons/fi';

const OpportunityCard = ({ 
  type = 'educated', 
  title, 
  description, 
  count, 
  link, 
  icon: customIcon,
  onClick 
}) => {
  const isEducated = type === 'educated';
  
  const defaultConfig = {
    educated: {
      bgGradient: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800',
      icon: <FiBookOpen className="w-8 h-8 text-white" />,
      countColor: 'text-blue-600 dark:text-blue-400',
      buttonBg: 'bg-blue-600 dark:bg-blue-600',
      buttonHover: 'hover:bg-blue-700 dark:hover:bg-blue-500',
    },
    nonEducated: {
      bgGradient: 'from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-800',
      icon: <FiUsers className="w-8 h-8 text-white" />,
      countColor: 'text-green-600 dark:text-green-400',
      buttonBg: 'bg-green-600 dark:bg-green-600',
      buttonHover: 'hover:bg-green-700 dark:hover:bg-green-500',
    },
  };

  const config = defaultConfig[type] || defaultConfig.educated;
  const Icon = customIcon || config.icon;

  const CardContent = (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-transparent dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className={`bg-gradient-to-r ${config.bgGradient} p-6`}>
        <div className="flex items-center justify-between">
          <div className="bg-white/20 p-3 rounded-full">
            {Icon}
          </div>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
            {count}+ openings
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title || (isEducated ? 'Educated Opportunities' : 'Non-Educated Opportunities')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
          {description || (isEducated 
            ? 'Professional job listings for qualified candidates with formal education.'
            : 'Government welfare programs, NGO support services, and employment opportunities for non-educated individuals.'
          )}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className={`font-semibold ${config.countColor}`}>{count}</span> {isEducated ? 'active jobs' : 'support programs'}
          </div>
          <div className={`inline-flex items-center gap-2 ${config.buttonBg} text-white px-6 py-3 rounded-lg font-medium ${config.buttonHover} transition-colors`}>
            Explore
            <FiArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {CardContent}
      </button>
    );
  }

  return (
    <Link to={link || (isEducated ? '/jobs' : '/support/non-educated')} className="block h-full">
      {CardContent}
    </Link>
  );
};

export default OpportunityCard;
