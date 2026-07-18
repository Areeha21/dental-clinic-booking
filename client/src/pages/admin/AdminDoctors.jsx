import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', specialization: '', bio: '' });
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    const res = await api.get('/doctors');
    setDoctors(res.data.data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/doctors', form);
      setForm({ name: '', specialization: '', bio: '' });
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor.');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this doctor?')) return;
    await api.delete(`/doctors/${id}`);
    fetchDoctors();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-navy">Doctors</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-navy text-white px-4 py-2 rounded-md text-sm hover:bg-skyblue transition"
        >
          {showForm ? 'Cancel' : '+ Add Doctor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-skyblue/20 rounded-lg p-5 mb-6">
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <input
            type="text"
            placeholder="Doctor name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
          />
          <input
            type="text"
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
          />
          <textarea
            placeholder="Short bio (optional)"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
          />
          <button className="bg-navy text-white px-4 py-2 rounded-md text-sm hover:bg-skyblue transition">
            Save Doctor
          </button>
        </form>
      )}

      <div className="bg-white border border-skyblue/20 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Specialization</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-navy font-medium">{doc.name}</td>
                <td className="px-4 py-3">{doc.specialization}</td>
                <td className="px-4 py-3">{doc.status}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeactivate(doc._id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminDoctors;
