import express from "express";
import { createCategory, getAllCategory, updateCategory, deleteCategory } from "../controller/categoryController.js";

const router = express.Router();


// CREATE CATEGORY
router.post("/create", createCategory);

// UPDATE CATEGORY
router.put("/update/:id", updateCategory);

// GET ALL CATEGORIES
router.get("/", getAllCategory);


// DELETE CATEGORY
router.delete("/delete/:id", deleteCategory);

export default router;