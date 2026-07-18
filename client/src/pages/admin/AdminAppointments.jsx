import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  rescheduled: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-navy/10 text-navy',
};

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', doctor: '' });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.doctor) params.doctor = filters.doctor;
      const res = await api.get('/appointments/admin/all', { params });
      setAppointments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/doctors').then((res) => setDoctors(res.data.data));
  }, []);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/appointments/admin/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-navy mb-6">Appointments</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.doctor}
          onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All doctors</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>{doc.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {!loading && appointments.length === 0 && (
        <p className="text-gray-400 text-sm">No appointments found.</p>
      )}

      <div className="bg-white border border-skyblue/20 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy/5 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Date / Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <p className="text-navy font-medium">{apt.patient?.name}</p>
                  <p className="text-gray-400 text-xs">{apt.patient?.phone}</p>
                </td>
                <td className="px-4 py-3">{apt.doctor?.name}</td>
                <td className="px-4 py-3">{apt.service?.name}</td>
                <td className="px-4 py-3">
                  {new Date(apt.appointmentDate).toLocaleDateString()} {apt.startTime}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[apt.status]}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(apt._id, 'confirmed')}
                        className="text-green-600 hover:underline text-xs"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(apt._id, 'rejected')}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {apt.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(apt._id, 'completed')}
                        className="text-navy hover:underline text-xs"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => handleStatusChange(apt._id, 'cancelled')}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminAppointments;
