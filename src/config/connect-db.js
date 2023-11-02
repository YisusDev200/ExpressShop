const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_URL } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("db is connected");
  } catch (error) {
    console.log({
      error,
      message: "db connection failed",
    });
  }
};

module.exports = { connectDB };
