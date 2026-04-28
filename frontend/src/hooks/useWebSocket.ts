import { useEffect, useRef, useState } from 'react';

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
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    ws.onerror = () => {
      setError('WebSocket connection error');
      startMockFeed();
    };

    ws.onclose = () => {
      if (!data) {
        startMockFeed();
      }
    };

    return () => {
      ws.close();
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
      }
    };
  }, []);

  const startMockFeed = () => {
    if (mockIntervalRef.current) return;

    mockIntervalRef.current = setInterval(() => {
      const mid = 43000 + Math.random() * 800;
      const spread = 5 + Math.random() * 15;
      const bid = mid - spread / 2;
      const ask = mid + spread / 2;

      const buildLevels = (start: number, dir: number) =>
        Array.from({ length: 15 }, (_, i) => {
          const price = start + dir * (i + 1) * 3;
          const qty = Math.random() * 2 + 0.05;
          return { p: Number(price.toFixed(2)), q: Number(qty.toFixed(4)) };
        });

      const bids = buildLevels(bid, -1);
      const asks = buildLevels(ask, 1);

      const next: StreamData = {
        Time: new Date().toISOString(),
        LOBImbalance: Math.random() * 0.4 - 0.2,
        Spread: Number(spread.toFixed(4)),
        MidPrice: Number(mid.toFixed(2)),
        BidPrice: Number(bid.toFixed(2)),
        AskPrice: Number(ask.toFixed(2)),
        TradeCount: Math.floor(Math.random() * 2000),
        Bids: bids,
        Asks: asks,
      };

      setData(next);
    }, 800);
  };

  return { data, error };
};
