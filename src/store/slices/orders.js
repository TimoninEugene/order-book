import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'orders',
    initialState: {
        bids: [],
        asks: [],
    },
    reducers: {
        processSnapshot(state, action) {
            const data = action.payload;
            const snapshotBids = [];
            const snapshotAsks = [];

            data.forEach(order => {
                const [price, count, amount] = order;
                if (amount > 0) {
                    snapshotBids.push({ price, count, amount });
                } else {
                    snapshotAsks.push({ price, count, amount: -amount });
                }
            });
            snapshotBids.sort((item1, item2) => item1.price - item2.price);
            snapshotAsks.sort((item1, item2) => item1.price - item2.price);
            state.bids = snapshotBids;
            state.asks = snapshotAsks;
        },
        processSingleMessage(state, action) {
            const [price, count, amount] = action.payload;
            let bids = [...state.bids];
            let asks = [...state.asks];

            // remove the order
            if (count === 0) {
                if (amount === 1) {
                    state.bids = bids.filter(order => order.price !== price);
                }
                if (amount === -1) {
                    state.asks = asks.filter(order => order.price !== price);
                }
            } else if (amount > 0) {
                // add or update the order
                const order = { price, count, amount };
                const orderIndex = bids.findIndex(order => order.price === price);
                if (orderIndex > -1) {
                    bids[orderIndex] = order;
                } else {
                    bids.push(order);
                    bids.sort((item1, item2) => item1.price - item2.price);
                }
                state.bids = bids;
            } else {
                const order = { price, count, amount: -amount };
                const orderIndex = asks.findIndex(order => order.price === price);
                if (orderIndex > -1) {
                    asks[orderIndex] = order;
                    state.asks = asks;
                } else {
                    asks.push(order);
                    asks.sort((item1, item2) => item1.price - item2.price);
                }
                state.asks = asks;
            }
        },
    },
});

export default slice;

export const { processSnapshot, processSingleMessage } = slice.actions;

export const selectBids = state => state.orders.bids;

export const selectAsks = state => state.orders.asks;
