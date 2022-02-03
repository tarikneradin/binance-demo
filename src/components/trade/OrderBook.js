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
