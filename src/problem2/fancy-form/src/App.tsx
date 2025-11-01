import { useState } from 'react'
import { RotateCcw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencySelect } from '@/components/CurrencySelect'
import { usePrices } from '@/hooks/usePrices'
import { formatAmount, parseAmount, validateAmount } from '@/utils/currency'
import './App.css'

function App() {
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('ETH')
  const [amount, setAmount] = useState<string>('1')
  const [amountError, setAmountError] = useState<string>('')
  const [convertedAmount, setConvertedAmount] = useState<string>('')
  const [showResult, setShowResult] = useState<boolean>(false)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)

  const { currencyPrices, currencies, isLoading, error } = usePrices()


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
            <CurrencySelect
              value={fromCurrency}
              onChange={(value) => {
                setFromCurrency(value)
                setShowResult(false)
                setConvertedAmount('')
              }}
              currencies={currencies}
              label="From"
              disabled={isCalculating}
            />

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
            <CurrencySelect
              value={toCurrency}
              onChange={(value) => {
                setToCurrency(value)
                setShowResult(false)
                setConvertedAmount('')
              }}
              currencies={currencies}
              label="To"
              disabled={isCalculating}
            />
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
