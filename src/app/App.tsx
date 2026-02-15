import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from '../pages/Home';
import Movies from '../pages/Movies';
import Populaires from '../pages/Populaires';
import MaListe from '../pages/MaListe';
import MovieDetails from '../pages/MovieDetails';
import Sessions from '../pages/Sessions';
import Booking from '../pages/Booking';
import Checkout from '../pages/Checkout';
import Confirmation from '../pages/Confirmation';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  const location = useLocation();

  return (
    <div className="overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/populaires" element={<Populaires />} />
        <Route path="/ma-liste" element={<MaListe />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/sessions/:id" element={<Sessions />} />
        <Route path="/booking/:sessionId" element={<Booking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
    </div>
  );
}
