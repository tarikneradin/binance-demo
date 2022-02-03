import React from 'react';
// import useWebSocket, { ReadyState } from 'react-use-websocket';
import Container from '@mui/material/Container';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Copyright from './components/layout/Copyright';
import MarketDepth from './components/trade/MarketDepth';

export default function App() {
  return (
    <Container>
      <Header />
      <Routes>
        <Route path="/" element={<MarketDepth />} />
        <Route path="/trade/:symbol" element={<MarketDepth />} />
        <Route path="*">NO PAGE FOUND</Route>
      </Routes>
      <Copyright />
    </Container>
  );
}
