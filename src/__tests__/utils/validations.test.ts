import {
  isRequired,
  isValidDate,
  isValidEmail,
  isValidName,
  isValidPrice,
  validateSeatSelection,
} from '../../utils/validations';

// Validation utility functions tests
describe('Validation Utils', () => {
  describe('Email Validation', () => {
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

