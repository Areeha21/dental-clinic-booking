import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* More routes get added here as we build each page:
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/login" element={<Login />} />
          etc. */}
    </Routes>
  );
}

export default App;
