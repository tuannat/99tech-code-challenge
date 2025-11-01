import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { usePrices } from '../usePrices';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
global.fetch = mockFetch;

const mockPriceData = [
  { currency: 'USD', date: '2023-01-01', price: 1 },
  { currency: 'BTC', date: '2023-01-01', price: 50000 },
  { currency: 'ETH', date: '2023-01-01', price: 3000 },
  { currency: 'BTC', date: '2023-01-02', price: 51000 }, // Later date for BTC
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

describe('usePrices Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch and process price data correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPriceData,
    } as Response);

    const { result } = renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.currencies).toEqual([]);
    expect(result.current.currencyPrices.size).toBe(0);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check processed data
    expect(result.current.currencies).toEqual(['BTC', 'ETH', 'USD', 'USDT']);
    expect(result.current.currencyPrices.get('USD')).toBe(1);
    expect(result.current.currencyPrices.get('BTC')).toBe(51000); // Latest price
    expect(result.current.currencyPrices.get('ETH')).toBe(3000);
    expect(result.current.currencyPrices.get('USDT')).toBe(1.001);
  });

  it('should handle latest price selection correctly', async () => {
    const dataWithDuplicates = [
      { currency: 'BTC', date: '2023-01-01', price: 50000 },
      { currency: 'BTC', date: '2023-01-03', price: 52000 }, // Latest
      { currency: 'BTC', date: '2023-01-02', price: 51000 },
      { currency: 'ETH', date: '2023-01-01', price: 3000 },
      { currency: 'ETH', date: '2023-01-02', price: 3100 }, // Latest
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dataWithDuplicates,
    } as Response);

    const { result } = renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should use latest prices by date
    expect(result.current.currencyPrices.get('BTC')).toBe(52000);
    expect(result.current.currencyPrices.get('ETH')).toBe(3100);
  });

  it('should handle fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.currencies).toEqual([]);
    expect(result.current.currencyPrices.size).toBe(0);
  });

  it('should handle HTTP error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const { result } = renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.currencies).toEqual([]);
    expect(result.current.currencyPrices.size).toBe(0);
  });

  it('should handle empty price data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const { result } = renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeFalsy();
    expect(result.current.currencies).toEqual([]);
    expect(result.current.currencyPrices.size).toBe(0);
  });

  it('should sort currencies alphabetically', async () => {
    const unsortedData = [
      { currency: 'ZEC', date: '2023-01-01', price: 100 },
      { currency: 'BTC', date: '2023-01-01', price: 50000 },
      { currency: 'ADA', date: '2023-01-01', price: 1 },
      { currency: 'ETH', date: '2023-01-01', price: 3000 },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => unsortedData,
    } as Response);

    const { result } = renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.currencies).toEqual(['ADA', 'BTC', 'ETH', 'ZEC']);
  });

  it('should handle malformed date strings gracefully', async () => {
    const dataWithBadDates = [
      { currency: 'BTC', date: 'invalid-date', price: 50000 },
      { currency: 'BTC', date: '2023-01-01', price: 51000 },
      { currency: 'ETH', date: '2023-01-01', price: 3000 },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dataWithBadDates,
    } as Response);

    const { result } = renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should still process the data and handle invalid dates
    expect(result.current.currencies).toContain('BTC');
    expect(result.current.currencies).toContain('ETH');
    expect(result.current.currencyPrices.has('BTC')).toBe(true);
    expect(result.current.currencyPrices.has('ETH')).toBe(true);
  });

  it('should call correct API endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    renderHook(() => usePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('https://interview.switcheo.com/prices.json');
    });
  });
});