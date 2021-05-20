import { configureStore } from '@reduxjs/toolkit';
import refReducer from './features/referenceSlice';

export default configureStore({
  reducer: {
    reference: refReducer
  }
});
