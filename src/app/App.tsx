import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Route-based code splitting (improves initial load and reduces main bundle size)
const Home = lazy(() => import('../pages/Home'));
const Movies = lazy(() => import('../pages/Movies'));
const Populaires = lazy(() => import('../pages/Populaires'));
const MaListe = lazy(() => import('../pages/MaListe'));
const MovieDetails = lazy(() => import('../pages/MovieDetails'));
const Sessions = lazy(() => import('../pages/Sessions'));
const Booking = lazy(() => import('../pages/Booking'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Confirmation = lazy(() => import('../pages/Confirmation'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  const location = useLocation();

  return (
    <div className="overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
              Loading...
            </div>
          }
        >
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
        </Suspense>
    </AnimatePresence>
    </div>
  );
}
