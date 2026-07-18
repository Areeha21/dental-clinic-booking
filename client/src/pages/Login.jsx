import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const { token, user } = res.data.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      <div className="flex justify-center items-center py-16 px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-skyblue/30 rounded-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-xl font-semibold text-navy mb-6 text-center">
            Welcome back
          </h1>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:border-skyblue"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5 text-sm focus:outline-none focus:border-skyblue"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white py-2 rounded-md hover:bg-skyblue transition font-medium disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-skyblue hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
