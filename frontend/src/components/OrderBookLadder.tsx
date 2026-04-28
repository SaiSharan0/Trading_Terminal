import React, { memo, useMemo } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const OrderBookLadder: React.FC = () => {
  const { data, error } = useWebSocket();

  const bids = useMemo(() => data?.Bids?.slice(0, 15) ?? [], [data]);
  const asks = useMemo(() => data?.Asks?.slice(0, 15) ?? [], [data]);

  const maxSize = useMemo(() => {
    const sizes = [...bids, ...asks].map((level) => level.q);
    return sizes.length ? Math.max(...sizes) : 1;
  }, [bids, asks]);

  if (error) return <div className="text-[var(--ask)]">{error}</div>;
  if (!data) return <div className="text-[var(--terminal-muted)]">Loading...</div>;

  return (
    <div className="h-full border border-[#2a2a2a] bg-black">
      <div className="border-b border-[#2a2a2a] px-2 py-1 text-[11px] text-[var(--highlight)]">
        ORDER BOOK
      </div>
      <div className="grid grid-cols-3 px-2 py-1 text-[10px] text-[var(--terminal-muted)]">
        <span>PRICE</span>
        <span className="text-right">SIZE</span>
        <span className="text-right">VOLUME</span>
      </div>
      <div className="h-[calc(100%-58px)] overflow-y-auto">
        <div className="px-2">
          {asks.map((ask, index) => (
            <div
              key={`ask-${ask.p}-${index}`}
              className={`relative grid grid-cols-3 gap-2 border-b border-[#121212] py-0.5 text-[11px] ${
                index === 0 ? 'text-[var(--highlight)]' : 'text-[var(--ask)]'
              }`}
            >
              <div
                className="absolute inset-y-0 right-0 bg-[var(--ask)]/10"
                style={{ width: `${Math.min((ask.q / maxSize) * 100, 100)}%` }}
              />
              <span className="relative z-10">{ask.p.toFixed(2)}</span>
              <span className="relative z-10 text-right">{ask.q.toFixed(4)}</span>
              <span className="relative z-10 text-right">{(ask.p * ask.q).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2a2a2a]" />
        <div className="px-2">
          {bids.map((bid, index) => (
            <div
              key={`bid-${bid.p}-${index}`}
              className={`relative grid grid-cols-3 gap-2 border-b border-[#121212] py-0.5 text-[11px] ${
                index === 0 ? 'text-[var(--highlight)]' : 'text-[var(--bid)]'
              }`}
            >
              <div
                className="absolute inset-y-0 right-0 bg-[var(--bid)]/10"
                style={{ width: `${Math.min((bid.q / maxSize) * 100, 100)}%` }}
              />
              <span className="relative z-10">{bid.p.toFixed(2)}</span>
              <span className="relative z-10 text-right">{bid.q.toFixed(4)}</span>
              <span className="relative z-10 text-right">{(bid.p * bid.q).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(OrderBookLadder);
