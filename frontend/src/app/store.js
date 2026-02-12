import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import parcelsReducer from '../features/parcels/parcelsSlice'; // 1. Import the parcels reducer
import adminReducer from '../features/admin/adminSlice';
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parcels: parcelsReducer,
     admin: adminReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    // Only persist the auth state
    auth: store.getState().auth,
  });
});