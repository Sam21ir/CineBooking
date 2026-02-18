import {
  calculatePremiumPrice,
  calculateSeatPrice,
  calculateTotal,
  roundToTwoDecimals,
} from '../../utils/priceCalculation';

// Price calculation utility functions tests
describe('Price Calculation Utils', () => {
  it('should calculate total price correctly', () => {
    const seatPrice = 10;
    const numberOfSeats = 3;
    const expectedTotal = 30;

    const total = calculateTotal(seatPrice, numberOfSeats);

    expect(total).toBe(expectedTotal);
  });

  it('should handle zero seats', () => {
    const seatPrice = 10;
    const numberOfSeats = 0;
    const total = calculateTotal(seatPrice, numberOfSeats);

    expect(total).toBe(0);
  });

  it('should handle premium seat pricing', () => {
    const regularPrice = 10;
    const premiumMultiplier = 1.5;
    const expectedPremiumPrice = 15;

    const premiumPrice = calculatePremiumPrice(regularPrice, premiumMultiplier);

    expect(premiumPrice).toBe(expectedPremiumPrice);
  });

  it('should round to 2 decimal places', () => {
    const price = 10.999;
    const rounded = roundToTwoDecimals(price);

    expect(rounded).toBe(11);
  });

  it('should handle decimal prices correctly', () => {
    const price = 12.50;
    const seats = 2;
    const total = calculateTotal(price, seats);

    expect(total).toBe(25);
  });

  it('should calculate seat price by type', () => {
    const basePrice = 10;

    expect(calculateSeatPrice(basePrice, 'standard')).toBe(10);
    expect(calculateSeatPrice(basePrice, 'premium')).toBe(15);
    expect(calculateSeatPrice(basePrice, 'pmr')).toBe(10);
  });

  it('should calculate total for mixed seat types', () => {
    const basePrice = 10;
    const standardSeats = 2;
    const premiumSeats = 1;

    const standardTotal = calculateSeatPrice(basePrice, 'standard') * standardSeats;
    const premiumTotal = calculateSeatPrice(basePrice, 'premium') * premiumSeats;
    const grandTotal = roundToTwoDecimals(standardTotal + premiumTotal);

    expect(grandTotal).toBe(35);
  });

  it('should handle very small prices', () => {
    const price = 0.01;
    const seats = 1;
    const total = calculateTotal(price, seats);

    expect(total).toBe(0.01);
  });

  it('should handle large quantities', () => {
    const price = 12.50;
    const seats = 100;
    const total = calculateTotal(price, seats);

    expect(total).toBe(1250);
  });
});

