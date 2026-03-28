const mongoose = require('mongoose');
const connectToDb = async() => {

    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("MongoDB Connected Successfully");
        
    } catch (error) {
         console.error("MongoDB Connection Failed:", error.message);
         process.exit(1);
    }

}
module.exports = connectToDb;