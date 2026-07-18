import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Appointments', path: '/admin/appointments' },
  { label: 'Doctors', path: '/admin/doctors' },
  { label: 'Services', path: '/admin/services' },
];

function AdminLayout({ children }) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Sidebar */}
      <aside className="w-56 bg-navy text-white flex flex-col">
        <div className="px-5 py-5 font-semibold border-b border-white/10">
          Rashid Dental — Admin
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm transition ${
                location.pathname === item.path
                  ? 'bg-skyblue text-white'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="px-5 py-4 text-sm text-white/70 hover:text-white border-t border-white/10 text-left"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}

export default AdminLayout;
