require('dotenv').config();
const port = process.env.PORT;
const http = require('http');
const app = require('./app');
const connect = require('./db/db');
const { initializeSocket } = require('./socket');
const { connectRabbitMQ, subscribeToQueue } = require('./services/rabbit');

const server = http.createServer(app);




initializeSocket(server); // Initialize socket.io
async function bootstrap() {
    try {
        await connectRabbitMQ(); // wait for Rabbit

        await connect(); // connect DB
        

    await subscribeToQueue("isBlackList-user");
    await subscribeToQueue("get-user");
    await subscribeToQueue("update-user");
    await subscribeToQueue("USER_CREATED");
    await subscribeToQueue("new-ride", (data) => {
      console.log("Received:", data);
    });

    server.listen(port, () => {
      console.log(`User services is running on port ${port}`);
    });
  } catch (error) {
     console.error("Startup failed:", error);
        process.exit(1);
  }
}
bootstrap();

