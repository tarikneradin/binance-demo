# Binance Demo Order Book

- React
- MUI
- WebSockets
- Rest
- Hooks
- Heroku
- GithubActions
- Binance RestAPI and Web Sockets

App is deployed on heroku using Github Actions:

## Development mode `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

## Production mode `npm run build`

## Order Book Doc

Partial Book Depth Streams

Top <levels> bids and asks, pushed every second. Valid <levels> are 5, 10, or 20.

Stream Names: <symbol>@depth<levels> OR <symbol>@depth<levels>@100ms

Update Speed: 1000ms or 100ms

Payload:

{
"lastUpdateId": 160, // Last update ID
"bids": [ // Bids to be updated
[
"0.0024", // Price level to be updated
"10" // Quantity
]
],
"asks": [ // Asks to be updated
[
"0.0026", // Price level to be updated
"100" // Quantity
]
]
}

Diff. Depth Stream
Order book price and quantity depth updates used to locally manage an order book.

Stream Name: <symbol>@depth OR <symbol>@depth@100ms

Update Speed: 1000ms or 100ms

Payload:

{
"e": "depthUpdate", // Event type
"E": 123456789, // Event time
"s": "BNBBTC", // Symbol
"U": 157, // First update ID in event
"u": 160, // Final update ID in event
"b": [ // Bids to be updated
[
"0.0024", // Price level to be updated
"10" // Quantity
]
],
"a": [ // Asks to be updated
[
"0.0026", // Price level to be updated
"100" // Quantity
]
]
}
How to manage a local order book correctly
Open a stream to wss://stream.binance.us:9443/ws/bnbbtc@depth
Buffer the events you receive from the stream
Get a depth snapshot from https://www.binance.us/api/v1/depth?symbol=BNBBTC&limit=1000
Drop any event where u is <= lastUpdateId in the snapshot
The first processed should have U <= lastUpdateId+1 AND u >= lastUpdateId+1
While listening to the stream, each new event's U should be equal to the previous event's u+1
The data in each event is the absolute quantity for a price level
If the quantity is 0, remove the price level
Receiving an event that removes a price level that is not in your local order book can happen and is normal.
