import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Change port if needed

socket.on("connect", () => {
  console.log("Connected to WebSocket server");

  socket.emit("updateLocation", {
    serialNumber: "EVT-12345",
    latitude: 37.7749,
    longitude: -122.4194
  });
});

socket.on("batteryUpdate", (data) => {
  console.log("Battery update received:", data);
});
