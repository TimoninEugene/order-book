import React, { useEffect } from 'react';

import useBusinessLogic from '../../hooks/useBusinessLogic';
import Header from './Header';

import './styles.css';

const OrderBook = () => {
    const { initWebSocket, bids, asks } = useBusinessLogic();

    useEffect(() => {
        initWebSocket();
    }, [initWebSocket]);

    return (
        <div className="widget">
            <div className="orders-header">
                <div className="title">Order book</div>
                <div className="pair">BTC/USD</div>
            </div>
            <div className="orders_container">
                <div className="half_part">
                    <Header />
                    {bids.map((bid, index) => (
                        <div className="grid_row" key={`bid-${index}`}>
                            <div>{bid.price}</div>
                            <div>{bid.count}</div>
                            <div>{bid.amount}</div>
                        </div>
                    ))}
                </div>
                <div className="half_part">
                    <Header />
                    {asks.map((ask, index) => (
                        <div className="grid_row" key={`ask-${index}`}>
                            <div>{ask.price}</div>
                            <div>{ask.count}</div>
                            <div>{ask.amount}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderBook;
