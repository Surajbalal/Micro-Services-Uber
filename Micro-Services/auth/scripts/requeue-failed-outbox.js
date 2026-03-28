require("dotenv").config();
const mongoose = require("mongoose");
const Outbox = require("../models/outbox.model");

// Configure the MongoDB URI as needed based on your environment
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/uber-auth";

async function requeueFailedEvents() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("📦 Connected to MongoDB.");

        const result = await Outbox.updateMany(
            { status: "FAILED" },
            { $set: { status: "PENDING", retryCount: 0, lastError: "Manually requeued by Admin." } }
        );

        console.log(`✅ successfully requeued ${result.modifiedCount} FAILED events.`);
    } catch (err) {
        console.error("❌ Error running requeue script:", err);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB.");
    }
}

requeueFailedEvents();
