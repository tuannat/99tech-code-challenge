# Fancy Form - Currency Converter

A modern, responsive currency converter application built with React, TypeScript, and Vite. Features real-time exchange rates, elegant UI design, and comprehensive input validation.

## ✨ Features

- **Real-time Exchange Rates**: Fetches live currency data from Switcheo's API
- **Modern UI**: Gradient backgrounds, smooth animations, and responsive design
- **Smart Input Validation**: Handles various number formats with comma separators and decimal points
- **Token Icons**: Visual currency representation with fallback handling
- **Currency Swapping**: Quick currency pair swapping with animated buttons
- **Loading States**: Visual feedback during API calls and calculations
- **Error Handling**: Comprehensive error messages and validation feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- pnpm (recommended package manager)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint for code quality checks
- `pnpm preview` - Preview production build locally
- `pnpm test` - Run Jest test suite
- `pnpm test:watch` - Run tests in watch mode for development
- `pnpm test:coverage` - Run tests with coverage report

## 🏗️ Tech Stack

- **React 19** - UI framework with latest features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Jest** - Testing framework with comprehensive coverage
- **React Testing Library** - Component testing utilities

## 📁 Project Structure

```
src/
├── __tests__/             # Integration tests
├── components/
│   ├── ui/                # Reusable UI components (Button, Input, Select)
│   │   └── __tests__/     # Component unit tests
│   ├── CurrencySelect.tsx # Currency selection component
│   └── __tests__/         # Component tests
├── hooks/
│   ├── usePrices.ts       # Custom hook for price data
│   └── __tests__/         # Hook tests
├── utils/
│   ├── currency.ts        # Currency utility functions
│   └── __tests__/         # Utility function tests
├── lib/
│   ├── utils.ts           # General utility functions
│   └── __tests__/         # Library tests
├── assets/
│   ├── tokens/            # Currency token icons (200+ crypto/fiat currencies)
│   └── bg-product_lg.jpg
├── App.tsx                # Main application component
├── App.css               # Application-specific styles
├── index.css             # Global styles and Tailwind imports
├── main.tsx              # Application entry point
└── setupTests.ts         # Jest test configuration
```

## 🎨 Features in Detail

### Currency Conversion
- Supports 200+ cryptocurrencies and traditional currencies
- Real-time exchange rate calculations
- Automatic price updates from external API

### Input Validation
- Prevents invalid characters and formats
- Handles comma separators for large numbers
- Validates positive number requirements
- Real-time error feedback

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface elements

## 🔧 Configuration

The project uses modern tooling with sensible defaults:

- **Vite**: Configured for React with TypeScript support
- **ESLint**: React and TypeScript rules enabled
- **Tailwind CSS**: Custom configuration with animations
- **TypeScript**: Strict mode enabled for better type safety

## 📊 API Integration

Fetches exchange rates from: `https://interview.switcheo.com/prices.json`

The application intelligently handles:
- Multiple price entries per currency
- Latest price selection by date
- API error states and loading indicators
- Fallback error handling

## 🎯 Performance Features

- **React Query**: Efficient data caching and background updates
- **Memoization**: Optimized calculations and currency filtering
- **Lazy Loading**: Optimized asset loading with fallbacks
- **Debounced Calculations**: Smooth user experience during rapid input changes

## 🧪 Testing

### Test Suite Overview

Comprehensive Jest test suite with **97%+ code coverage** ensuring reliability and maintainability.

### Test Coverage

```
File                 | % Stmts | % Branch | % Funcs | % Lines
---------------------|---------|----------|---------|--------
All files            |   97.26 |    97.29 |     100 |   96.92
hooks/usePrices.ts   |     100 |      100 |     100 |     100
lib/utils.ts         |     100 |      100 |     100 |     100
utils/currency.ts    |     100 |    96.55 |     100 |     100
```

### Test Categories

#### **Utility Function Tests** (24 tests)
- **Currency formatting**: Number formatting with comma separators
- **Input validation**: Complex business rules for amount validation
- **Data parsing**: String to number conversion with error handling
- **Edge cases**: Empty inputs, invalid formats, boundary conditions

#### **Custom Hook Tests** (8 tests)
- **API integration**: Fetch operations with proper mocking
- **Data processing**: Latest price selection and currency sorting
- **Error handling**: Network failures and HTTP error responses
- **State management**: Loading, error, and success states with React Query

#### **Component Tests** (7 tests)
- **UI components**: Button, Input, and Select component functionality
- **User interactions**: Click events, form validation, accessibility
- **Props handling**: Variant styles, disabled states, custom classes
- **Integration**: Currency selection and amount input workflows

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (great for development)
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run specific test file
pnpm test src/utils/__tests__/currency.test.ts
```

### Test Features

- **✅ Comprehensive mocking**: API calls, timers, and external dependencies
- **✅ Edge case coverage**: Invalid inputs, network errors, empty states
- **✅ User interaction testing**: Form validation, currency swapping, calculations
- **✅ Performance testing**: Hook optimization and re-render prevention
- **✅ Accessibility testing**: Keyboard navigation and screen reader support

### Test Organization

Tests are organized following the same structure as the source code:

```
src/
├── __tests__/              # Integration tests
├── components/__tests__/   # Component unit tests  
├── hooks/__tests__/        # Custom hook tests
├── utils/__tests__/        # Utility function tests
└── lib/__tests__/          # Library tests
```

### Testing Philosophy

- **Unit tests**: Individual functions and components
- **Integration tests**: Component interactions and user workflows  
- **Edge case testing**: Error conditions and boundary values
- **User-centric**: Testing from the user's perspective
- **Maintainable**: Clear test descriptions and reusable utilities

### Continuous Integration

Tests are designed to run in CI/CD environments with:
- Fast execution (< 5 seconds)
- Reliable mocking preventing external dependencies
- Clear error reporting for debugging failures
- Comprehensive coverage preventing regressions
