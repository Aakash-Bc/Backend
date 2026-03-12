import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import { connectDB } from "./config/db.js";
import { Blog } from "./model/category.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Backend Server is Running!</h1>");
});

app.use("/api", categoryRoutes);

app.listen(8000, () => {
  console.log("🚀 http://localhost:8000 Server running on port 8000");
});