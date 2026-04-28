import { useEffect, useState } from 'react';

type OrderBookLevel = {
  p: number;
  q: number;
};

type StreamData = {
  Time: string;
  LOBImbalance: number;
  Spread: number;
  MidPrice: number;
  BidPrice: number;
  AskPrice: number;
  TradeCount: number;
  Bids: OrderBookLevel[];
  Asks: OrderBookLevel[];
};

export const useWebSocket = () => {
  const [data, setData] = useState<StreamData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/ws');

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data) as StreamData;
        setData(json);
      } catch {
        setError('WebSocket parse error');
      }
    };

    ws.onerror = () => setError('WebSocket connection error');

    return () => ws.close();
  }, []);

  return { data, error };
};
