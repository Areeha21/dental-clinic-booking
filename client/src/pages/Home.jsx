import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import heroImage from '../assets/hero.jpg';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      {/* Hero with image */}
      <section className="relative">
        <img
          src={heroImage}
          alt="Bright modern dental clinic treatment room"
          className="w-full h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl font-bold text-white mb-3">
            Your smile, our priority
          </h1>
          <p className="text-white/90 mb-6">
            Book a dental appointment in minutes.
          </p>
          <Link
            to="/book"
            className="bg-skyblue text-white px-6 py-2 rounded-md hover:bg-white hover:text-navy transition font-medium"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-12">
        <h2 className="text-xl font-semibold text-navy mb-6">Our Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {services.length === 0 && (
            <p className="text-gray-400 text-sm">No services available yet.</p>
          )}
          {services.map((service) => (
            <div
              key={service._id}
              className="border border-skyblue/30 bg-white rounded-lg p-4 text-center hover:shadow-md hover:border-skyblue transition"
            >
              <p className="font-medium text-navy">{service.name}</p>
              <p className="text-sm text-skyblue mt-1">Rs. {service.price}</p>
              <p className="text-xs text-gray-400">{service.durationMinutes} min</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section className="px-6 py-12 bg-navy/5">
        <h2 className="text-xl font-semibold text-navy mb-6">Our Doctors</h2>
        <div className="flex gap-4 flex-wrap">
          {doctors.length === 0 && (
            <p className="text-gray-400 text-sm">No doctors available yet.</p>
          )}
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="border border-skyblue/30 rounded-lg p-4 text-center flex-1 min-w-[160px] bg-white"
            >
              <p className="font-medium text-navy">{doctor.name}</p>
              <p className="text-sm text-gray-500">{doctor.specialization}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
