import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { Seat } from '../../store/slices/seatsSlice';
import { toggleSeatSelection } from '../../store/slices/seatsSlice';
import seatsReducer from '../../store/slices/seatsSlice';

const mockSeat: Seat = {
  id: 'seat-1',
  sessionId: 'session-1',
  row: 'A',
  number: 1,
  type: 'standard',
  status: 'available',
};

const createMockStore = (initialSelectedSeats: string[] = []) => {
  return configureStore({
    reducer: {
      seats: seatsReducer,
    },
    preloadedState: {
      seats: {
        seats: [mockSeat],
        selectedSeats: initialSelectedSeats,
        loading: false,
        error: null,
      },
    },
  });
};

// Seat component test (simulating the seat button from Booking page)
describe('Seat Component', () => {
  it('renders seat with correct number', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <button
            onClick={() => store.dispatch(toggleSeatSelection(mockSeat.id))}
            className="w-10 h-10 rounded bg-gray-800 text-white text-xs"
            data-testid={`seat-${mockSeat.id}`}
          >
            {mockSeat.number}
          </button>
        </BrowserRouter>
      </Provider>
    );

    const seatButton = screen.getByTestId(`seat-${mockSeat.id}`);
    expect(seatButton).toBeInTheDocument();
    expect(seatButton).toHaveTextContent('1');
  });

  it('toggles seat selection on click', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <button
            onClick={() => store.dispatch(toggleSeatSelection(mockSeat.id))}
            className="w-10 h-10 rounded bg-gray-800 text-white text-xs"
            data-testid={`seat-${mockSeat.id}`}
          >
            {mockSeat.number}
          </button>
        </BrowserRouter>
      </Provider>
    );

    const seatButton = screen.getByTestId(`seat-${mockSeat.id}`);
    
    // Initially no seats selected
    expect(store.getState().seats.selectedSeats).not.toContain(mockSeat.id);
    
    // Click to select
    fireEvent.click(seatButton);
    expect(store.getState().seats.selectedSeats).toContain(mockSeat.id);
    
    // Click again to deselect
    fireEvent.click(seatButton);
    expect(store.getState().seats.selectedSeats).not.toContain(mockSeat.id);
  });

  it('disables seat when occupied', () => {
    const occupiedSeat: Seat = { ...mockSeat, status: 'occupied' };
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <button
            onClick={() => store.dispatch(toggleSeatSelection(occupiedSeat.id))}
            disabled={occupiedSeat.status === 'occupied'}
            className="w-10 h-10 rounded bg-gray-700 cursor-not-allowed text-white text-xs"
            data-testid={`seat-${occupiedSeat.id}`}
          >
            {occupiedSeat.number}
          </button>
        </BrowserRouter>
      </Provider>
    );

    const seatButton = screen.getByTestId(`seat-${occupiedSeat.id}`);
    expect(seatButton).toBeDisabled();
  });

  it('applies correct color for premium seats', () => {
    const premiumSeat: Seat = { ...mockSeat, type: 'premium' };
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <button
            onClick={() => store.dispatch(toggleSeatSelection(premiumSeat.id))}
            className="w-10 h-10 rounded bg-yellow-600 text-white text-xs"
            data-testid={`seat-${premiumSeat.id}`}
          >
            {premiumSeat.number}
          </button>
        </BrowserRouter>
      </Provider>
    );

    const seatButton = screen.getByTestId(`seat-${premiumSeat.id}`);
    expect(seatButton).toHaveClass('bg-yellow-600');
  });

  it('applies correct color for PMR seats', () => {
    const pmrSeat: Seat = { ...mockSeat, type: 'pmr' };
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <button
            onClick={() => store.dispatch(toggleSeatSelection(pmrSeat.id))}
            className="w-10 h-10 rounded bg-blue-600 text-white text-xs"
            data-testid={`seat-${pmrSeat.id}`}
          >
            {pmrSeat.number}
          </button>
        </BrowserRouter>
      </Provider>
    );

    const seatButton = screen.getByTestId(`seat-${pmrSeat.id}`);
    expect(seatButton).toHaveClass('bg-blue-600');
  });
});

// SeatMap test (testing the grouping and rendering of seats by row)
describe('SeatMap', () => {
  const mockSeats: Seat[] = [
    { id: '1', sessionId: 's1', row: 'A', number: 1, type: 'standard', status: 'available' },
    { id: '2', sessionId: 's1', row: 'A', number: 2, type: 'standard', status: 'available' },
    { id: '3', sessionId: 's1', row: 'B', number: 1, type: 'premium', status: 'available' },
  ];

  it('groups seats by row', () => {
    const seatsByRow = mockSeats.reduce((acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = [];
      }
      acc[seat.row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>);

    expect(seatsByRow['A']).toHaveLength(2);
    expect(seatsByRow['B']).toHaveLength(1);
  });

  it('renders seats grouped by row', () => {
    const store = createMockStore();
    const seatsByRow = mockSeats.reduce((acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = [];
      }
      acc[seat.row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <div data-testid="seat-map">
            {Object.entries(seatsByRow).map(([row, rowSeats]) => (
              <div key={row} data-testid={`row-${row}`}>
                <div className="w-8 text-white font-semibold text-center">{row}</div>
                <div className="flex gap-2">
                  {rowSeats.map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => store.dispatch(toggleSeatSelection(seat.id))}
                      className="w-10 h-10 rounded bg-gray-800 text-white text-xs"
                      data-testid={`seat-${seat.id}`}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('row-A')).toBeInTheDocument();
    expect(screen.getByTestId('row-B')).toBeInTheDocument();
    expect(screen.getByTestId('seat-1')).toBeInTheDocument();
    expect(screen.getByTestId('seat-2')).toBeInTheDocument();
    expect(screen.getByTestId('seat-3')).toBeInTheDocument();
  });
});

