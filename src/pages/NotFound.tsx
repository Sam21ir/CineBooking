import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Header } from '../app/components/Header';
import { Button } from '../app/components/ui/button';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      <div className="container mx-auto px-4 py-12 pt-32 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

