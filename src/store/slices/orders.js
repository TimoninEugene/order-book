import { createSlice, createSelector } from '@reduxjs/toolkit';

const sliceName = 'orders';

const slice = createSlice({
    name: sliceName,
    initialState: {
        bids: {},
        asks: {},
    },
    reducers: {
        processSnapshot(state, action) {
            const data = action.payload;

            data.forEach(order => {
                const [price, count, amount] = order;
                if (amount > 0) {
                    state.bids[price] = { price, count, amount };
                } else {
                    state.asks[price] = { price, count, amount: -amount };
                }
            });
        },
        processSingleMessage(state, action) {
            const [price, count, amount] = action.payload;

            // remove the order
            if (count === 0) {
                if (amount === 1) {
                    delete state.bids[price];
                }
                if (amount === -1) {
                    delete state.asks[price];
                }
            } else {
                // add or update the order
                const order = { price, count, amount };
                if (amount > 0) {
                    state.bids[price] = order;
                } else {
                    state.asks[price] = order;
                }
            }
        },
    },
});

export default slice;

export const { processSnapshot, processSingleMessage } = slice.actions;

export const selectBids = createSelector([state => state[sliceName].bids], bids =>
    Object.keys(bids)
        .sort()
        .map(bidPrice => bids[bidPrice]),
);

export const selectAsks = createSelector([state => state[sliceName].asks], asks =>
    Object.keys(asks)
        .sort()
        .map(askPrice => asks[askPrice]),
);
