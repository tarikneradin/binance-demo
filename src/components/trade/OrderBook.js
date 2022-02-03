import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LinearProgress from '@mui/material/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const styles = () => ({
  colorPrimary: {
    backgroundColor: '#ffffff'
  },
  barColorPrimary: {
    backgroundColor: '#FF0000'
  },
  barColorSecondary: {
    backgroundColor: '#007500'
  }
});

const OrderRow = withStyles(styles)((props) => {
  return (
    <ListItem
      key={`${props.i}:${props.ba[0]}:${props.ba[1]}`}
      style={{ width: '100%', color: props.type === 'bg-success' ? 'green' : 'red' }}>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}>
        <span>{new BigNumber(props.ba[0]).toFormat(null, 1)}</span>
        {'          '} {'          '} {'          '}
        <span>{new BigNumber(props.ba[1]).toFormat(null, 1)}</span>
        <LinearProgress
          sx={{
            width: 300
          }}
          classes={{
            colorPrimary: props.classes.colorPrimary,
            barColorPrimary:
              props.type === 'bg-success'
                ? props.classes.barColorSecondary
                : props.classes.barColorPrimary
          }}
          variant="determinate"
          value={new BigNumber(props.diff).minus(props.ba[0]).div(props.max).multipliedBy(100)}
        />
      </Stack>
    </ListItem>
  );
});

const OrderBook = (props) => {
  const [viewType, setViewType] = useState('ASK/BID');

  let bids = [];
  let asks = [];

  let numRowsBid = Math.min(20, props.bids.length);
  let numRowsAsk = Math.min(20, props.asks.length);
  let maxBid = BigNumber.maximum(props.bids.map((bid) => bid[0]));
  let minAsk = BigNumber.minimum(props.asks.map((ask) => ask[0]));

  let minBid = new BigNumber(maxBid).minus(BigNumber.minimum(props.bids.map((bid) => bid[0])));
  let maxAsk = new BigNumber(minAsk).minus(BigNumber.maximum(props.asks.map((ask) => ask[0])));

  for (var b = 0; b < numRowsBid; b++) {
    const orderRowBid = (
      <OrderRow i={b} ba={props.bids[b]} diff={maxBid} max={minBid} type={'bg-success'} />
    );

    bids.push(orderRowBid);
  }
  for (var a = 0; a < numRowsAsk; a++) {
    const orderRowAsk = (
      <OrderRow i={a} ba={props.asks[a]} diff={minAsk} max={maxAsk} type={'bg-danger'} />
    );

    asks.unshift(orderRowAsk);
  }

  return (
    <Grid>
      <h2> Order Book </h2>

      <List
        sx={{
          color: 'black',
          borderRadius: '6px',
          marginTop: '20px',
          width: '100%',
          border: '1px solid #ebebeb'
        }}>
        <ListItem style={{ padding: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Select
                label="Select OrderBook View"
                id="orderbook-table"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}>
                <MenuItem value={'ASK/BID'}>Ask/Bid</MenuItem>
                <MenuItem value={'ASK'}>Ask</MenuItem>
                <MenuItem value={'BID'}>Bid</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </ListItem>
        <Grid container sx={{ marginLeft: '15px' }}>
          <Grid item xs={3}>
            <p> Price </p>
          </Grid>
          <Grid item xs={3}>
            <p> Order Size</p>
          </Grid>
        </Grid>
        {viewType === 'ASK' && <> {asks} </>}
        {viewType === 'BID' && <> {bids} </>}
        {viewType === 'ASK/BID' && (
          <>
            {asks}
            {bids}{' '}
          </>
        )}
      </List>
    </Grid>
  );
};

export default OrderBook;

//show buy, sell table, show both
//show market deepth chart using highcharts
//show selector
//add depth selector
//add group selector
//get market depth
//looking into binance API and web socket streams documentation I realized that I can took two approaches:

//refactor everything to MUI
//refactor everything to use effects
//adjust UI and CSS
//adjust remove subscription
//restructure components, folder sttructure, extract to constants
//final code improvements, polishing
//deploy to heroku

//Partial Book Depth Streams VS Diff. Depth Stream
//Having in mind that first one will resolve depth out the box, I'm going with that approach for this demo.
//The second approach would assume handling order book locally, fetching initial depth snapshot via REST API and updating data with web scoket streams
//In that approach depth and decimal selector(aggregation) logic would be handled locally for what I would need a bit more(and knowledge) considering my current full time job.

//Partial Book Depth Streams

//Top <levels> bids and asks, pushed every second. Valid <levels> are 5, 10, or 20.

// Stream Names: <symbol>@depth<levels> OR <symbol>@depth<levels>@100ms

// Update Speed: 1000ms or 100ms

// Payload:

// {
//   "lastUpdateId": 160,  // Last update ID
//   "bids": [             // Bids to be updated
//     [
//       "0.0024",         // Price level to be updated
//       "10"              // Quantity
//     ]
//   ],
//   "asks": [             // Asks to be updated
//     [
//       "0.0026",         // Price level to be updated
//       "100"            // Quantity
//     ]
//   ]
// }

// Diff. Depth Stream
// Order book price and quantity depth updates used to locally manage an order book.

// Stream Name: <symbol>@depth OR <symbol>@depth@100ms

// Update Speed: 1000ms or 100ms

// Payload:

// {
//   "e": "depthUpdate", // Event type
//   "E": 123456789,     // Event time
//   "s": "BNBBTC",      // Symbol
//   "U": 157,           // First update ID in event
//   "u": 160,           // Final update ID in event
//   "b": [              // Bids to be updated
//     [
//       "0.0024",       // Price level to be updated
//       "10"            // Quantity
//     ]
//   ],
//   "a": [              // Asks to be updated
//     [
//       "0.0026",       // Price level to be updated
//       "100"           // Quantity
//     ]
//   ]
// }
// How to manage a local order book correctly
// Open a stream to wss://stream.binance.us:9443/ws/bnbbtc@depth
// Buffer the events you receive from the stream
// Get a depth snapshot from https://www.binance.us/api/v1/depth?symbol=BNBBTC&limit=1000
// Drop any event where u is <= lastUpdateId in the snapshot
// The first processed should have U <= lastUpdateId+1 AND u >= lastUpdateId+1
// While listening to the stream, each new event's U should be equal to the previous event's u+1
// The data in each event is the absolute quantity for a price level
// If the quantity is 0, remove the price level
// Receiving an event that removes a price level that is not in your local order book can happen and is normal.
