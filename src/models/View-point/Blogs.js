import mongoose from 'mongoose';

const blogItemSchema = new mongoose.Schema({
  imageIconurl: { type: String, required: true },
  category: { type: String },
  blogName: { type: String, required: true },
  description: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogsSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  blogs: [blogItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ViewPointBlogs = mongoose.models.ViewPointBlogs || mongoose.model("ViewPointBlogs", blogsSchema, "view_point_blogs");

export default ViewPointBlogs;
