import { describe, it, expect } from '@jest/globals';
import { cn } from '../utils';

describe('Utils Library', () => {
  describe('cn function', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
    });

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid');
    });

    it('should handle empty strings', () => {
      expect(cn('base', '', 'valid')).toBe('base valid');
    });

    it('should merge Tailwind classes correctly', () => {
      expect(cn('p-4 p-2')).toBe('p-2');
    });

    it('should handle complex combinations', () => {
      const result = cn(
        'base-class',
        'text-red-500',
        true && 'active',
        false && 'hidden',
        { 'conditional': true, 'another': false },
        ['array-class1', 'array-class2']
      );
      expect(result).toContain('base-class');
      expect(result).toContain('text-red-500');
      expect(result).toContain('active');
      expect(result).toContain('conditional');
      expect(result).toContain('array-class1');
      expect(result).toContain('array-class2');
      expect(result).not.toContain('hidden');
      expect(result).not.toContain('another');
    });
  });
});