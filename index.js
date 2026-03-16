import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

const app = express();
dotenv.config()

const startServer = async () => {
  try {
    await connectDB();
    app.listen(5000, () => {
      console.log("🚀 http://localhost:5000 Server running on port 5000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Backend Server is Running!</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", blogRoutes);
app.use("/api/categories", categoryRoutes);


