import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-navy mb-8">My Profile</h1>
        <div className="bg-white border border-skyblue/20 rounded-lg p-6">
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase">Name</p>
            <p className="text-navy font-medium">{user?.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase">Email</p>
            <p className="text-navy font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Account type</p>
            <p className="text-navy font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
