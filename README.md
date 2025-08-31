# Token Portfolio - React Application

## 🎯 Project Overview

A comprehensive **Token Portfolio management application** built with React, TypeScript, and modern web technologies. This application allows users to track cryptocurrency holdings, manage watchlists, connect wallets, and view real-time market data with interactive charts and responsive design.

## ✨ Features

### ✅ **Completed Features**

#### 1. **Portfolio Management**
- **Portfolio Total Display**: Real-time total value with currency formatting
- **Interactive Donut Chart**: Visual portfolio distribution with color-coded legend
- **Last Updated Timestamp**: Shows when data was last refreshed
- **Value Calculations**: Automatic calculation of `holdings × current_price`

#### 2. **Watchlist Management**
- **Comprehensive Token Table**: Displays token info, prices, 24h changes, sparklines
- **Editable Holdings**: Inline editing of token holdings with real-time value updates
- **Pagination**: Navigate through large watchlists efficiently
- **Token Actions**: Add, remove, and manage tokens with context menus

#### 3. **Add Token Modal**
- **Search Functionality**: Search tokens by name or symbol with debounced input
- **Trending Tokens**: Discover popular tokens automatically
- **Multi-Selection**: Select multiple tokens to add simultaneously
- **Real-time Search**: Live search results from CoinGecko API

#### 4. **Wallet Integration**
- **Multiple Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet
- **Auto-Connect**: Remembers previously connected wallets
- **ENS Resolution**: Human-readable wallet addresses
- **Connection Status**: Visual indicators for wallet connection state
- **Data Persistence**: Portfolio data persists regardless of wallet connection

#### 5. **Real-time Data**
- **Live Price Updates**: Automatic refresh every 60 seconds
- **Manual Refresh**: Manual price updates via refresh button
- **Market Data**: Current prices, 24h changes, and 7-day sparklines
- **Error Handling**: Graceful handling of API failures

#### 6. **State Management & Persistence**
- **Redux Toolkit**: Complete state management with TypeScript
- **localStorage**: Persistent data across browser sessions
- **Auto-Save**: Automatic saving of all user data
- **Data Restoration**: Seamless data recovery on app restart

## 🛠 Technology Stack

### **Frontend**
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### **State Management**
- **Redux Toolkit** - Modern Redux with simplified API
- **React Redux** - React bindings for Redux

### **Styling**
- **TailwindCSS** - Utility-first CSS framework
- **Custom Styles** - Inline styles for precise design matching

### **Data & APIs**
- **TanStack React Query** - Data fetching and caching
- **Axios** - HTTP client for API requests
- **CoinGecko API** - Cryptocurrency market data

### **Charts & Visualization**
- **Recharts** - React charting library
- **Custom Sparklines** - 7-day price trend charts

### **Wallet Integration**
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Multiple Connectors** - MetaMask, WalletConnect, Coinbase

### **Icons & UI**
- **Lucide React** - Beautiful, customizable icons
- **Custom Assets** - Project-specific icons and images

## 📁 Project Structure

```
react-assignment/
├── src/
│   ├── components/           # React components
│   │   ├── AddTokenModal.tsx     # Token addition modal
│   │   ├── Header.tsx           # Application header
│   │   ├── Pagination.tsx       # Pagination component
│   │   ├── PortfolioChart.tsx   # Donut chart component
│   │   ├── PortfolioTotal.tsx   # Portfolio total display
│   │   ├── Sparkline.tsx        # Price trend charts
│   │   ├── WalletButton.tsx     # Wallet connection UI
│   │   ├── WalletStatus.tsx     # Wallet status display
│   │   ├── WatchlistActions.tsx # Watchlist action buttons
│   │   └── WatchlistTable.tsx   # Main token table
│   ├── config/
│   │   └── wagmi.ts             # Wallet configuration
│   ├── hooks/                   # Custom React hooks
│   │   ├── redux.ts             # Redux hooks
│   │   ├── usePriceUpdates.ts  # Price update logic
│   │   ├── useWallet.ts        # Wallet management
│   │   └── useWalletPersistence.ts # Data persistence
│   ├── pages/
│   │   └── Portfolio.tsx       # Main portfolio page
│   ├── services/
│   │   └── coinGeckoApi.ts     # API service layer
│   ├── store/                   # Redux store
│   │   ├── index.ts            # Store configuration
│   │   └── slices/
│   │       └── portfolioSlice.ts # Portfolio state management
│   ├── utils/
│   │   └── localStorage.ts     # Data persistence utilities
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Application entry point
├── public/                     # Static assets
│   └── homepageImages/        # Project images
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Modern web browser
- MetaMask or other Web3 wallet (optional)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd react-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### **Build for Production**

```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 API Integration

### **CoinGecko API Endpoints**

The application integrates with CoinGecko API for real-time cryptocurrency data:

- **Market Data**: `/coins/markets` - Current prices and market information
- **Token Search**: `/search` - Search tokens by name or symbol
- **Trending Tokens**: `/search/trending` - Popular tokens
- **Price History**: `/coins/{id}/market_chart` - Historical data for sparklines
- **Token Details**: `/coins/{id}` - Detailed token information

### **Rate Limiting**
- Automatic rate limiting (1 second between requests)
- Error handling with fallback options
- Graceful degradation on API failures

## 💾 Data Persistence

### **localStorage Keys**
- `token-portfolio-watchlist` - User's token watchlist
- `token-portfolio-holdings` - Token holdings data
- `token-portfolio-last-updated` - Last update timestamp
- `token-portfolio-total` - Portfolio total value
- `lastConnectedWallet` - Previously connected wallet

### **Persistence Features**
- **Automatic Saving**: Data saved on every state change
- **Cross-Session**: Data persists across browser sessions
- **Wallet Independent**: Portfolio data persists regardless of wallet connection
- **Error Recovery**: Graceful handling of storage failures

## 🔗 Wallet Integration

### **Supported Wallets**
- **MetaMask** - Most popular Ethereum wallet
- **WalletConnect** - Multi-wallet QR code connection
- **Coinbase Wallet** - Coinbase's Web3 wallet
- **Injected Wallets** - Generic wallet support

### **Features**
- **Auto-Connect**: Remembers last connected wallet
- **ENS Resolution**: Human-readable addresses
- **Network Support**: Mainnet and Sepolia testnet
- **Error Handling**: User-friendly error messages
- **Connection Status**: Visual connection indicators

## 🎨 Design System

### **Color Palette**
- **Primary**: `#A9E851` (Green for actions and highlights)
- **Background**: `#212124` (Dark background)
- **Surface**: `#27272A` (Card backgrounds)
- **Text**: `#F4F4F5` (Primary text)
- **Secondary Text**: `#A1A1AA` (Secondary text)

### **Typography**
- **Font Family**: Inter (Sans-serif)
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold)
- **Responsive**: Scales appropriately across devices

### **Components**
- **Consistent Spacing**: 8px base unit system
- **Border Radius**: 6px for cards, 12px for modals
- **Shadows**: Subtle shadows for depth
- **Transitions**: Smooth 0.2s transitions

## 📱 Responsive Design

### **Breakpoints**
- **Desktop**: 1440px max-width with centered layout
- **Tablet**: Responsive scaling for medium screens
- **Mobile**: Optimized layout for small screens

### **Mobile Features**
- **Touch-Friendly**: Large touch targets
- **Swipe Gestures**: Intuitive navigation
- **Optimized Tables**: Horizontal scrolling for data tables
- **Modal Overlays**: Full-screen modals on mobile

## 🔧 Development

### **Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### **Code Quality**
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Strict Mode**: React strict mode enabled

### **Performance**
- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Optimized re-rendering
- **Bundle Optimization**: Tree shaking and minification

### **Code Standards**
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Add proper error handling
- Include loading states

## 🙏 Acknowledgments

- **CoinGecko** - Cryptocurrency data API
- **Wagmi** - Ethereum React hooks
- **Recharts** - Charting library
- **TailwindCSS** - CSS framework
- **Vite** - Build tool

