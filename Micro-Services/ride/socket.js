const { Server } = require('socket.io');


const { publishToQueue } = require('./services/rabbit');

let io;

// Function to initialize the socket.io server
function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*', // Allow all origins, adjust as needed
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('join',async (data)=>{
            const{userType, userId} = data
            console.log(`join,${userType}`)
            if(userType === "user"){
                // await userModel.findByIdAndUpdate(userId,{socketId: socket.id})
                await publishToQueue('update-user',{
                    
                    _id:userId,updateData:{socketId: socket.id}})
            } else if(userType === "captain"){
              
               await publishToQueue('captain-update',{_id,userId,updateData:{socketId: socket.id}})
            }

        })


    socket.on("join-ride-room", (rideId) => {
    socket.join(rideId);
    console.log(socket.id, "joined ride room:", rideId);
  });

  socket.on("leave-ride-room", (rideId) => {
  socket.leave(rideId);
});


socket.on('update-captain-location', async (data) => {
  const { location, captainId, rideId } = data;

  if (!location || !location.lat || !location.lng) {
    return socket.emit('error', { message: "Invalid location" });
  }


  await publishToQueue('captain-update',{_id:captainId, 
    updateData: {location: {
      type: "Point",
      coordinates: [location.lng, location.lat] 
    }}
  })

  if (rideId) {
    io.to(rideId).emit("captain-live-location", location);
  }
});


        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

// Function to send a message to a specific socket ID
function sendMessageToSocketId(socketId, event, message) {
    if (io) {
        io.to(socketId).emit(event, message);
        console.log("send message called",socketId)
    } else {
        console.error('Socket.io is not initialized. Call initializeSocket first.');
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};