import React from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useAxios from '../../hooks/useAxios';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Trade from './Index';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useParams } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BINANCE_API_URL } from '../../config/constants';

function updateQueryParams(symbolName) {
  if (history.pushState) {
    var newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      `?symbol=${symbolName}`;
    window.history.pushState({ path: newurl }, '', newurl);
  }
}

export default function MarketDepth() {
  const { symbol } = useParams(); //from path {baseUrl}/:symbol

  const query = useQuery();
  const symbolFromQueryParams = query.get('symbol'); //from query params {baseUrl}?symbol={symbol}

  const [symbolPair, setSymbolPair] = useState(symbol || symbolFromQueryParams || '');
  const [decimal, setDecimal] = useState(2);
  const [depth, setDepth] = useState(10);

  const { response, loading, error } = useAxios({
    method: 'GET',
    url: `${BINANCE_API_URL}/exchangeInfo`
  });

  if (error) {
    return 'Error fetching symbol pairs.';
  }

  return (
    <Container>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} style={{ marginTop: 20 }}>
        <FormControl fullWidth>
          <Autocomplete
            loading={loading}
            style={{ marginBottom: 20 }}
            disablePortal
            id="symbol-pairs"
            value={symbolPair.toUpperCase()}
            selected={symbolPair}
            onChange={(event, newValue) => {
              updateQueryParams(newValue.toLowerCase());
              setSymbolPair(newValue);
            }}
            options={
              response && response.symbols ? response.symbols.map((item) => item.symbol) : []
            }
            renderInput={(params) => <TextField {...params} label="Select Crypto Pair" />}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Depth</InputLabel>
          <Select
            id="depth-selector"
            style={{ marginBottom: 20 }}
            value={depth}
            label="Depth"
            onChange={(e) => setDepth(e.target.value)}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Decimal</InputLabel>
          <Select
            id="decimal-selector"
            style={{ marginBottom: 20 }}
            value={decimal}
            label="Decimal"
            onChange={(e) => setDecimal(e.target.value)}>
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {!symbolPair && (
        <Box
          sx={{ display: 'flex', marginTop: '35%', textAlign: 'center', justifyContent: 'center' }}>
          <Typography variant="h5">
            Please select symbol pair in order to see order book demo{' '}
          </Typography>
          <BarChartIcon sx={{ width: 30, height: 30 }} />
        </Box>
      )}

      {symbolPair && <Trade symbol={symbolPair.toLowerCase()} depth={depth} />}
    </Container>
  );
}
