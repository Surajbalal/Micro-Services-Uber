require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const amqp = require('amqplib');
const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blackListToken.model');

let channel;
const RABBITMQ_URL = process.env.RABBIT_URL;


// ✅ Connect to RabbitMQ
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


// ✅ Publish (RPC Pattern)
async function publishToQueue(queue, message) {
    if (!channel) throw new Error('Channel not connected');

    const correlationId = uuidv4();
    const replyQueue = await channel.assertQueue('', { exclusive: true });

    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
            correlationId,
            replyTo: replyQueue.queue
        }
    );

    const response = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("RPC Timeout: No reply received from consumer"));
        }, 5000);

        channel.consume(
            replyQueue.queue,
            (msg) => {
                if (!msg) return;

                if (msg.properties.correlationId === correlationId) {
                    clearTimeout(timeout);
                    const response = JSON.parse(msg.content.toString());
                    channel.cancel(msg.fields.consumerTag).then(() => {
                        channel.deleteQueue(replyQueue.queue);
                        resolve(response);
                    }).catch(() => resolve(response));
                }
            },
            { noAck: true }
        );
    });

    return response;  // ✅ VERY IMPORTANT
}


// ✅ Subscribe (Consumer)
async function subscribeToQueue(queue) {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }

    await channel.assertQueue(queue);

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
            const data = JSON.parse(msg.content.toString());
            let response;

            if (queue === "isBlackList-captain") {
                console.log("recieved",queue);
                response = await blackListTokenModel.findOne({ token: data.token });

            } else if (queue === "get-captain") {
                console.log("recieved",queue,data._id);
                response = await captainModel.findOne({_id:data._id});
                console.log("reponse",response);

            } else if (queue === "get-captainInTheRadius") {
                console.log("Processing get-captainInTheRadius for:", data);
                response = await captainModel.find({
                    location: {
                        $geoWithin: {
                            $centerSphere: [[data.lng, data.lat], data.radius / 6371]
                        }
                    }
                });
                console.log("Query response:", response);

            } else if (queue === "captain-update") {
                response = await captainModel.findByIdAndUpdate(
                    data._id,
                    { $set: data.updateData },
                    { new: true }
                );
            } else if (queue === "CAPTAIN_CREATED") {
                try {
                    const existingCaptain = await captainModel.findOne({ email: data.email });
                    if (!existingCaptain) {
                        await captainModel.create({
                            _id: data.captainId,
                            fullName: {
                                firstName: data.firstName,
                                lastName: data.lastName || ""
                            },
                            email: data.email,
                            vehicle: data.vehicle,
                            location: { type: "Point", coordinates: [0, 0] }
                        });
                        console.log("✅ Synced new captain from Auth:", data.email);
                    }
                    response = { success: true };
                } catch (err) {
                    console.error("❌ Failed to sync captain:", err.message);
                    response = { success: false, error: err.message };
                }
            }

            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(response)),
                {
                    correlationId: msg.properties.correlationId
                }
            );

            channel.ack(msg);

        } catch (err) {
            console.error("Queue processing error:", err);
            
            // Send error reply to prevent the publisher from hanging indefinitely
            if (msg.properties.replyTo) {
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify({ error: err.message })),
                    { correlationId: msg.properties.correlationId }
                );
            }
            channel.ack(msg);
        }
    });
}


module.exports = {
    publishToQueue,
    subscribeToQueue,
    connectRabbitMQ
};