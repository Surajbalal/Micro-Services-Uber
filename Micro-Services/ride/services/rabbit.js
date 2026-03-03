require('dotenv').config();
const {v4: uuidv4} = require('uuid')
const amqp = require('amqplib');


let channel;
const RABBITMQ_URL = process.env.RABBIT_URL
console.log(RABBITMQ_URL,'hello this is rabbit url');

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
async function publishToQueue(queue, message) {
    if (!channel) throw new Error('Channel not connected');
    console.log("publish to",queue);
    const correlationId = uuidv4();
    const replyQueue = await channel.assertQueue('', { exclusive: true });

    const responsePromise = new Promise((resolve) => {
        channel.consume(
            replyQueue.queue,
            (msg) => {
                if (!msg) return;

                if (msg.properties.correlationId === correlationId) {
                    resolve(JSON.parse(msg.content.toString()));
                }
            },
            { noAck: true }
        );
    });

    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
            correlationId,
            replyTo: replyQueue.queue
        }
    );

    return await responsePromise;
}
    
// Subscribe to a specific queue
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

            console.log("Received:", queue);

            // Example logic
            if (queue === "isBlackList-captain") {
                response = { success: true };
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
            console.error("Consumer error:", err);
            channel.ack(msg);
        }
    });
}
// Initialize the RabbitMQ connection


module.exports = {
    publishToQueue,
    subscribeToQueue,
    connectRabbitMQ
};