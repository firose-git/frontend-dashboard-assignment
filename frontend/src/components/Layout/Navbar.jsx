import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, LogOut, User, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="#" className="flex items-center space-x-3 group">
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-2 group-hover:bg-opacity-30 transition-all duration-300 transform group-hover:scale-110">
              <CheckSquare className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white">TaskFlow Pro</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-2 text-white hover:text-indigo-200 transition-colors duration-300"
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>
                
                <div className="flex items-center space-x-4 border-l border-indigo-500 pl-6">
                  <div className="flex items-center space-x-2 text-white">
                    <div className="bg-white bg-opacity-20 rounded-full p-1">
                      <User size={16} />
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-indigo-200 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
