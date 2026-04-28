using System.Globalization;

namespace TradingTerminal;

public class OrderBookManager
{
    public double MidPrice { get; private set; }
    public double BidPrice { get; private set; }
    public double AskPrice { get; private set; }
    public double BidVolume { get; private set; }
    public double AskVolume { get; private set; }

    public List<Level> Bids { get; private set; } = new();
    public List<Level> Asks { get; private set; } = new();

    public double Spread => AskPrice - BidPrice;
    public double SpreadPercentage => MidPrice == 0 ? 0 : Spread * 100 / MidPrice;

    public void Update(OrderBookUpdate update)
    {
        Bids = update.Bids.Select(b => new Level
        {
            Price = ParseDouble(b.P),
            Qty = ParseDouble(b.Q)
        }).Select(l =>
        {
            l.Total = l.Qty * l.Price;
            return l;
        }).ToList();

        Asks = update.Asks.Select(a => new Level
        {
            Price = ParseDouble(a.P),
            Qty = ParseDouble(a.Q)
        }).Select(l =>
        {
            l.Total = l.Qty * l.Price;
            return l;
        }).ToList();

        if (Bids.Count == 0 || Asks.Count == 0)
        {
            return;
        }

        BidPrice = Bids.First().Price;
        AskPrice = Asks.First().Price;
        BidVolume = Bids.Sum(l => l.Total);
        AskVolume = Asks.Sum(l => l.Total);
        MidPrice = (BidPrice + AskPrice) / 2;
    }

    public void UpdateWithMock(Random rng)
    {
        var mid = rng.NextDouble() * 5000 + 48000;
        var spread = rng.NextDouble() * 20 + 2;
        BidPrice = Math.Round(mid - spread / 2, 2);
        AskPrice = Math.Round(mid + spread / 2, 2);
        MidPrice = Math.Round(mid, 2);

        Bids = BuildLevels(rng, BidPrice, -1);
        Asks = BuildLevels(rng, AskPrice, 1);

        BidVolume = Bids.Sum(l => l.Total);
        AskVolume = Asks.Sum(l => l.Total);
    }

    private static List<Level> BuildLevels(Random rng, double start, int direction)
    {
        var levels = new List<Level>();
        for (var i = 0; i < 10; i++)
        {
            var price = Math.Round(start + direction * (i + 1) * 2, 2);
            var qty = Math.Round(rng.NextDouble() * 2 + 0.1, 4);
            levels.Add(new Level
            {
                Price = price,
                Qty = qty,
                Total = Math.Round(price * qty, 4)
            });
        }

        return levels;
    }

    private static double ParseDouble(string value)
    {
        return double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var parsed)
            ? parsed
            : 0;
    }
}

public class Level
{
    public double Price { get; set; }
    public double Qty { get; set; }
    public double Total { get; set; }
}

public class OrderBookUpdate
{
    public List<BinanceOrderBook> Bids { get; set; } = new();
    public List<BinanceOrderBook> Asks { get; set; } = new();
    public string Symbol { get; set; } = string.Empty;
}

public class BinanceOrderBook
{
    public string P { get; set; } = "0";
    public string Q { get; set; } = "0";
}
