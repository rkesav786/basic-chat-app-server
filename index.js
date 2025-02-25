const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());

const server = app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("🔌 New client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString()); // Convert Buffer to JSON
      console.log("📩 Received:", data);

      // **Send the message to ALL clients (including sender)**
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error("❌ Error parsing message:", error);
    }
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});
  