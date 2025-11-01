import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTokenImage, getDefaultTokenImage } from '@/utils/currency'

interface CurrencySelectProps {
  value: string
  onChange: (value: string) => void
  currencies: string[]
  label: string
  disabled?: boolean
}

export const CurrencySelect = ({ 
  value, 
  onChange, 
  currencies, 
  label, 
  disabled = false 
}: CurrencySelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white uppercase tracking-wide block">
        {label}
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full rounded-xl bg-white text-gray-900 border-0 h-14 px-4 focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="flex items-center gap-2 w-full">
            <img
              src={getTokenImage(value)}
              alt={value}
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
  )
}