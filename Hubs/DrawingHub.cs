
using Microsoft.AspNetCore.SignalR;

public class DrawingHub : Hub
{
   
    public async Task BroadcastDrawing(string drawingData)
    {
        await Clients.All.SendAsync("ReceiveDrawing", drawingData);
    }

    
    public async Task BroadcastClearCanvas()
    {
        await Clients.All.SendAsync("ClearCanvas");
    }

   
    public async Task SendMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }
}
