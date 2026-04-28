import React, { memo, useEffect, useRef } from 'react';
import { createChart, type UTCTimestamp } from 'lightweight-charts';
import { useWebSocket } from '../hooks/useWebSocket';

const PriceChart: React.FC = () => {
  const { data } = useWebSocket();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const seriesRef = useRef<ReturnType<ReturnType<typeof createChart>['addLineSeries']> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { background: { color: '#000000' }, textColor: '#ffffff' },
      grid: { vertLines: { color: '#111111' }, horzLines: { color: '#111111' } },
      rightPriceScale: { borderColor: '#2a2a2a' },
      timeScale: { borderColor: '#2a2a2a', timeVisible: true },
      crosshair: { vertLine: { color: '#ffd700' }, horzLine: { color: '#ffd700' } }
    });

    const series = chart.addLineSeries({ color: '#ffd700', lineWidth: 2 });
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !data) return;
    const time = Math.floor(Date.now() / 1000) as UTCTimestamp;
    seriesRef.current.update({ time, value: data.MidPrice });
  }, [data]);

  return (
    <div className="h-full border border-[#2a2a2a] bg-black">
      <div className="border-b border-[#2a2a2a] px-2 py-1 text-[11px] text-[var(--highlight)]">
        MID PRICE
      </div>
      <div ref={containerRef} className="h-[calc(100%-28px)]" />
    </div>
  );
};

export default memo(PriceChart);
