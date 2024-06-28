import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'orders',
    initialState: {
        bids: [],
        asks: [],
    },
    reducers: {
        setBids(state, action) {
            state.bids = action.payload;
        },
        setAsks(state, action) {
            state.asks = action.payload;
        },
    },
});

export default slice;

export const { setBids, setAsks } = slice.actions;

export const selectBids = state => state.orders.bids;

export const selectAsks = state => state.orders.asks;
