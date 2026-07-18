import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    doctors: 0,
    services: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appointmentsRes, doctorsRes, servicesRes] = await Promise.all([
          api.get('/appointments/admin/all'),
          api.get('/doctors'),
          api.get('/services'),
        ]);
        const appointments = appointmentsRes.data.data;
        setStats({
          total: appointments.length,
          pending: appointments.filter((a) => a.status === 'pending').length,
          confirmed: appointments.filter((a) => a.status === 'confirmed').length,
          doctors: doctorsRes.data.data.length,
          services: servicesRes.data.data.length,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Appointments', value: stats.total },
    { label: 'Pending', value: stats.pending },
    { label: 'Confirmed', value: stats.confirmed },
    { label: 'Doctors', value: stats.doctors },
    { label: 'Services', value: stats.services },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-navy mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-skyblue/20 rounded-lg p-5 text-center"
          >
            <p className="text-3xl font-bold text-navy">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
