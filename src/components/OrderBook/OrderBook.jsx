import useBusinessLogic from '../../hooks/useBusinessLogic';
import Header from './Header';
import Asks from './Asks';
import Bids from './Bids';

import './styles.css';

const OrderBook = () => {
    useBusinessLogic();

    return (
        <div className="widget">
            <Header />
            <div className="orders_container">
                <div className="half_part">
                    <Bids />
                </div>
                <div className="half_part">
                    <Asks />
                </div>
            </div>
        </div>
    );
};

export default OrderBook;
