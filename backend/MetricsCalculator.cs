namespace TradingTerminal;

public class MetricsCalculator
{
    public double LOBImbalance { get; private set; }
    public double VPIN { get; private set; }
    public double MarketVIX { get; private set; }
    public long TradeCount { get; private set; }

    public void Update(OrderBookManager orderBook)
    {
        var totalVolume = orderBook.BidVolume + orderBook.AskVolume;
        LOBImbalance = totalVolume == 0
            ? 0
            : (orderBook.BidVolume - orderBook.AskVolume) / totalVolume;

        TradeCount++;
        VPIN = 0.0;
        MarketVIX = 0.0;
    }
}
