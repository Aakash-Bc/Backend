import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  author: {
    type: String,
    default: "Admin",
  },
  status: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  }
}, {
  timestamps: true
});

export const Blog = mongoose.model("Blog", blogSchema);