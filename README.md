# Frontend Assignment — Token Portfolio (React + Vite + Redux)

## Project Overview

This project involves building a comprehensive Token Portfolio application using React, Vite, and Redux. The application will display cryptocurrency data, allow users to manage their watchlist, integrate wallet connectivity, and provide a seamless user experience across desktop and mobile devices.

## Design and API Resources

- **Figma Designs**: [Provided Design Link]
- **API Documentation**: [CoinGecko API Documentation](https://docs.coingecko.com/reference/introduction)

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Data Fetching**: TanStack React Query + Axios
- **Wallet Integration**: Wagmi
- **Icons**: Lucide React

## Project Structure and Requirements

### 1. Portfolio (Home) Page

#### Portfolio Total Card and Donut Chart
- Implement the Portfolio Total card exactly as shown in Figma designs
- Create an interactive donut chart displaying portfolio distribution
- Ensure chart colors match corresponding list items
- Display total portfolio value with proper formatting

#### Last Updated Timestamp
- Show "Last updated" timestamp indicating when data was last fetched
- Update timestamp on each data refresh

#### Watchlist Table
**Columns Required:**
- **Token**: Logo, name, and symbol
- **Price**: Current price with proper formatting
- **24h %**: Percentage change (red for negative, green for positive)
- **Sparkline (7d)**: 7-day price trend chart
- **Holdings**: Editable input field for user holdings
- **Value**: Calculated as `holdings × price`
- **Row Menu**: Actions menu for each token

#### Additional Features
- **Refresh Prices Button**: Reloads latest market data
- **Pagination Footer**: Implement as shown in designs
- **Responsive Design**: Must match both desktop and mobile Figma screens

### 2. Add Token Modal

#### Modal Functionality
- Opens via "Add Token" button
- Search input for token discovery
- Include a "Trending" section for popular tokens

#### Token Display
**Each token row displays:**
- Token logo
- Token name
- Token symbol
- Selection radio button

#### Modal Actions
- **Add to Watchlist Button**: Enabled only when at least one token is selected
- **Save Functionality**: Selected tokens are added to the watchlist
- **Cancel/Close**: Closes modal without saving changes

### 3. State Management, Data & Persistence

#### Redux Store Structure
- Store selected tokens and their holdings
- Manage portfolio calculations and totals
- Handle loading, error, and success states

#### Persistence Strategy
- Use `localStorage` to persist watchlist and holdings data
- Ensure data restoration when user returns to the application
- Maintain data consistency across browser sessions

#### Calculations
- **Value Calculation**: `holdings × current_price`
- **Portfolio Total**: Sum of all individual token values
- **Real-time Updates**: Keep calculations synchronized with price updates
- **Auto-refresh**: Implement periodic price updates

### 4. Wallet Connection Integration

#### Wagmi Integration
- Implement wallet connection using [wagmi](https://wagmi.sh/react/api/connectors/walletConnect)
- Support multiple wallet providers
- Handle connection, disconnection, and account switching

#### UI State Management
- Show connected wallet status in the UI
- Display wallet address when connected
- Maintain consistent UI state across wallet operations
- Ensure watchlist data persists regardless of wallet connection status

### 5. Behavior & User Experience

#### Responsive Design
- **Desktop**: Match Figma desktop designs exactly
- **Mobile**: Implement mobile-specific layouts as per Figma
- **Breakpoints**: Ensure smooth transitions between screen sizes

#### State Handling
- **Loading States**: Show appropriate loading indicators
- **Empty States**: Display helpful messages when no data is available
- **Error States**: Handle and display API errors gracefully
- **Data Validation**: Validate user inputs and provide feedback

#### Performance Optimization
- Smooth interactions without jank
- Optimized rendering with React best practices
- Efficient re-rendering strategies
- Proper memoization where needed

## API Integration

### CoinGecko API Endpoints
Based on the [CoinGecko API Documentation](https://docs.coingecko.com/reference/introduction):

- **Market Data**: `/coins/markets` - Get current prices and market data
- **Token Search**: `/search` - Search for tokens by name or symbol
- **Trending Tokens**: `/search/trending` - Get trending tokens
- **Price History**: `/coins/{id}/market_chart` - Get historical price data for sparklines
- **Token Details**: `/coins/{id}` - Get detailed token information

## Development Phases

### Phase 1: Project Setup & Basic Structure
- [x] Initialize React + Vite + TypeScript project
- [x] Install and configure dependencies
- [x] Set up TailwindCSS
- [x] Configure Redux store
- [ ] Set up basic routing (if needed)

### Phase 2: Core Components
- [ ] Create Portfolio page layout
- [ ] Implement Watchlist table component
- [ ] Build Add Token modal
- [ ] Create reusable UI components

### Phase 3: Data Integration
- [ ] Set up API service layer
- [ ] Implement Redux slices for portfolio data
- [ ] Add localStorage persistence
- [ ] Integrate React Query for data fetching

### Phase 4: Advanced Features
- [ ] Implement donut chart with Recharts
- [ ] Add sparkline charts for 7-day trends
- [ ] Build editable holdings functionality
- [ ] Add refresh and pagination features

### Phase 5: Wallet Integration
- [ ] Configure Wagmi for wallet connection
- [ ] Implement wallet connection UI
- [ ] Handle wallet state management
- [ ] Ensure data persistence across wallet operations

### Phase 6: Polish & Optimization
- [ ] Implement responsive design
- [ ] Add loading, empty, and error states
- [ ] Optimize performance and rendering
- [ ] Conduct thorough testing across devices

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone [repository-url]
   cd react-assignment
   ```

2. **Install Dependencies** (Already Done):
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser

## Build and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deliverables

- [x] **GitHub Repository**: Clean, well-structured codebase
- [ ] **Live Deployment**: Deployed on Vercel/Netlify
- [ ] **Documentation**: Comprehensive README and code comments

## Evaluation Criteria

### UI Accuracy (25%)
- Pixel-perfect implementation matching Figma designs
- Consistent spacing, typography, and colors
- Proper component hierarchy and layout

### Performance (25%)
- Efficient state management with Redux
- Optimized rendering and re-rendering
- Fast loading times and smooth interactions

### Responsiveness (25%)
- Seamless experience across desktop and mobile
- Proper breakpoint handling
- Touch-friendly mobile interactions

### User Experience (25%)
- Clear, intuitive, and smooth interactions
- Proper feedback for user actions
- Graceful error handling and loading states

## Resources and References

- **Redux and LocalStorage**: [Persisted Data With Redux and LocalStorage](https://medium.com/@lior_amsalem/persisted-data-with-redux-and-localstorage-415ee034084e)
- **Wagmi Integration**: [How to connect a wallet to your React app using Wagmi](https://www.0xdev.co/how-to-connect-a-wallet-to-your-react-app-using-wagmi/)
- **CoinGecko API**: [API Documentation](https://docs.coingecko.com/reference/introduction)
- **TailwindCSS**: [Documentation](https://tailwindcss.com/docs)
- **Recharts**: [Documentation](https://recharts.org/)

---

## Next Steps

Ready to proceed with the home layout implementation once Figma design screenshots are provided. The project structure is set up and ready for development following the comprehensive requirements outlined above.
