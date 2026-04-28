using TradingTerminal;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<OrderBookManager>();
builder.Services.AddSingleton<MetricsCalculator>();
builder.Services.AddSingleton<WebSocketService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseWebSockets();

app.MapControllers();

app.Map("/ws", async context =>
{
    if (!context.WebSockets.IsWebSocketRequest)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    var service = context.RequestServices.GetRequiredService<WebSocketService>();
    await service.BroadcastDataAsync(context);
});

app.MapGet("/", () => "Trading Terminal - Connect to ws://localhost:5000/ws");

app.Run();
