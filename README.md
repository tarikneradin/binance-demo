# Binance Demo Order Book

- React
- MUI
- WebSockets
- Rest
- Hooks
- Heroku
- GithubActions
- Binance RestAPI and Web Sockets

Functionalities:

- Trade history
- Tickers
- Ask/Bid table
- Depth selector
- Symbol selector
- Ask/Bid selector
- Decimal selector (TODO)
- Manage order book locally (TODO)

App is deployed on heroku using Github Actions pipeline: https://binance-demo.herokuapp.com/ or to target specific symbol pair https://binance-demo.herokuapp.com/?symbol=ethusdt

## Development mode `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

## Production mode `npm run build`

## Order Book Doc

Partial Book Depth Streams (DONE)
Top <levels> bids and asks, pushed every second. Valid <levels> are 5, 10, or 20.

Stream Names: <symbol>@depth<levels> OR <symbol>@depth<levels>@100ms

Update Speed: 1000ms or 100ms

## How to manage a local order book correctly (TODO)

- Diff. Depth Stream

Order book price and quantity depth updates used to locally manage an order book.
Stream Name: <symbol>@depth OR <symbol>@depth@100ms

Update Speed: 1000ms or 100ms

- How to manage a local order book correctly
- Open a stream to wss://stream.binance.us:9443/ws/bnbbtc@depth
- Buffer the events you receive from the stream
- Get a depth snapshot from https://www.binance.us/api/v1/depth?symbol=BNBBTC&limit=1000
- Drop any event where u is <= lastUpdateId in the snapshot
- The first processed should have U <= lastUpdateId+1 AND u >= lastUpdateId+1
- While listening to the stream, each new event's U should be equal to the previous event's u+1
- The data in each event is the absolute quantity for a price level
- If the quantity is 0, remove the price level
- Receiving an event that removes a price level that is not in your local order book can happen and is normal.
