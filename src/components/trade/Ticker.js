import React from 'react';
import BigNumber from 'bignumber.js';
import Grid from '@mui/material/Grid';

const Ticker = (props) => (
  <Grid
    container
    spacing={2}
    sx={{ borderBottom: '1px solid #ebebeb', display: 'flex', alignItems: 'center' }}>
    <Grid item xs={6} sm={2}>
      <h2>{props.s}</h2>
    </Grid>
    <Grid item xs={6} sm={2}>
      <div>Last Price</div>
      <span>
        <span
          style={{
            color: new BigNumber(props.c).gte(new BigNumber(props.lastc)) ? 'green' : 'red'
          }}>
          {new BigNumber(props.c).toFormat(null, 1)}
        </span>
      </span>
    </Grid>
    <Grid item xs={6} sm={2}>
      <div>24h Change</div>
      <span>
        <span style={{ color: props.p < 0 ? 'red' : 'green' }}>{`${new BigNumber(props.p).toFormat(
          null,
          1
        )} (${new BigNumber(props.P).toFormat(2, 1)}%)`}</span>
      </span>
    </Grid>
    <Grid item xs={6} sm={2}>
      <div className="font-weight-light text-muted small">24h High</div>
      <span className="font-weight-bold">{new BigNumber(props.h).toFormat(null, 1)}</span>
    </Grid>
    <Grid item xs={6} sm={2}>
      <div className="font-weight-light text-muted small">24h Low</div>
      <span className="font-weight-bold">{new BigNumber(props.l).toFormat(null, 1)}</span>
    </Grid>
    <Grid item xs={6} sm={2}>
      <div className="font-weight-light text-muted small">24h Volume</div>
      <span className="font-weight-bold">
        {new BigNumber(props.q).toFormat(2, 1)}{' '}
        {props.s.length === 7 ? props.s.slice(-4) : props.s.slice(-3)}
      </span>
    </Grid>
  </Grid>
);

export default Ticker;
