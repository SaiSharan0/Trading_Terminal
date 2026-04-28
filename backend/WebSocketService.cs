using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;

namespace TradingTerminal;

public class WebSocketService
{
    private readonly OrderBookManager _orderBook;
    private readonly MetricsCalculator _metrics;
    private readonly Random _rng = new();

    public WebSocketService(OrderBookManager orderBook, MetricsCalculator metrics)
    {
        _orderBook = orderBook;
        _metrics = metrics;
    }

    public async Task BroadcastDataAsync(HttpContext context)
    {
        using var ws = await context.WebSockets.AcceptWebSocketAsync();

        while (ws.State == WebSocketState.Open && !context.RequestAborted.IsCancellationRequested)
        {
            _orderBook.UpdateWithMock(_rng);
            _metrics.Update(_orderBook);

            var payload = new
            {
                Time = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                LOBImbalance = Math.Round(_metrics.LOBImbalance, 6),
                Spread = Math.Round(_orderBook.Spread, 4),
                MidPrice = _orderBook.MidPrice,
                BidPrice = _orderBook.BidPrice,
                AskPrice = _orderBook.AskPrice,
                TradeCount = _metrics.TradeCount,
                Bids = _orderBook.Bids.Select(b => new { p = b.Price, q = b.Qty }),
                Asks = _orderBook.Asks.Select(a => new { p = a.Price, q = a.Qty })
            };

            var json = JsonConvert.SerializeObject(payload);
            var buffer = Encoding.UTF8.GetBytes(json);

            await ws.SendAsync(
                new ArraySegment<byte>(buffer),
                WebSocketMessageType.Text,
                true,
                context.RequestAborted);

            await Task.Delay(TimeSpan.FromMilliseconds(500), context.RequestAborted);
        }
    }
}
