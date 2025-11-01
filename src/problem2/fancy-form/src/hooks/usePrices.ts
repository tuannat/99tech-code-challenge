import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface PriceData {
  currency: string
  date: string
  price: number
}

const PRICES_URL = 'https://interview.switcheo.com/prices.json'

const fetchPrices = async (): Promise<PriceData[]> => {
  const response = await fetch(PRICES_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch prices')
  }
  return response.json()
}

export const usePrices = () => {
  const { data: prices, isLoading, error } = useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
  })

  // Get unique currencies and their latest prices
  const currencyPrices = useMemo(() => {
    if (!prices) return new Map<string, number>()

    const priceMap = new Map<string, { price: number; date: string }>()

    // Group by currency and keep the latest price by date
    prices.forEach((priceData) => {
      const existing = priceMap.get(priceData.currency)
      if (!existing || new Date(priceData.date) > new Date(existing.date)) {
        priceMap.set(priceData.currency, { price: priceData.price, date: priceData.date })
      }
    })

    // Convert to simple price map
    const result = new Map<string, number>()
    priceMap.forEach((value, key) => {
      result.set(key, value.price)
    })

    return result
  }, [prices])

  // Get list of unique currencies
  const currencies = useMemo(() => {
    return Array.from(currencyPrices.keys()).sort()
  }, [currencyPrices])

  return {
    currencyPrices,
    currencies,
    isLoading,
    error
  }
}