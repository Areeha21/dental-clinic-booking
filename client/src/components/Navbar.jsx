import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-navy">
      <Link to="/" className="text-lg font-semibold text-white">
        Rashid Dental Clinic
      </Link>
      <div className="flex gap-4 text-sm items-center">
        {!user && (
          <>
            <Link to="/login" className="text-white hover:text-skyblue transition">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-skyblue transition">
              Register
            </Link>
          </>
        )}
        {user && (
          <>
            <Link to="/my-appointments" className="text-white hover:text-skyblue transition">
              My Appointments
            </Link>
            <Link to="/profile" className="text-white hover:text-skyblue transition">
              Profile
            </Link>
            <span className="text-white/60 text-xs">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-skyblue transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
