
// Initialize the SignalR connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/drawingHub")
    .build();

// Start the SignalR connection
connection.start().catch(err => console.error(err.toString()));

// Canvas drawing logic
const canvas = document.getElementById("drawingCanvas");
const context = canvas.getContext("2d");

// Variables to track drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set drawing properties
context.strokeStyle = '#000';
context.lineJoin = 'round';
context.lineCap = 'round';
context.lineWidth = 5;

// Mouse down event
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

// Mouse move event
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(currentX, currentY);
    context.stroke();

    // Send drawing data to the hub
    const data = JSON.stringify({ lastX, lastY, currentX, currentY });
    connection.invoke("BroadcastDrawing", data)
        .catch(err => console.error(err.toString()));

    lastX = currentX;
    lastY = currentY;
});

// Mouse up or leave event
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseleave", () => isDrawing = false);

// Listen for drawing updates
connection.on("ReceiveDrawing", (data) => {
    const parsedData = JSON.parse(data);
    context.beginPath();
    context.moveTo(parsedData.lastX, parsedData.lastY);
    context.lineTo(parsedData.currentX, parsedData.currentY);
    context.stroke();
});

// Clear canvas functionality
document.getElementById("clearCanvas").addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    connection.invoke("BroadcastClearCanvas").catch(err => console.error(err.toString()));
});

// Listen for clear canvas command
connection.on("ClearCanvas", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
});

// Save drawing functionality
document.getElementById("saveCanvas").addEventListener("click", () => {
    const dataUrl = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "drawing.png";
    link.click();
});

// Chat functionality
document.getElementById("sendChat").addEventListener("click", function () {
    const message = document.getElementById("chatInput").value;
    if (message.trim() !== "") {
        connection.invoke("SendMessage", message)
            .catch(err => console.error(err.toString()));
        document.getElementById("chatInput").value = "";
    }
});

// Listen for chat messages
connection.on("ReceiveMessage", (message) => {
    const messagesContainer = document.getElementById("messages");
    const newMessage = document.createElement("div");
    newMessage.textContent = message;
    messagesContainer.appendChild(newMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
