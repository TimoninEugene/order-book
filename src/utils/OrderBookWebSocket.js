const WEB_SOCKET_ENDPOINT = 'wss://api-pub.bitfinex.com/ws/2';
const CHANNEL_NAME = 'book';
const PAIR = 'tBTCUSD';
const ORDER_BOOK_LENGTH = 25;
const RECONNECT_PERIOD = 1500;

class OrderBookWebSocket {
    constructor() {
        this.subscribers = [];
        this.socket = null;
    }

    connect() {
        this.socket = new WebSocket(WEB_SOCKET_ENDPOINT);

        this.socket.onopen = () => {
            this.socket.send(
                JSON.stringify({
                    event: 'subscribe',
                    channel: CHANNEL_NAME,
                    symbol: PAIR,
                    prec: 'P0',
                    freq: 'F0',
                    len: ORDER_BOOK_LENGTH,
                    subId: 123,
                }),
            );
        };

        this.socket.onmessage = message => this.subscribers.forEach(callback => callback(JSON.parse(message.data)));

        this.socket.onclose = () => setTimeout(() => this.connect(), RECONNECT_PERIOD);

        this.socket.onerror = e => console.error(e);
    }

    addSubscriber(callback) {
        this.subscribers.push(callback);
    }
}

const orderBookWebSocket = new OrderBookWebSocket();
export default orderBookWebSocket;
