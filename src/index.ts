import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./Route/userRouter";
import { errorHandler } from "./exceptions/error/errorHandler";
import authRouter from "./Route/authRouth";
import evtolRouter from "./Route/evtolRouter";
import medicationRouter from "./Route/medicationRoute";
import { db } from "./configs/db";
import { setupWebSocket } from "./service/implementation/websocketImpl";
import fleetrouter from "./Route/fleetRoute";

dotenv.config();

const portEnv = process.env.PORT;
if (!portEnv) {
  console.error("Error: PORT is not defined in .env file");
  process.exit(1);
}

const PORT: number = parseInt(portEnv, 10);
if (isNaN(PORT)) {
  console.error("Error: PORT is not a number in .env file");
  process.exit(1);
}

const app = express();
const server = createServer(app); // Create HTTP server for WebSocket
const io = new Server(server, {
  cors: { origin: "*" }
});

const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: "*",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
};

app.use(cors(corsOptions));
app.use(express.json());

setupWebSocket(io);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/login", authRouter);
app.use("/api/v1/evtol", evtolRouter);
app.use("/api/v1/medication", medicationRouter);
app.use("/api/v1/fleet", fleetrouter)
app.use(errorHandler);

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { io, server };