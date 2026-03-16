import express from "express";
import { createBlog, getAllBlogs, getBlogsByCategory, updateBlog, deleteBlog } from "../controller/blogController.js";



const router = express.Router()


router.post('/create', createBlog)
router.get('/', getAllBlogs)
router.get('/get', getAllBlogs)
// router.get('/getById/:id',getAllBlogs)
router.get('/getByCat/:categoryId', getBlogsByCategory)
router.put('/update/:id', updateBlog)
router.delete('/delete/:id', deleteBlog)






export default router