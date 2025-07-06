import { Server } from "socket.io";
import http from "http";

const userSocketMap = {};
let ioInstance = null; // Holds the actual io instance

export const getRecieverSocketId = (userId) => {
  return userSocketMap[userId];
};

export const setupSocket = (app) => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  ioInstance = io; // Save the reference for other files

  io.on("connection", (socket) => {
    console.log("✅ A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("❌ A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return { server };
};

// ✅ Safe export of io instance functions
export const io = {
  emit: (...args) => ioInstance?.emit(...args),
  to: (...args) => ioInstance?.to(...args),
};
