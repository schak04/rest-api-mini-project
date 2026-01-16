const mongoose = require('mongoose');

const connectDB = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected");
    }
    catch(err) {
        console.error("Error connecting DB:", err);
    }
}

module.exports = connectDB;