const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async (uri) => {
  if (!uri) {
    console.error(
      chalk.red.bold("❌ Error: MONGO_URI is not defined in .env file")
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(chalk.green.bold("✅ MongoDB connected successfully"));
  } catch (error) {
    console.error(
      chalk.red.bold("❌ MongoDB connection error:"),
      error.message
    );
    process.exit(1);
  }
};

module.exports = connectDB;
