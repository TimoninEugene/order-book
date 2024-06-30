import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import store from '../store/store';
import { setBids, setAsks } from '../store/slices/orders';
import orderBookWebSocket from '../utils/OrderBookWebSocket';

const useBusinessLogic = () => {
    const dispatch = useDispatch();

    const processBookSnapshot = useCallback(
        data => {
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
            dispatch(setBids(snapshotBids));
            dispatch(setAsks(snapshotAsks));
        },
        [dispatch],
    );

    const processMessage = useCallback(
        data => {
            if (Array.isArray(data) && data[1] !== 'hb') {
                const [, bookData] = data;

                if (Array.isArray(bookData[0])) {
                    processBookSnapshot(bookData);
                } else {
                    const [price, count, amount] = bookData;
                    const { bids: currentBids, asks: currentAsks } = store.getState().orders;
                    const bids = [...currentBids];
                    const asks = [...currentAsks];

                    // remove the order
                    if (count === 0) {
                        if (amount === 1) {
                            dispatch(setBids(bids.filter(order => order.price !== price)));
                        }
                        if (amount === -1) {
                            dispatch(setAsks(asks.filter(order => order.price !== price)));
                        }
                    } else if (amount > 0) {
                        // add or update the order
                        const order = { price, count, amount };
                        const orderIndex = bids.findIndex(order => order.price === price);
                        if (orderIndex > -1) {
                            bids[orderIndex] = order;
                            dispatch(setBids(bids));
                            return;
                        }

                        bids.push(order);
                        bids.sort((item1, item2) => item1.price - item2.price);
                        dispatch(setBids(bids));
                        return;
                    } else {
                        const order = { price, count, amount: -amount };
                        const orderIndex = asks.findIndex(order => order.price === price);
                        if (orderIndex > -1) {
                            asks[orderIndex] = order;
                            dispatch(setAsks(asks));
                            return;
                        }
                        asks.push(order);
                        asks.sort((item1, item2) => item1.price - item2.price);
                        dispatch(setAsks(asks));
                    }
                }
            }
        },
        [dispatch, processBookSnapshot],
    );

    useEffect(() => {
        orderBookWebSocket.connect();
        orderBookWebSocket.addSubscriber(processMessage);
    }, [processMessage]);
};

export default useBusinessLogic;
