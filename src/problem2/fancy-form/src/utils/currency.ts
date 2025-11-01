export const getTokenImage = (currency: string): string => {
  return `/src/assets/tokens/${currency}.svg`
}

export const getDefaultTokenImage = (): string => {
  return `/src/assets/react.svg`
}

export const formatAmount = (value: string): string => {
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

export const parseAmount = (formatted: string): number => {
  const cleaned = formatted.replace(/,/g, '')
  return parseFloat(cleaned) || 0
}

export const validateAmount = (value: string): string => {
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