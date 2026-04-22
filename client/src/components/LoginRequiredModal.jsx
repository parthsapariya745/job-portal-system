import { useNavigate } from 'react-router-dom';
import { FiX, FiLogIn, FiUserPlus, FiLock } from 'react-icons/fi';

const LoginRequiredModal = ({ isOpen, onClose, title = "Login Required", message = "Please login to access this section" }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiLock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-gray-600 text-lg mb-6">
            {message}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <FiLogIn className="w-5 h-5" />
              Login
            </button>

            <button
              onClick={handleRegister}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              <FiUserPlus className="w-5 h-5" />
              Register
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
