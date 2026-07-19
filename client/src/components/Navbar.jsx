import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-navy relative">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" onClick={closeMenu} className="text-lg font-semibold text-white">
          Rashid Dental Clinic
        </Link>

        {/* Desktop links — hidden on small screens */}
        <div className="hidden sm:flex gap-4 text-sm items-center">
          {!user && (
            <>
              <Link to="/login" className="text-white hover:text-skyblue transition">Login</Link>
              <Link to="/register" className="text-white hover:text-skyblue transition">Register</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/my-appointments" className="text-white hover:text-skyblue transition">My Appointments</Link>
              <Link to="/profile" className="text-white hover:text-skyblue transition">Profile</Link>
              <span className="text-white/60 text-xs">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-white hover:text-skyblue transition">Logout</button>
            </>
          )}
        </div>

        {/* Hamburger button — only shows on small screens */}
        <button
          className="sm:hidden text-white text-2xl leading-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-1 px-6 pb-4 text-sm">
          {!user && (
            <>
              <Link to="/login" onClick={closeMenu} className="text-white py-2 border-t border-white/10">Login</Link>
              <Link to="/register" onClick={closeMenu} className="text-white py-2 border-t border-white/10">Register</Link>
            </>
          )}
          {user && (
            <>
              <span className="text-white/60 text-xs py-2 border-t border-white/10">Hi, {user.name}</span>
              <Link to="/my-appointments" onClick={closeMenu} className="text-white py-2 border-t border-white/10">My Appointments</Link>
              <Link to="/profile" onClick={closeMenu} className="text-white py-2 border-t border-white/10">Profile</Link>
              <button onClick={handleLogout} className="text-white py-2 border-t border-white/10 text-left">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
