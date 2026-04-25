import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("Database Connection Failed ❌");
    console.log(error.message);
  }
};