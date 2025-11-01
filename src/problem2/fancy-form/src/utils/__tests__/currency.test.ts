import { describe, it, expect } from '@jest/globals';
import {
  getTokenImage,
  getDefaultTokenImage,
  formatAmount,
  parseAmount,
  validateAmount,
} from '../currency';

describe('Currency Utilities', () => {
  describe('getTokenImage', () => {
    it('should return correct token image path', () => {
      expect(getTokenImage('BTC')).toBe('/src/assets/tokens/BTC.svg');
      expect(getTokenImage('ETH')).toBe('/src/assets/tokens/ETH.svg');
      expect(getTokenImage('USD')).toBe('/src/assets/tokens/USD.svg');
    });

    it('should handle empty currency string', () => {
      expect(getTokenImage('')).toBe('/src/assets/tokens/.svg');
    });
  });

  describe('getDefaultTokenImage', () => {
    it('should return default react.svg path', () => {
      expect(getDefaultTokenImage()).toBe('/src/assets/react.svg');
    });
  });

  describe('formatAmount', () => {
    it('should format whole numbers with commas', () => {
      expect(formatAmount('1000')).toBe('1,000');
      expect(formatAmount('1000000')).toBe('1,000,000');
      expect(formatAmount('123456789')).toBe('123,456,789');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatAmount('1000.50')).toBe('1,000.50');
      expect(formatAmount('1234567.89')).toBe('1,234,567.89');
      expect(formatAmount('123.456789')).toBe('123.456789');
    });

    it('should handle numbers without formatting needed', () => {
      expect(formatAmount('123')).toBe('123');
      expect(formatAmount('12.34')).toBe('12.34');
      expect(formatAmount('0')).toBe('0');
    });

    it('should clean non-digit characters except decimal point', () => {
      expect(formatAmount('1000abc')).toBe('1,000');
      expect(formatAmount('1000.50xyz')).toBe('1,000.50');
      expect(formatAmount('a1b2c3d')).toBe('123');
    });

    it('should handle multiple decimal points', () => {
      expect(formatAmount('123.45.67')).toBe('123.4567');
      expect(formatAmount('1.2.3.4')).toBe('1.234');
    });

    it('should handle empty string', () => {
      expect(formatAmount('')).toBe('');
    });

    it('should handle single decimal point', () => {
      expect(formatAmount('.')).toBe('.');
      expect(formatAmount('123.')).toBe('123.');
      expect(formatAmount('.123')).toBe('.123');
    });
  });

  describe('parseAmount', () => {
    it('should parse formatted numbers correctly', () => {
      expect(parseAmount('1,000')).toBe(1000);
      expect(parseAmount('1,000,000')).toBe(1000000);
      expect(parseAmount('123,456.789')).toBe(123456.789);
    });

    it('should parse unformatted numbers', () => {
      expect(parseAmount('1000')).toBe(1000);
      expect(parseAmount('123.456')).toBe(123.456);
      expect(parseAmount('0')).toBe(0);
    });

    it('should handle invalid inputs', () => {
      expect(parseAmount('')).toBe(0);
      expect(parseAmount('abc')).toBe(0);
      expect(parseAmount('.')).toBe(0);
    });

    it('should handle decimal numbers', () => {
      expect(parseAmount('0.5')).toBe(0.5);
      expect(parseAmount('123.456')).toBe(123.456);
      expect(parseAmount('1,234.56')).toBe(1234.56);
    });
  });

  describe('validateAmount', () => {
    it('should return empty string for valid amounts', () => {
      expect(validateAmount('1000')).toBe('');
      expect(validateAmount('1,000')).toBe('');
      expect(validateAmount('1,000.50')).toBe('');
      expect(validateAmount('0.5')).toBe('');
      expect(validateAmount('123.456')).toBe('');
    });

    it('should return empty string for empty input', () => {
      expect(validateAmount('')).toBe('');
      expect(validateAmount('   ')).toBe('');
    });

    it('should reject amounts starting with comma or period', () => {
      expect(validateAmount(',123')).toBe('Amount must not start with comma or period');
      expect(validateAmount('.123')).toBe('Amount must not start with comma or period');
      expect(validateAmount(' ,123')).toBe('Amount must not start with comma or period');
    });

    it('should reject invalid formats', () => {
      expect(validateAmount('abc')).toBe('Invalid amount format. Use digits, commas for thousands, and one decimal point');
      expect(validateAmount('123abc')).toBe('Invalid amount format. Use digits, commas for thousands, and one decimal point');
      expect(validateAmount('12.34.56')).toBe('Invalid amount format. Use digits, commas for thousands, and one decimal point');
    });

    it('should reject amounts not starting with valid digits', () => {
      expect(validateAmount('0123')).toBe('Amount must start with a number greater than 0 (e.g., 1, 2, 0.5)');
      expect(validateAmount('00.5')).toBe('Amount must start with a number greater than 0 (e.g., 1, 2, 0.5)');
    });

    it('should accept amounts starting with 0.', () => {
      expect(validateAmount('0.5')).toBe('');
      expect(validateAmount('0.123')).toBe('');
    });

    it('should reject zero or negative amounts', () => {
      expect(validateAmount('0')).toBe('Amount must start with a number greater than 0 (e.g., 1, 2, 0.5)');
      expect(validateAmount('0.0')).toBe('Amount must be greater than 0');
    });

    it('should reject invalid comma placement', () => {
      expect(validateAmount('1,2345')).toBe('Invalid comma placement. Use commas for thousands separator');
      expect(validateAmount('12,3456')).toBe('Invalid comma placement. Use commas for thousands separator');
    });

    it('should accept valid comma placement', () => {
      expect(validateAmount('1,000')).toBe('');
      expect(validateAmount('1,000,000')).toBe('');
      expect(validateAmount('1,000.50')).toBe('');
    });

    it('should handle edge cases', () => {
      expect(validateAmount('1')).toBe('');
      expect(validateAmount('9')).toBe('');
      expect(validateAmount('10')).toBe('');
      expect(validateAmount('999')).toBe('');
    });
  });
});