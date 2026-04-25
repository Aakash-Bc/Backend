import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { getNews } from "./controller/newsController.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

const app = express();
dotenv.config()

const startServer = async () => {
  try {
    await connectDB();
     const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

const allowedOrigins = [
  "https://react-o9t7.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Backend Server is Running!</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.get("/api/news", getNews);


