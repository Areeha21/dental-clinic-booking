import { useEffect, useState } from 'react';
import api from '../services/api';

// This is a temporary test page — not a final design.
// Its only job is to prove the React app can successfully fetch
// real data from your Express backend.
function ConnectionTest() {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch both lists as soon as the page loads
    const fetchData = async () => {
      try {
        const doctorsRes = await api.get('/doctors');
        const servicesRes = await api.get('/services');
        setDoctors(doctorsRes.data.data);
        setServices(servicesRes.data.data);
      } catch (err) {
        setError('Could not connect to the backend. Is node server.js running?');
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Connection Test</h1>

      <h2>Doctors ({doctors.length})</h2>
      <ul>
        {doctors.map((doc) => (
          <li key={doc._id}>{doc.name} — {doc.specialization}</li>
        ))}
      </ul>

      <h2>Services ({services.length})</h2>
      <ul>
        {services.map((svc) => (
          <li key={svc._id}>{svc.name} — Rs. {svc.price} ({svc.durationMinutes} min)</li>
        ))}
      </ul>
    </div>
  );
}

export default ConnectionTest;
