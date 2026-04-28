import React, { memo, useEffect, useMemo, useState } from 'react';

type Trade = {
  time: string;
  price: number;
  qty: number;
  side: 'BUY' | 'SELL';
};

const TradeTape: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const price = 43000 + Math.random() * 800;
      const qty = Math.random() * 1.2 + 0.01;
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const time = new Date().toLocaleTimeString();

      setTrades((prev) => [{ time, price, qty, side }, ...prev].slice(0, 80));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const rows = useMemo(() => trades, [trades]);

  return (
    <div className="h-full border border-[#2a2a2a] bg-black">
      <div className="border-b border-[#2a2a2a] px-2 py-1 text-[11px] text-[var(--highlight)]">
        TRADE TAPE
      </div>
      <div className="grid grid-cols-3 px-2 py-1 text-[10px] text-[var(--terminal-muted)]">
        <span>TIME</span>
        <span className="text-right">PRICE</span>
        <span className="text-right">QTY</span>
      </div>
      <div className="h-[calc(100%-58px)] overflow-y-auto">
        {rows.map((trade, index) => (
          <div
            key={`${trade.time}-${index}`}
            className={`grid grid-cols-3 gap-2 border-b border-[#121212] px-2 py-0.5 text-[11px] ${
              trade.side === 'BUY' ? 'text-[var(--bid)]' : 'text-[var(--ask)]'
            }`}
          >
            <span className="text-[var(--terminal-muted)]">{trade.time}</span>
            <span className="text-right">{trade.price.toFixed(2)}</span>
            <span className="text-right">{trade.qty.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TradeTape);
