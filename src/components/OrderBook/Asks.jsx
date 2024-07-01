import { useSelector } from 'react-redux';

import { selectAsks } from '../../store/slices/orders';

const Asks = () => {
    const asks = useSelector(selectAsks());

    return (
        <>
            <div className="grid_row">
                <div className="header">Price</div>
                <div className="header">Amount</div>
                <div className="header count_field">Count</div>
            </div>
            {asks.map((ask, index) => (
                <div className="grid_row" key={`ask-${index}`}>
                    <div>{ask.price}</div>
                    <div>{ask.amount.toFixed(8)}</div>
                    <div className="count_field">{ask.count}</div>
                </div>
            ))}
        </>
    );
};

export default Asks;
