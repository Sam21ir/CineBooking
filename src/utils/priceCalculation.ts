export type SeatType = 'standard' | 'premium' | 'pmr';

export function calculateTotal(price: number, seats: number): number {
  return price * seats;
}

export function calculatePremiumPrice(basePrice: number, multiplier: number = 1.5): number {
  return basePrice * multiplier;
}

export function roundToTwoDecimals(price: number): number {
  return Math.round(price * 100) / 100;
}

export function calculateSeatPrice(basePrice: number, seatType: SeatType): number {
  const multipliers: Record<SeatType, number> = {
    standard: 1,
    premium: 1.5,
    pmr: 1, // PMR seats same price as standard
  };
  return basePrice * multipliers[seatType];
}


