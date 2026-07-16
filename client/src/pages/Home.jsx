import { useEffect, useState } from 'react';
import api from '../services/api';

function Home() {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await api.get('/services');
        const doctorsRes = await api.get('/doctors');
        setServices(servicesRes.data.data);
        setDoctors(doctorsRes.data.data);
      } catch (err) {
        console.error('Failed to load home page data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <span className="text-lg font-semibold text-gray-900">Rashid Dental Clinic</span>
        <div className="flex gap-4 text-sm text-gray-600">
          <button className="hover:text-gray-900">Login</button>
          <button className="hover:text-gray-900">Register</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Your smile, our priority
        </h1>
        <p className="text-gray-600 mb-6">
          Book a dental appointment in minutes.
        </p>
        <button className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition">
          Book Appointment
        </button>
      </section>

      {/* Services */}
      <section className="px-6 py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Our Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {services.length === 0 && (
            <p className="text-gray-400 text-sm">No services available yet.</p>
          )}
          {services.map((service) => (
            <div
              key={service._id}
              className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <p className="font-medium text-gray-900">{service.name}</p>
              <p className="text-sm text-gray-500 mt-1">Rs. {service.price}</p>
              <p className="text-xs text-gray-400">{service.durationMinutes} min</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section className="px-6 py-12 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Our Doctors</h2>
        <div className="flex gap-4 flex-wrap">
          {doctors.length === 0 && (
            <p className="text-gray-400 text-sm">No doctors available yet.</p>
          )}
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="border border-gray-200 rounded-lg p-4 text-center flex-1 min-w-[160px] bg-white"
            >
              <p className="font-medium text-gray-900">{doctor.name}</p>
              <p className="text-sm text-gray-500">{doctor.specialization}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
