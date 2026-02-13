// Example utility test for price calculation
// This assumes you have a utility function for calculating prices

describe('Price Calculation Utils', () => {
  it('should calculate total price correctly', () => {
    const seatPrice = 10;
    const numberOfSeats = 3;
    const expectedTotal = 30;

    const calculateTotal = (price: number, seats: number) => price * seats;
    const total = calculateTotal(seatPrice, numberOfSeats);

    expect(total).toBe(expectedTotal);
  });

  it('should handle premium seat pricing', () => {
    const regularPrice = 10;
    const premiumMultiplier = 1.5;
    const expectedPremiumPrice = 15;

    const calculatePremiumPrice = (price: number, multiplier: number) => price * multiplier;
    const premiumPrice = calculatePremiumPrice(regularPrice, premiumMultiplier);

    expect(premiumPrice).toBe(expectedPremiumPrice);
  });

  it('should round to 2 decimal places', () => {
    const price = 10.999;
    const rounded = Math.round(price * 100) / 100;

    expect(rounded).toBe(11);
  });
});

