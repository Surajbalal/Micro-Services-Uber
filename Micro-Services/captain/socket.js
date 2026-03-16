const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const captainModel = require("./models/captain.model");

let io;

// Function to initialize the socket.io server
async function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const pubClient = createClient({ url: "redis://localhost:6379" });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userType, userId } = data;
      console.log(`join,${userType}`);
      if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("join-ride-room", (rideId) => {
      socket.join(rideId);
      console.log(socket.id, "joined ride room:", rideId);
    });

    socket.on("leave-ride-room", (rideId) => {
      socket.leave(rideId);
    });

    socket.on("update-captain-location", async (data) => {
      const { location, captainId, rideId } = data;

      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Invalid location" });
      }

      await captainModel.findByIdAndUpdate(captainId, {
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      });

      if (rideId) {
        io.to(rideId).emit("captain-live-location", location);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

// Function to send a message to a specific socket ID
function sendMessageToSocketId(socketId, event, message) {
  if (io) {
    io.to(socketId).emit(event, message);
    console.log("send message called", socketId);
  } else {
    console.error("Socket.io is not initialized. Call initializeSocket first.");
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};
