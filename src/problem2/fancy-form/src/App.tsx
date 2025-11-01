import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import './App.css'

interface PriceData {
  currency: string
  date: string
  price: number
}

const PRICES_URL = 'https://interview.switcheo.com/prices.json'

// Helper function to get token image path
const getTokenImage = (currency: string): string => {
  return `/src/assets/tokens/${currency}.svg`
}

// Helper function to get default token image
const getDefaultTokenImage = (): string => {
  return `/src/assets/react.svg`
}

// Fetch prices
const fetchPrices = async (): Promise<PriceData[]> => {
  const response = await fetch(PRICES_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch prices')
  }
  return response.json()
}

function App() {
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('ETH')
  const [amount, setAmount] = useState<string>('1')
  const [convertedAmount, setConvertedAmount] = useState<string>('')
  const [showResult, setShowResult] = useState<boolean>(false)

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


  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setShowResult(false)
    setConvertedAmount('')
  }

  const handleGetExchangeRate = () => {
    if (!amount || !currencyPrices.has(fromCurrency) || !currencyPrices.has(toCurrency)) {
      return
    }

    const fromPrice = currencyPrices.get(fromCurrency) || 1
    const toPrice = currencyPrices.get(toCurrency) || 1
    const numAmount = parseFloat(amount) || 0

    // Convert: amount * fromPrice / toPrice
    const result = (numAmount * fromPrice) / toPrice
    setConvertedAmount(result.toFixed(6))
    setShowResult(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center app-background">
        <div className="text-white">Loading prices...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center app-background">
        <div className="text-red-400">Error loading prices. Please try again later.</div>
      </div>
    )
  }

  // Calculate exchange rate
  const exchangeRate = currencyPrices.has(fromCurrency) && currencyPrices.has(toCurrency)
    ? ((currencyPrices.get(fromCurrency)! / currencyPrices.get(toCurrency)!)).toFixed(6)
    : '0'

  return (
    <div className="min-h-screen app-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-indigo-950 to-blue-900 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
              Currency Converter
            </h1>
            <div className="w-24 h-0.5 bg-white mx-auto mt-2"></div>
          </div>

          {/* Enter Amount Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white uppercase tracking-wide block">
              Enter Amount
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setShowResult(false)
                setConvertedAmount('')
              }}
              placeholder="0.00"
              className="w-full rounded-xl bg-white text-gray-900 text-lg font-semibold h-14 px-4 border-0 focus:ring-2 focus:ring-purple-300"
              min="0"
              step="any"
            />
          </div>

          {/* Currency Selection Section */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
            {/* FROM Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white uppercase tracking-wide block">
                From
              </label>
              <Select value={fromCurrency} onValueChange={(value) => {
                setFromCurrency(value)
                setShowResult(false)
                setConvertedAmount('')
              }}>
                <SelectTrigger className="w-full rounded-xl bg-white text-gray-900 border-0 h-14 px-4 focus:ring-2 focus:ring-purple-300">
                  <div className="flex items-center gap-2 w-full">
                    <img
                      src={getTokenImage(fromCurrency)}
                      alt={fromCurrency}
                      className="w-6 h-6 rounded-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = getDefaultTokenImage()
                      }}
                    />
                    <SelectValue placeholder="Select currency" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center pb-[5px]">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-purple-900 border-purple-700 hover:bg-purple-800 text-white"
                onClick={handleSwap}
                aria-label="Swap currencies"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* TO Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white uppercase tracking-wide block">
                To
              </label>
              <Select value={toCurrency} onValueChange={(value) => {
                setToCurrency(value)
                setShowResult(false)
                setConvertedAmount('')
              }}>
                <SelectTrigger className="w-full rounded-xl bg-white text-gray-900 border-0 h-14 px-4 focus:ring-2 focus:ring-purple-300">
                  <div className="flex items-center gap-2 w-full">
                    <img
                      src={getTokenImage(toCurrency)}
                      alt={toCurrency}
                      className="w-6 h-6 rounded-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = getDefaultTokenImage()
                      }}
                    />
                    <SelectValue placeholder="Select currency" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exchange Rate Display */}
          {currencyPrices.has(fromCurrency) && currencyPrices.has(toCurrency) && (
            <div className="text-center">
              <p className="text-white text-sm sm:text-base">
                1 {fromCurrency} = {exchangeRate} {toCurrency}
              </p>
            </div>
          )}

          {/* Exchange Result Display */}
          {showResult && convertedAmount && (
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 space-y-2">
              <p className="text-white text-sm font-medium uppercase tracking-wide">Exchange Result</p>
              <div className="flex items-baseline justify-between">
                <div className="text-white text-2xl font-bold">
                  {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fromCurrency}
                </div>
                <div className="text-white text-xl">=</div>
                <div className="text-white text-2xl font-bold">
                  {parseFloat(convertedAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {toCurrency}
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            className="w-full rounded-xl bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-100 hover:from-amber-300 hover:to-yellow-300 text-gray-900 font-bold text-base sm:text-lg h-14 shadow-lg hover:shadow-xl transition-all uppercase"
            onClick={handleGetExchangeRate}
            disabled={!amount || !currencyPrices.has(fromCurrency) || !currencyPrices.has(toCurrency)}
          >
            Get Exchange Rate
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
