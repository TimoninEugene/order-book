import { useSelector } from 'react-redux';

import { selectBids } from '../../store/slices/orders';

const Bids = () => {
    const bids = useSelector(selectBids);

    return (
        <>
            <div className="grid_row">
                <div className="header count_field">Count</div>
                <div className="header">Amount</div>
                <div className="header">Price</div>
            </div>
            {bids.map((bid, index) => (
                <div className="grid_row" key={`bid-${index}`}>
                    <div className="count_data count_field">{bid.count}</div>
                    <div>{bid.amount.toFixed(8)}</div>
                    <div>{bid.price}</div>
                </div>
            ))}
        </>
    );
};

export default Bids;
