require('dotenv').config();
const {v4: uuidv4} = require('uuid')
const amqp = require('amqplib');
const captainModel = require('../models/captain.model');



let channel;
const RABBITMQ_URL = process.env.RABBIT_URL

// Connect to RabbitMQ using the connection URL from the environment variable
async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
}

// Publish a message to a specific queue
async function publishToQueue(queue,message){
    const correlationId = uuidv4();
         if(!channel) throw new Error('Channel not connected');

         const replyQueue = await channel.assertQueue("", {exclusive: true});

         channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(message)),{
                correlationId,
                replyTo: replyQueue.queue
            }
         );

         const response = await new Promise((resolve)=>{
            channel.consume(replyQueue.queue,(message)=>{
                if(message.properties.correlationId == correlationId){
                    resolve(JSON.parser(message.content.toString()));
                }
            },{noAck: true}
        ) 
        return response;

         })



}
    
// Subscribe to a specific queue
async function subscribeToQueue(queue) {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }
    await channel.assertQueue(queue);
    channel.consume(queue, async(msg) => {
     
        const data = JSON.parse(msg.content.toString());

          let response;

          if(queue == "isBlackList-captain"){
            response = await blackListTokenModel.findOne({token});
          
          } else if(queue == "get-captain"){
            response = await captainModel.findById(data._id);
          } else if(queue == 'get-captainInTheRadius'){

            response = await captainModel.find({
                  location: {
                    $geoWithin: {
                      $centerSphere: [[data.lng, data.lat], data.radius / 6371]
                    }
                  }
                });

          } else if(queue == 'captain-update'){
            response = await captainModel.findByIdAndUpdate(data._id, 
               {$set:data.updateData},
               { new: true }     
            );
          }
         
                  channel.sendToQueue(
                      msg.properties.replyTo,
                      Buffer.from(JSON.stringify(response)),
                      {
                          correlationId: msg.properties.correlationId
                      }
                  );
          
                  channel.ack(msg); 
        
    });
}

// Initialize the RabbitMQ connection


module.exports = {
    publishToQueue,
    subscribeToQueue,
    connectRabbitMQ
};