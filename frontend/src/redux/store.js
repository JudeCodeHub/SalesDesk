import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './slices/clientSlice';
import itemReducer from './slices/itemSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
    reducer: {
        clients: clientReducer,
        items: itemReducer,
        orders: orderReducer,
    }
});

export default store;
