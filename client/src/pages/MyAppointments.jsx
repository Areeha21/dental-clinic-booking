import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  rescheduled: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-navy/10 text-navy',
};

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/my');
      setAppointments(res.data.data);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.patch(`/appointments/${id}/cancel`, { reason: 'Cancelled by patient' });
      fetchAppointments(); // refresh the list after cancelling
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-navy mb-8">My Appointments</h1>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {!loading && appointments.length === 0 && (
          <p className="text-gray-400 text-sm">You have no appointments yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white border border-skyblue/20 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-navy">{apt.service?.name}</p>
                <p className="text-sm text-gray-500">
                  {apt.doctor?.name} —{' '}
                  {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.startTime}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[apt.status]}`}
                >
                  {apt.status}
                </span>
                {['pending', 'confirmed'].includes(apt.status) && (
                  <button
                    onClick={() => handleCancel(apt._id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyAppointments;
