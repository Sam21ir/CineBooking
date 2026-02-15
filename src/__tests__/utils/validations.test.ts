// Validation utility functions tests

describe('Validation Utils', () => {
  describe('Email Validation', () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email);
    };

    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('invalid@.com')).toBe(false);
      expect(isValidEmail('invalid@com')).toBe(false);
    });
  });

  describe('Required Field Validation', () => {
    const isRequired = (value: string | null | undefined): boolean => {
      return value !== null && value !== undefined && value.trim() !== '';
    };

    it('should validate non-empty strings', () => {
      expect(isRequired('test')).toBe(true);
      expect(isRequired('  test  ')).toBe(true);
    });

    it('should reject empty or whitespace-only strings', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('Name Validation', () => {
    const isValidName = (name: string): boolean => {
      return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
    };

    it('should validate correct names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('Jean-Pierre')).toBe(true);
      expect(isValidName("O'Brien")).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('A')).toBe(false); // Too short
      expect(isValidName('John123')).toBe(false); // Contains numbers
      expect(isValidName('John@Doe')).toBe(false); // Contains special chars
    });
  });

  describe('Seat Selection Validation', () => {
    const validateSeatSelection = (selectedSeats: string[], maxSeats: number = 10): boolean => {
      return selectedSeats.length > 0 && selectedSeats.length <= maxSeats;
    };

    it('should validate correct seat selections', () => {
      expect(validateSeatSelection(['A1', 'A2'])).toBe(true);
      expect(validateSeatSelection(['A1'])).toBe(true);
      expect(validateSeatSelection(['A1', 'A2', 'A3', 'A4', 'A5'])).toBe(true);
    });

    it('should reject invalid seat selections', () => {
      expect(validateSeatSelection([])).toBe(false);
      expect(validateSeatSelection(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11'], 10)).toBe(false);
    });
  });

  describe('Price Validation', () => {
    const isValidPrice = (price: number): boolean => {
      return price > 0 && price <= 1000 && Number.isFinite(price);
    };

    it('should validate correct prices', () => {
      expect(isValidPrice(12.50)).toBe(true);
      expect(isValidPrice(1)).toBe(true);
      expect(isValidPrice(1000)).toBe(true);
    });

    it('should reject invalid prices', () => {
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-10)).toBe(false);
      expect(isValidPrice(1001)).toBe(false);
      expect(isValidPrice(NaN)).toBe(false);
      expect(isValidPrice(Infinity)).toBe(false);
    });
  });

  describe('Date Validation', () => {
    const isValidDate = (dateString: string): boolean => {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) && date >= new Date();
    };

    it('should validate future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isValidDate(futureDate.toISOString())).toBe(true);
    });

    it('should reject past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(isValidDate(pastDate.toISOString())).toBe(false);
    });

    it('should reject invalid date strings', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('')).toBe(false);
    });
  });
});

