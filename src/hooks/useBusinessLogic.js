import { useDispatch, useSelector } from 'react-redux';

import { setBids, setAsks, selectBids, selectAsks } from '../store/slices/orders';

const useBusinessLogic = () => {
    const dispatch = useDispatch();
    const currentBids = useSelector(selectBids);
    const currentAsks = useSelector(selectAsks);
    let webSocket = null;

    const initWebSocket = () => {
        webSocket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

        webSocket.onopen = () => {
            webSocket.send(
                JSON.stringify({
                    event: 'subscribe',
                    channel: 'book',
                    symbol: 'tBTCUSD',
                    prec: 'P0',
                    freq: 'F0',
                    len: '25',
                    subId: 123,
                }),
            );
        };

        webSocket.onmessage = message => {
            const data = JSON.parse(message.data);

            if (Array.isArray(data) && data[1] !== 'hb') {
                const [, bookData] = data;

                if (Array.isArray(bookData[0])) {
                    const bids = [];
                    const asks = [];

                    bookData.forEach(order => {
                        const [price, count, amount] = order;
                        if (amount > 0) {
                            bids.push({ price, count, amount });
                        } else {
                            asks.push({ price, count, amount: -amount });
                        }
                    });

                    dispatch(setBids(bids));
                    dispatch(setAsks(asks));
                } else {
                    const [price, count, amount] = bookData;

                    if (count === 0) {
                        dispatch(setBids(currentBids.filter(order => order.price !== price)));
                        dispatch(setAsks(currentAsks.filter(order => order.price !== price)));
                    } else {
                        if (amount > 0) {
                            const orderIndex = currentBids.findIndex(order => order.price === price);
                            if (orderIndex > -1) {
                                const tmpBids = [...currentBids];
                                tmpBids[orderIndex] = { price, count, amount };
                                dispatch(setBids(tmpBids));
                                return;
                            }

                            dispatch(setBids([...currentBids, { price, count, amount }]));
                            return;
                        } else {
                            const orderIndex = currentAsks.findIndex(order => order.price === price);
                            if (orderIndex > -1) {
                                const tmp = [...currentAsks];
                                tmp[orderIndex] = { price, count, amount: -amount };
                                dispatch(setAsks(tmp));
                                return;
                            }

                            dispatch(setAsks([...currentAsks, { price, count, amount: -amount }]));
                        }
                    }
                }
            }
        };

        webSocket.onclose = () => {
            setTimeout(initWebSocket, 2000);
        };

        webSocket.onerror = e => {
            console.error(e);
        };
    };

    return { initWebSocket, bids: currentBids, asks: currentAsks };
};

export default useBusinessLogic;
