import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Stars from './components/Stars';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Planets from './pages/Planets';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Stars />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planets" element={<Planets />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
