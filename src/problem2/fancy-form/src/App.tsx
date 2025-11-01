import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RotateCcw, Loader2 } from 'lucide-react'
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
  const [amountError, setAmountError] = useState<string>('')
  const [convertedAmount, setConvertedAmount] = useState<string>('')
  const [showResult, setShowResult] = useState<boolean>(false)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)

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
    if (!amount || amountError || !currencyPrices.has(fromCurrency) || !currencyPrices.has(toCurrency)) {
      return
    }

    // Check if amount is positive
    const numAmount = parseAmount(amount)
    if (numAmount <= 0) {
      return
    }

    // Check if currencies are the same
    if (fromCurrency === toCurrency) {
      return
    }

    setIsCalculating(true)
    setShowResult(false)
    setConvertedAmount('')

    // Fake timeout for 2 seconds
    setTimeout(() => {
      const fromPrice = currencyPrices.get(fromCurrency) || 1
      const toPrice = currencyPrices.get(toCurrency) || 1
      const numAmount = parseAmount(amount)

      // Convert: amount * fromPrice / toPrice
      const result = (numAmount * fromPrice) / toPrice
      setConvertedAmount(result.toFixed(6))
      setShowResult(true)
      setIsCalculating(false)
    }, 2000)
  }

  // Check if currencies are the same
  const isSameCurrency = fromCurrency === toCurrency

  // Format amount with commas and validate
  const formatAmount = (value: string): string => {
    // Remove all non-digit characters except decimal point
    let cleaned = value.replace(/[^\d.]/g, '')
    
    // Only allow one decimal point
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('')
    }
    
    // Format with commas
    if (cleaned.includes('.')) {
      const [integerPart, decimalPart] = cleaned.split('.')
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return `${formattedInteger}.${decimalPart}`
    } else {
      return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }

  // Parse formatted amount to number
  const parseAmount = (formatted: string): number => {
    const cleaned = formatted.replace(/,/g, '')
    return parseFloat(cleaned) || 0
  }

  // Validate amount format
  const validateAmount = (value: string): string => {
    if (!value || value.trim() === '') {
      return ''
    }

    // Check if starts with comma or period
    if (/^[,.]/.test(value.trim())) {
      return 'Amount must not start with comma or period'
    }

    // Check for valid format: digits, commas, and one decimal point
    if (!/^[\d,]+(\.\d*)?$/.test(value.replace(/,/g, ''))) {
      return 'Invalid amount format. Use digits, commas for thousands, and one decimal point'
    }

    // Check if starts with valid digit (1-9 or 0.)
    const trimmed = value.replace(/,/g, '')
    if (!/^[1-9]/.test(trimmed) && !/^0\./.test(trimmed)) {
      return 'Amount must start with a number greater than 0 (e.g., 1, 2, 0.5)'
    }

    // Check if amount is positive
    const numValue = parseAmount(value)
    if (numValue <= 0) {
      return 'Amount must be greater than 0'
    }

    // Check for multiple commas in wrong places
    const commaCount = (value.match(/,/g) || []).length
    const digitsAfterLastComma = value.split(',').pop() || ''
    if (commaCount > 0 && digitsAfterLastComma.length > 3 && !digitsAfterLastComma.includes('.')) {
      return 'Invalid comma placement. Use commas for thousands separator'
    }

    return ''
  }

  const amountValue = parseAmount(amount)
  const isAmountPositive = amountValue > 0
  const isValidAmount = isAmountPositive && !amountError && amount.trim() !== ''

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
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                
                // Allow empty
                if (value === '') {
                  setAmount('')
                  setAmountError('')
                  setShowResult(false)
                  setConvertedAmount('')
                  return
                }

                // Only update if format is potentially valid (allow typing)
                // Block if starts with comma or period
                if (/^[,.]/.test(value.trim())) {
                  setAmountError('Amount must not start with comma or period')
                  return
                }

                // Allow digits, commas, and one decimal point
                if (/^[\d,]*\.?\d*$/.test(value) || value === '') {
                  // Format the amount
                  const formatted = formatAmount(value)
                  setAmount(formatted)
                  
                  // Validate and set error
                  const validationError = validateAmount(formatted)
                  setAmountError(validationError)
                  
                  setShowResult(false)
                  setConvertedAmount('')
                }
              }}
              onBlur={(e) => {
                // Re-validate on blur and format properly
                const value = e.target.value
                if (value) {
                  const formatted = formatAmount(value)
                  setAmount(formatted)
                  const validationError = validateAmount(formatted)
                  setAmountError(validationError)
                }
              }}
              placeholder="0.00"
              className={`w-full rounded-xl bg-white text-gray-900 text-lg font-semibold h-14 px-4 border-0 focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed ${amountError ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={isCalculating}
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
              }} disabled={isCalculating}>
                <SelectTrigger className="w-full rounded-xl bg-white text-gray-900 border-0 h-14 px-4 focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed">
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
            <div className="flex justify-center pb-[4px]">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-purple-900 border-purple-700 hover:bg-purple-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSwap}
                aria-label="Swap currencies"
                disabled={isCalculating}
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
              }} disabled={isCalculating}>
                <SelectTrigger className="w-full rounded-xl bg-white text-gray-900 border-0 h-14 px-4 focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed">
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

          {/* Error Messages */}
          {amountError && (
            <div className="rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-500/50 p-3">
              <p className="text-red-200 text-sm font-medium text-center">
                {amountError}
              </p>
            </div>
          )}
          {isSameCurrency && (
            <div className="rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-500/50 p-3">
              <p className="text-red-200 text-sm font-medium text-center">
                Please select different currencies for conversion
              </p>
            </div>
          )}

          {/* Exchange Rate Display */}
          {currencyPrices.has(fromCurrency) && currencyPrices.has(toCurrency) && !isSameCurrency && isValidAmount && (
            <div className="text-center">
              <p className="text-white text-sm sm:text-base">
                1 {fromCurrency} = {exchangeRate} {toCurrency}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isCalculating && (
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 space-y-3">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
                <p className="text-white text-sm font-medium uppercase tracking-wide">Calculating Exchange Rate...</p>
              </div>
            </div>
          )}

          {/* Exchange Result Display */}
          {showResult && convertedAmount && !isCalculating && (
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 space-y-3">
              <p className="text-white text-xs font-medium uppercase tracking-wide">Exchange Result</p>
              <div className="flex flex-col gap-3">
                {/* From Currency - Top */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-white text-sm font-medium truncate">
                    {amount}
                  </div>
                  <div className="text-white text-xs font-medium whitespace-nowrap">{fromCurrency}</div>
                </div>
                {/* Exchange Result - Bottom (Bigger) */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-white text-xl font-bold truncate">
                    {parseFloat(convertedAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                  <div className="text-white text-sm font-bold whitespace-nowrap">{toCurrency}</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            className="w-full rounded-xl bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-100 hover:from-amber-300 hover:to-yellow-300 text-gray-900 font-bold text-base sm:text-lg h-14 shadow-lg hover:shadow-xl transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGetExchangeRate}
            disabled={!amount || !!amountError || !isValidAmount || !currencyPrices.has(fromCurrency) || !currencyPrices.has(toCurrency) || isCalculating || isSameCurrency}
          >
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Calculating...</span>
              </div>
            ) : (
              'Get Exchange Rate'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
