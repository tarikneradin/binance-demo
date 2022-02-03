import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Ticker from './Ticker';
import TradeHistory from './TradeHistory';
import OrderBook from './OrderBook';
import Grid from '@mui/material/Grid';
import usePrevious from '../../hooks/usePrevious';

import { BINANCE_API_URL } from '../../config/constants';

function Trade(props) {
  const tradesCount = 20;
  let streams = ['@ticker', `@depth${props.depth}`, '@trade'];

  const [socketUrl] = useState(`wss://stream.binance.com:9443/stream`);
  const [isLoaded, setIsLoaded] = useState(false);
  const [depth, setDepth] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loadedTrades, setLoadedTrades] = useState(false);
  const [ticker, setTicker] = useState(null);
  const [loadedTicker, setLoadedTicker] = useState(false);
  const [loadedDepth, setLoadedDepth] = useState(false);
  const [error, setError] = useState('');
  const prevSymbol = usePrevious(props.symbol);
  const ws = useRef(null);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${BINANCE_API_URL}/aggTrades?limit=${tradesCount}&symbol=${props.symbol.toUpperCase()}`
    })
      .then((response) => {
        setIsLoaded(true);
        setLoadedTrades(true);
        setTrades(response.data || []);
      })
      .catch((error) => {
        setIsLoaded(false);
        setError(error);
      });
  }, []);

  useEffect(() => {
    connectSocketStreams(streams.map((i) => `${props.symbol}${i}`));
  }, []);

  useEffect(() => {
    const newStreams = ['@ticker', `@depth${props.depth}`, '@trade'];

    if (prevSymbol) {
      disconnectSocketStreams();
      connectSocketStreams(newStreams.map((i) => `${props.symbol}${i}`));
    }
  }, [props.depth, props.symbol]);

  function connectSocketStreams(streams) {
    streams = streams.join('/');
    ws.current = new WebSocket(`${socketUrl}?streams=${streams}/@300ms`);

    if (!ws.current) return;

    ws.current.onmessage = (evt) => {
      let eventData = JSON.parse(evt.data);
      if (eventData.stream.endsWith('@ticker')) {
        eventData.data.lastc = ticker ? ticker.c : 0;
        setTicker(eventData.data);
        setLoadedTicker(true);
      }

      if (eventData.stream.endsWith('@trade')) {
        if (trades && Object.keys(trades).length > 0) {
          let newTrades = trades;
          newTrades.push(eventData.data);
          newTrades = newTrades.slice(-1 * tradesCount);
          setTrades(newTrades);
          setLoadedTrades(true);
        }
      }

      if (eventData.stream.endsWith(`@depth${props.depth}`)) {
        setDepth(eventData.data);
        setLoadedDepth(true);
      }

      setIsLoaded(true);
    };
    ws.current.onerror = (evt) => {
      console.error(evt);
    };
  }

  function disconnectSocketStreams() {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loadedTicker ? <Ticker {...ticker} /> : 'loading...'}
        </Grid>
        <Grid item xs={12} sm={4}>
          {loadedTrades ? <TradeHistory trades={trades} /> : 'loading...'}
        </Grid>
        <Grid item xs={12} sm={8}>
          {loadedDepth ? <OrderBook bids={depth.bids} asks={depth.asks} /> : <> </>}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Trade;
