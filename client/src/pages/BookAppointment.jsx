import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function BookAppointment() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [reason, setReason] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const servicesRes = await api.get('/services');
      const doctorsRes = await api.get('/doctors');
      setServices(servicesRes.data.data);
      setDoctors(doctorsRes.data.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/appointments', {
        doctor: selectedDoctor._id,
        service: selectedService._id,
        appointmentDate,
        startTime,
        reason,
      });
      setSuccess('Appointment request submitted successfully!');
      setTimeout(() => navigate('/my-appointments'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  // Today's date in YYYY-MM-DD format, used to block past dates in the date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-navy mb-8">Book an Appointment</h1>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded ${s <= step ? 'bg-skyblue' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        {/* Step 1: choose service */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-medium text-navy mb-4">Step 1 — Choose a service</h2>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <button
                  key={service._id}
                  onClick={() => setSelectedService(service)}
                  className={`border rounded-lg p-4 text-left transition ${
                    selectedService?._id === service._id
                      ? 'border-navy bg-navy/5'
                      : 'border-gray-200 hover:border-skyblue'
                  }`}
                >
                  <p className="font-medium text-navy">{service.name}</p>
                  <p className="text-sm text-gray-500">
                    Rs. {service.price} — {service.durationMinutes} min
                  </p>
                </button>
              ))}
            </div>
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="mt-6 bg-navy text-white px-5 py-2 rounded-md hover:bg-skyblue transition disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: choose doctor */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-medium text-navy mb-4">Step 2 — Choose a doctor</h2>
            <div className="grid grid-cols-2 gap-3">
              {doctors.map((doctor) => (
                <button
                  key={doctor._id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`border rounded-lg p-4 text-left transition ${
                    selectedDoctor?._id === doctor._id
                      ? 'border-navy bg-navy/5'
                      : 'border-gray-200 hover:border-skyblue'
                  }`}
                >
                  <p className="font-medium text-navy">{doctor.name}</p>
                  <p className="text-sm text-gray-500">{doctor.specialization}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                disabled={!selectedDoctor}
                onClick={() => setStep(3)}
                className="bg-navy text-white px-5 py-2 rounded-md hover:bg-skyblue transition disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: date, time, reason, confirm */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-medium text-navy mb-4">Step 3 — Choose date and time</h2>

            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              min={today}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm"
            />

            <label className="block text-sm text-gray-600 mb-1">Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm"
            />

            <label className="block text-sm text-gray-600 mb-1">
              Reason for visit (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm"
              placeholder="Briefly describe your reason for visiting"
            />

            <div className="bg-navy/5 rounded-md p-4 mb-4 text-sm text-gray-700">
              <p><strong>Service:</strong> {selectedService?.name}</p>
              <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                disabled={!appointmentDate || !startTime || loading}
                onClick={handleSubmit}
                className="bg-navy text-white px-5 py-2 rounded-md hover:bg-skyblue transition disabled:opacity-40"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookAppointment;
