import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', durationMinutes: '', price: '' });
  const [error, setError] = useState('');

  const fetchServices = async () => {
    const res = await api.get('/services');
    setServices(res.data.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/services', {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
      });
      setForm({ name: '', description: '', durationMinutes: '', price: '' });
      setShowForm(false);
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service.');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this service?')) return;
    await api.delete(`/services/${id}`);
    fetchServices();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-navy">Services</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-navy text-white px-4 py-2 rounded-md text-sm hover:bg-skyblue transition"
        >
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-skyblue/20 rounded-lg p-5 mb-6">
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <input
            type="text"
            placeholder="Service name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm"
          />
          <div className="flex gap-3 mb-3">
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              required
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Price (Rs.)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button className="bg-navy text-white px-4 py-2 rounded-md text-sm hover:bg-skyblue transition">
            Save Service
          </button>
        </form>
      )}

      <div className="bg-white border border-skyblue/20 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={svc._id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-navy font-medium">{svc.name}</td>
                <td className="px-4 py-3">Rs. {svc.price}</td>
                <td className="px-4 py-3">{svc.durationMinutes} min</td>
                <td className="px-4 py-3">{svc.status}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeactivate(svc._id)}
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

export default AdminServices;
