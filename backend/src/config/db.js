const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async (uri) => {
    await mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedToplogy: true,
    });
    console.log(chalk.green.bold("MongoDB connected successfully"));
};

mondule.exports = connectDB;