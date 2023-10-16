const mongoose = require('mongoose');

const URI = "mongodb+srv://[URL]";

const connectDB = async () =>
{
    await mongoose.connect(URI);

    console.log("Mongodb connected...");
}

module.exports =  connectDB;


