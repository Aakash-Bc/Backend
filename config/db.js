import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("DB URL exists:", !!process.env.DB_URL);

    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("Database Connection Failed ❌");
    console.log("Error:", error.message);
  }
};