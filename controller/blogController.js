import { Blog } from "../model/blog.js"

export const createBlog = async (req, res) => {
    try {
        const createdBlog = await Blog.create(req.body)
        res.json(createdBlog)
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const getAllBlogs = async (req, res) => {
    const ok = await Blog.find().populate("category")
    // find().populate("category" , "-status")

    res.json(ok)

}

export const getBlogsByCategory = async (req, res) => {
    const categoryFromFrontend = req.params.categoryId
    const blogs = await Blog.find({ category: categoryFromFrontend })
    res.json(blogs)
}
export const updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
