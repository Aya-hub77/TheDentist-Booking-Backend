import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const MONGO_URI = process.env.MONGO_URI;
const MAX_RETRIES = 5;
let retries = 0;
function connectWithRetry() {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      retries++;
      console.error(`MongoDB connection error (attempt ${retries}):`, err);
      if (retries < MAX_RETRIES) {
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Retrying in ${delay / 1000}s...`);
        setTimeout(connectWithRetry, delay);
      } else {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }
    });
}
connectWithRetry();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});