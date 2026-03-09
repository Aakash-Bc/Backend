import express from 'express';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Blog } from './model/catogery.js';
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
// Middleware to parse JSON request bodies

// MongoDB Connection using async/await


// Call connection function
connectDB();

app.get('/', (req, res) => {    
    res.send('Backend is running!.............');
});

app.get("/hello", (req, res) => {
    res.send("Hello from /hello endpoint!");
});

const products = [
{
    id:1,
    name:"Product 1",
    price:10.99
},
{
    id:2,
    name:"Product 2",
    price:19.99
},
{
    id:3,
    name:"Product 3",
    price:5.99
}
];

// Get all products
app.get("/products", (req, res) => {
    console.log("Received request for all products");
    res.json(products);
});
 // Get a product by ID
app.get("/products/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const product = products.find((item) => item.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
});

// Create a new blog
app.post("/blog/create", async (req, res) => {
    try {
        console.log(req.body);

        const blog = await Blog.create(req.body);

        res.status(201).json(blog);
    } catch (error) {
        console.log("REAL ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});
 // Get all blogs
app.get("/blog/getAll", async (req, res) => {
    try {
        // const blogs = await Blog.find();
        const blogs = await Blog.findById("69a3fa916ed0f637df9d73c1");

        res.json(blogs);
    } catch (error) {
        console.log("REAL ERROR:", error);
        res.status(500).json({ message: error.message });
    }   
});

//Delete a blog by ID
app.delete("/blog/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;  
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.log("REAL ERROR:", error);
        res.status(500).json({ message: error.message });
    }   
});

// Get a blog by ID

app.get("/blog/name/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    res.json({ id });
});


//Delete a blog by ID

app.delete("/blog/name/:id", async (req, res) => {
    const { id } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    res.json({
        message: "Blog deleted successfully",
        blog: deletedBlog
    });
});


//Update a blog by ID



app.put("/blog/update-title/:id", async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    // Check if title already exists in database
    const existingBlog = await Blog.findOne({ title });

    if (existingBlog) {
        return res.status(400).json({ message: "Title already exists" });
    }

    // Update blog title
    const blog = await Blog.findByIdAndUpdate(
        id,
        { title },
        { new: true }
    );

    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    res.json({
        message: "Title updated successfully",
        blog
    });
});




app.listen(8000, () => {
    console.log('Server running on port http://localhost:8000 🚀');
});