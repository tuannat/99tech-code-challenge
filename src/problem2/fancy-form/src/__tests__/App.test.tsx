import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import App from '../App';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
global.fetch = mockFetch;

const mockPriceData = [
  { currency: 'USD', date: '2023-01-01', price: 1 },
  { currency: 'BTC', date: '2023-01-01', price: 50000 },
  { currency: 'ETH', date: '2023-01-01', price: 3000 },
  { currency: 'USDT', date: '2023-01-01', price: 1.001 },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock timers for testing the calculation delay
jest.useFakeTimers();

describe('App Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should render loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<App />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Loading prices...')).toBeInTheDocument();
  });

  it('should render error state when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Error loading prices. Please try again later.')).toBeInTheDocument();
    });
  });

  it('should render currency converter when data loads successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Enter Amount')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('Get Exchange Rate')).toBeInTheDocument();
  });

  it('should have default currency selections', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('USD')).toBeInTheDocument();
      expect(screen.getByDisplayValue('ETH')).toBeInTheDocument();
    });
  });

  it('should display exchange rate when valid currencies are selected', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText(/1 USD = .* ETH/)).toBeInTheDocument();
    });
  });

  it('should handle amount input correctly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    const amountInput = screen.getByPlaceholderText('0.00');
    await user.clear(amountInput);
    await user.type(amountInput, '100');
    
    expect(amountInput).toHaveValue('100');
  });

  it('should format amount input with commas', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    const amountInput = screen.getByPlaceholderText('0.00');
    await user.clear(amountInput);
    await user.type(amountInput, '1000');
    
    expect(amountInput).toHaveValue('1,000');
  });

  it('should show validation error for invalid amount', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    const amountInput = screen.getByPlaceholderText('0.00');
    await user.clear(amountInput);
    await user.type(amountInput, '0');
    
    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
    });
  });

  it('should swap currencies when swap button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('USD')).toBeInTheDocument();
      expect(screen.getByDisplayValue('ETH')).toBeInTheDocument();
    });
    
    const swapButton = screen.getByLabelText('Swap currencies');
    await user.click(swapButton);
    
    // After swap, USD should be in 'To' and ETH should be in 'From'
    const selects = screen.getAllByRole('combobox');
    expect(selects[0]).toHaveValue('ETH'); // From
    expect(selects[1]).toHaveValue('USD'); // To
  });

  it('should show error when same currency is selected for both from and to', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    // Change 'To' currency to same as 'From'
    const toSelect = screen.getAllByRole('combobox')[1];
    await user.click(toSelect);
    
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('USD'));
    
    await waitFor(() => {
      expect(screen.getByText('Please select different currencies for conversion')).toBeInTheDocument();
    });
  });

  it('should disable button when form is invalid', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    // Clear amount to make form invalid
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '' } });
    
    const button = screen.getByText('Get Exchange Rate');
    expect(button).toBeDisabled();
  });

  it('should calculate exchange rate when button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    const button = screen.getByText('Get Exchange Rate');
    await user.click(button);
    
    // Should show calculating state
    expect(screen.getByText('Calculating Exchange Rate...')).toBeInTheDocument();
    
    // Fast forward time to complete calculation
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(screen.getByText('Exchange Result')).toBeInTheDocument();
    });
  });

  it('should show loading state during calculation', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    const button = screen.getByText('Get Exchange Rate');
    await user.click(button);
    
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    // All inputs should be disabled during calculation
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  it('should display calculated result correctly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    // Set amount to 10
    const amountInput = screen.getByPlaceholderText('0.00');
    await user.clear(amountInput);
    await user.type(amountInput, '10');
    
    const button = screen.getByText('Get Exchange Rate');
    await user.click(button);
    
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(screen.getByText('Exchange Result')).toBeInTheDocument();
      // Should show the original amount and converted amount
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  it('should clear results when currency is changed', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    // First calculate a result
    const button = screen.getByText('Get Exchange Rate');
    await user.click(button);
    
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(screen.getByText('Exchange Result')).toBeInTheDocument();
    });
    
    // Change currency
    const fromSelect = screen.getAllByRole('combobox')[0];
    await user.click(fromSelect);
    
    await waitFor(() => {
      expect(screen.getByText('BTC')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('BTC'));
    
    // Result should be cleared
    expect(screen.queryByText('Exchange Result')).not.toBeInTheDocument();
  });

  it('should handle decimal amounts correctly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);
    
    render(<App />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    });
    
    const amountInput = screen.getByPlaceholderText('0.00');
    await user.clear(amountInput);
    await user.type(amountInput, '0.5');
    
    expect(amountInput).toHaveValue('0.5');
    
    const button = screen.getByText('Get Exchange Rate');
    expect(button).not.toBeDisabled();
  });
});