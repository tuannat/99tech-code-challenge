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

## 🏗️ Tech Stack

- **React 19** - UI framework with latest features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
src/
├── components/ui/     # Reusable UI components (Button, Input, Select)
├── assets/
│   ├── tokens/        # Currency token icons (200+ crypto/fiat currencies)
│   └── bg-product_lg.jpg
├── lib/
│   └── utils.ts       # Utility functions
├── App.tsx            # Main application component
├── App.css           # Application-specific styles
├── index.css         # Global styles and Tailwind imports
└── main.tsx          # Application entry point
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
