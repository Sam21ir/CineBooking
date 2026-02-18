export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function isRequired(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== '';
}

/**
 * Loose "human name" validation for demo apps:
 * - minimum 2 characters (after trim)
 * - allows letters, spaces, apostrophe and hyphen
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
}

export function validateSeatSelection(selectedSeats: string[], maxSeats: number = 10): boolean {
  return selectedSeats.length > 0 && selectedSeats.length <= maxSeats;
}

export function isValidPrice(price: number): boolean {
  return price > 0 && price <= 1000 && Number.isFinite(price);
}

export function isValidDate(dateString: string, now: Date = new Date()): boolean {
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime()) && date >= now;
}


