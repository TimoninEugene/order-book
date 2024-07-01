import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { processSnapshot, processSingleMessage } from '../store/slices/orders';
import orderBookWebSocket from '../utils/OrderBookWebSocket';

const useBusinessLogic = () => {
    const dispatch = useDispatch();

    const processMessage = useCallback(
        data => {
            if (!(Array.isArray(data) && data[1] !== 'hb')) {
                return;
            }

            const [, bookData] = data;
            if (Array.isArray(bookData[0])) {
                dispatch(processSnapshot(bookData));
            } else {
                dispatch(processSingleMessage(bookData));
            }
        },
        [dispatch],
    );

    useEffect(() => {
        orderBookWebSocket.connect();
        orderBookWebSocket.addSubscriber(processMessage);
    }, [processMessage]);
};

export default useBusinessLogic;
