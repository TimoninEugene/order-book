import { configureStore } from '@reduxjs/toolkit';

import orders from './slices/orders';

const store = configureStore({
    reducer: {
        orders: orders.reducer,
    },
});

export default store;
