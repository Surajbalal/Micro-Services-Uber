const express = require("express");
require('dotenv').config();
const port = process.env.PORT
const http = require("http");
const app = require("./app");
const connect = require('./db/db');
const { connectRabbitMQ, subscribeToQueue } = require('./services/rabbit');


const { initializeSocket } = require('./socket');

const server = http.createServer(app);

initializeSocket(server);
async function bootstrap() {
  try {
    await connect(); // connect DB

    await connectRabbitMQ(); // wait for Rabbit

    await subscribeToQueue("new-ride", (data) => {
      console.log("Received:", data);
    });
    await subscribeToQueue("get-captainInTheRadius", (data) => {
      console.log("Received:", data);
    });


    server.listen(port, () => {
      console.log(`Captain services is running on port ${port}`);
    });
  } catch (error) {
     console.error("Startup failed:", error);
        process.exit(1);
  }
}
bootstrap();
