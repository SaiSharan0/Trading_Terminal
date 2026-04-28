import React, { memo } from 'react';

const items = [
  { time: '09:42', title: 'BTC surges on ETF optimism' },
  { time: '09:35', title: 'Whales accumulating BTC' },
  { time: '09:15', title: 'Fed signals rate pause' },
];

const NewsPanel: React.FC = () => {
  return (
    <div className="h-full border border-[#2a2a2a] bg-black">
      <div className="border-b border-[#2a2a2a] px-2 py-1 text-[11px] text-[var(--highlight)]">
        NEWS
      </div>
      <div className="h-[calc(100%-28px)] overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={`${item.time}-${index}`}
            className="border-b border-[#1a1a1a] px-2 py-1 text-[11px]"
          >
            <div className="text-[10px] text-[var(--terminal-muted)]">{item.time}</div>
            <div className="text-white">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(NewsPanel);
