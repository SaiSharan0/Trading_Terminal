import React, { memo } from 'react';
import OrderBookLadder from './OrderBookLadder';
import TradeTape from './TradeTape';
import PriceChart from './PriceChart';
import SpreadChart from './SpreadChart';
import LOBImbalanceChart from './LOBImbalanceChart';
import NewsPanel from './NewsPanel';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-[#2a2a2a] px-3 py-2 text-[12px] text-[var(--highlight)]">
        TRADING TERMINAL | BTC/USD
      </div>

      <div className="grid h-[calc(100vh-36px)] grid-cols-[3fr_7fr] gap-2 p-2">
        <OrderBookLadder />

        <div className="grid grid-rows-[2fr_1fr_1fr] gap-2">
          <PriceChart />

          <div className="grid grid-cols-2 gap-2">
            <LOBImbalanceChart />
            <SpreadChart />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <TradeTape />
            <NewsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
