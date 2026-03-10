import express from "express";
import { Blog } from "../model/category.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Backend Running...");
});


// CREATE BLOG
router.post("/create", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Put data
// UPDATE BLOG
router.put("/update/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,      // the new data from frontend
      { new: true }  // return the updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL BLOGS
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE BLOG
router.delete("/delete/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;