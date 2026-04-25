import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { getNews } from "./controller/newsController.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  "https://react-o9t7.vercel.app", // Primary Vercel URL
  "http://localhost:5173",        // Vite Dev
  "http://localhost:3000",        // Alternative Dev
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const isVercel = origin.endsWith(".vercel.app");
    const isAllowed = allowedOrigins.includes(origin);
    
    if (isAllowed || isVercel) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- Routes ---
app.get("/", (req, res) => {
  res.send("<h1>🚀 Backend Server is Running!</h1><p>API is available at <a href='/api'>/api</a></p>");
});

app.get("/api", (req, res) => {
  res.json({ 
    status: "success", 
    message: "API is reachable",
    endpoints: ["/api/auth", "/api/blogs", "/api/categories", "/api/news"]
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.get("/api/news", getNews);

// Use /api/blogs for all blog related operations
app.use("/api/blogs", blogRoutes);

// --- Server Startup ---
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
