// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const blogSchema = new Schema({
//   title: String,
//   description : String,
// //   title:{
// //     type: String,
// //     required: true,
// //     unique: true    
// //   }

// status: Boolean
  
  
  
//   // String is shorthand for {type: String}
// //   author: String,
// //   body: String,
// //   comments: [{ body: String, date: Date }],
// //   date: { type: Date, default: Date.now },
// //   hidden: Boolean,
// //   meta: {
// //     votes: Number,
// //     favs: Number
//   //}
// });
// export const Blog = mongoose.model('Blog', blogSchema);



import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
});

export const Category = mongoose.model("Category", categorySchema);
