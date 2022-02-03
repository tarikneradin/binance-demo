import React from 'react';
import BigNumber from 'bignumber.js';
import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';

const TradeHistory = (props) => {
  let currentp = new BigNumber(0);
  let rows = [];
  let numRows = props.trades.length;
  for (var i = 0; i < numRows; i++) {
    let newp = new BigNumber(props.trades[i].p);

    rows.unshift(
      <ListItem
        key={`${i}:${props.trades[i].p}:${props.trades[i].q}:${props.trades[i].T}`}
        sx={{ borderTop: '1px solid #ebebeb' }}>
        <Stack
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
          direction={{ xs: 'row' }}
          spacing={2}>
          <span style={{ color: newp.gte(currentp) ? 'green' : 'red' }}>
            {newp.toFormat(null, 1)}
          </span>
          <span> {new BigNumber(props.trades[i].q).toFormat(null, 1)} </span>
          <span> {new Date(props.trades[i].T).toLocaleTimeString()} </span>
        </Stack>
      </ListItem>
    );
    currentp = new BigNumber(props.trades[i].p);
  }

  return (
    <Grid>
      <h2>Trade History</h2>
      <List sx={{ width: '100%' }}>{rows}</List>
    </Grid>
  );
};

export default TradeHistory;
