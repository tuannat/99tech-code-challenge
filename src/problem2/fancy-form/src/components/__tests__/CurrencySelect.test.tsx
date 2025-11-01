import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencySelect } from '../CurrencySelect';

// Mock the currency utilities
jest.mock('../../utils/currency', () => ({
  getTokenImage: jest.fn((currency: string) => `/src/assets/tokens/${currency}.svg`),
  getDefaultTokenImage: jest.fn(() => '/src/assets/react.svg'),
}));

const mockCurrencies = ['USD', 'BTC', 'ETH', 'ADA', 'USDT'];

describe('CurrencySelect Component', () => {
  const defaultProps = {
    value: 'USD',
    onChange: jest.fn(),
    currencies: mockCurrencies,
    label: 'From',
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct label', () => {
    render(<CurrencySelect {...defaultProps} />);
    
    expect(screen.getByText('From')).toBeInTheDocument();
  });

  it('should display current selected value', () => {
    render(<CurrencySelect {...defaultProps} />);
    
    expect(screen.getByDisplayValue('USD')).toBeInTheDocument();
  });

  it('should render token image for selected currency', () => {
    render(<CurrencySelect {...defaultProps} />);
    
    const image = screen.getByAltText('USD');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/src/assets/tokens/USD.svg');
  });

  it('should show placeholder when no value selected', () => {
    render(<CurrencySelect {...defaultProps} value="" />);
    
    expect(screen.getByText('Select currency')).toBeInTheDocument();
  });

  it('should open dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<CurrencySelect {...defaultProps} />);
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    
    await waitFor(() => {
      mockCurrencies.forEach(currency => {
        expect(screen.getByText(currency)).toBeInTheDocument();
      });
    });
  });

  it('should call onChange when currency is selected', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<CurrencySelect {...defaultProps} onChange={mockOnChange} />);
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('BTC')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('BTC'));
    
    expect(mockOnChange).toHaveBeenCalledWith('BTC');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<CurrencySelect {...defaultProps} disabled={true} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('should apply disabled styles when disabled', () => {
    render(<CurrencySelect {...defaultProps} disabled={true} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('should render all currencies in dropdown', async () => {
    const user = userEvent.setup();
    render(<CurrencySelect {...defaultProps} />);
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    
    await waitFor(() => {
      mockCurrencies.forEach(currency => {
        expect(screen.getByText(currency)).toBeInTheDocument();
      });
    });
  });

  it('should handle empty currencies array', () => {
    render(<CurrencySelect {...defaultProps} currencies={[]} />);
    
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should use fallback image when token image fails to load', () => {
    render(<CurrencySelect {...defaultProps} />);
    
    const image = screen.getByAltText('USD');
    
    // Simulate image load error
    fireEvent.error(image);
    
    expect(image).toHaveAttribute('src', '/src/assets/react.svg');
  });

  it('should render with custom label', () => {
    render(<CurrencySelect {...defaultProps} label="To" />);
    
    expect(screen.getByText('To')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(<CurrencySelect {...defaultProps} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass(
      'w-full',
      'rounded-xl',
      'bg-white',
      'text-gray-900',
      'border-0',
      'h-14',
      'px-4',
      'focus:ring-2',
      'focus:ring-purple-300'
    );
  });

  it('should display label with correct styling', () => {
    render(<CurrencySelect {...defaultProps} />);
    
    const label = screen.getByText('From');
    expect(label).toHaveClass(
      'text-sm',
      'font-medium',
      'text-white',
      'uppercase',
      'tracking-wide',
      'block'
    );
  });

  it('should handle very long currency list', async () => {
    const longCurrencyList = Array.from({ length: 100 }, (_, i) => `CURR${i}`);
    const user = userEvent.setup();
    
    render(<CurrencySelect {...defaultProps} currencies={longCurrencyList} />);
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('CURR0')).toBeInTheDocument();
      expect(screen.getByText('CURR99')).toBeInTheDocument();
    });
  });

  it('should maintain selection state correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    const { rerender } = render(
      <CurrencySelect {...defaultProps} value="USD" onChange={mockOnChange} />
    );
    
    expect(screen.getByDisplayValue('USD')).toBeInTheDocument();
    
    // Simulate parent component updating the value
    rerender(
      <CurrencySelect {...defaultProps} value="BTC" onChange={mockOnChange} />
    );
    
    expect(screen.getByDisplayValue('BTC')).toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <CurrencySelect {...defaultProps} />
        <button>Outside</button>
      </div>
    );
    
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    
    await waitFor(() => {
      expect(screen.getByText('BTC')).toBeInTheDocument();
    });
    
    // Click outside
    await user.click(screen.getByText('Outside'));
    
    await waitFor(() => {
      expect(screen.queryByText('BTC')).not.toBeInTheDocument();
    });
  });
});