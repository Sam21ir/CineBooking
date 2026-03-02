import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSeats, toggleSeatSelection, clearSelectedSeats } from '../store/slices/seatsSlice';
import { Header } from '../app/components/Header';
import { Button } from '../app/components/ui/button';
import { calculateTotal, roundToTwoDecimals } from '../utils/priceCalculation';

export default function Booking() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { seats, selectedSeats, loading } = useAppSelector((state) => state.seats);
  const { selectedSession } = useAppSelector((state) => state.sessions);

  useEffect(() => {
    if (sessionId) {
      console.log('🪑 Fetching seats for sessionId:', sessionId);
      dispatch(fetchSeats(sessionId));
    }
    // Don't clear seats on unmount - they're needed for checkout
  }, [dispatch, sessionId]);
  
  useEffect(() => {
    console.log('🪑 Current seats:', seats.length, 'seats loaded');
    console.log('🪑 Session ID:', sessionId);
  }, [seats, sessionId]);

  const handleSeatClick = (seatId: string) => {
    dispatch(toggleSeatSelection(seatId));
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      navigate('/checkout');
    }
  };

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, typeof seats>);

  const getSeatColor = (seat: typeof seats[0]) => {
    if (seat.status === 'occupied') return 'bg-gray-700 cursor-not-allowed';
    if (selectedSeats.includes(seat.id)) return 'bg-red-600';
    if (seat.type === 'premium') return 'bg-yellow-600';
    if (seat.type === 'pmr') return 'bg-blue-600';
    return 'bg-gray-800 hover:bg-gray-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      <div className="container mx-auto px-3 sm:px-4 py-10 pt-24 sm:pt-28 md:pt-32">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center sm:text-left">
          Select Your Seats
        </h1>
        
        {loading ? (
          <div className="text-center text-white py-12">Loading seats...</div>
        ) : seats.length === 0 ? (
          <div className="text-center text-white py-12">
            <p className="text-xl mb-4">No seats available for this session</p>
            <Button onClick={() => navigate(-1)} className="bg-red-600 hover:bg-red-700">
              Go Back
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 sm:mb-8 flex justify-center px-1">
              <div className="bg-gray-900 px-4 sm:px-6 py-4 sm:py-6 rounded-lg w-full max-w-md">
                <div className="text-center mb-4 text-white font-semibold">Screen</div>
                <div className="w-full h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded"></div>
              </div>
            </div>

            <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
              <div className="inline-block space-y-3 sm:space-y-4">
                {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center gap-2 justify-center">
                    <div className="w-6 sm:w-8 text-white font-semibold text-center text-xs sm:text-sm">
                      {row}
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                      {rowSeats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => seat.status === 'available' && handleSeatClick(seat.id)}
                          disabled={seat.status === 'occupied'}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded ${getSeatColor(seat)} transition-colors text-white text-[10px] sm:text-xs`}
                          title={`${seat.row}${seat.number} - ${seat.type}`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 justify-center px-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-4 h-4 bg-gray-800 rounded"></div>
                <span className="text-white text-sm">Standard</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                <span className="text-white text-sm">Premium</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-white text-sm">PMR</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span className="text-white text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                <span className="text-white text-sm">Occupied</span>
              </div>
            </div>

            <div className="text-center px-3">
              <p className="text-white mb-4 text-sm sm:text-base">
                Selected: {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
                {selectedSession && (
                  <span className="ml-4">
                    Total: {roundToTwoDecimals(calculateTotal(selectedSession.price, selectedSeats.length)).toFixed(2)} €
                  </span>
                )}
              </p>
              <Button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                Continuer
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

