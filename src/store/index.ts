import { configureStore } from '@reduxjs/toolkit';
import portfolioSlice from './slices/portfolioSlice';

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
