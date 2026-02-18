import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/courses" className="text-2xl font-bold hover:text-blue-200">
            CourseHub
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link to="/courses" className="hover:text-blue-200 transition">
              Courses
            </Link>

            {user ? (
              <>
                <Link to="/my-progress" className="hover:text-blue-200 transition">
                  My Progress
                </Link>

                {/* DON'T understand the && */}
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="hover:text-blue-200 transition">
                    Admin Panel
                  </Link>
                )}

                <span className="text-blue-200 text-sm">
                  {user.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;