const asyncHandler = require("express-async-handler");
const Blog = require("../model/blogsSchema");
const User = require("../model/userModel");

//Returns a list of all the Blogs from the database
const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ _id: -1 });
  return res.status(200).json({ blogs, ok: true });
});

//Returns an object of the requested Blog
//Search by Blogname in query params
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    throw new Error(`Invalid id -> ${id}`);
  }

  const blog = await Blog.findById(id);

  //confirm whether Blog exists
  if (!blog) {
    res.status(400);
    throw new Error(`Invalid id -> ${id}`);
  }

  return res.status(200).json({ blog, ok: true });
});

// returns the created Blog object
const createBlog = asyncHandler(async (req, res) => {
  const { title, body, category, tags } = req.body;

  //return a bad request if all the fields have not been provided
  if (!title && !body && !category) {
    res.status(400);
    throw new Error("Please ensure title, body and category fields");
  }

  //check from the database whether the blog title exists
  const blog = await Blog.findOne({ title });
  const user = await User.findOne({ username: req.username });

  if (blog) {
    res.status(409);
    throw new Error("Blogtitle already exists");
  }

  //proceed with saving the Blog in the db
  const newBlog = await Blog.create({ ...req.body, user: user._id });
  return res.status(201).json({ newBlog, ok: true });
});

// returns the updated blog id if successful
const updateBlog = asyncHandler(async (req, res) => {
  //get the blogid from the query params
  if (!req.query.id) {
    res.status(400);
    throw new Error("Please provide blog id");
  }

  //get the Blog from the database
  const blog = await Blog.findById(req.query.id);
  const user = await User.findOne({ username: req.username });

  // //ensure that the Blog is found
  if (!blog) {
    res.status(400);
    throw new Error(`Invalid id -> ${req.query.id}`);
  }

  console.log(typeof blog.user);
  console.log(typeof user._id);
  //ensure that the blog is owned by the user
  if (String(blog.user) !== String(user._id)) {
    res.status(401);
    throw new Error(`Not Authorised`);
  }

  //update the blog
  await Blog.updateOne({ user: blog.user }, { $set: req.body });

  return res
    .status(200)
    .json({ message: `Blog ${blog._id} deleted`, ok: true });
});

// returns the deleted blog id if successful
const deleteBlog = asyncHandler(async (req, res) => {
  //get the blogid from the query params
  if (!req.query.id) {
    res.status(400);
    throw new Error("Please provide blog id");
  }

  //get the Blog from the database
  const blog = await Blog.findById(req.query.id);
  const user = await User.findOne({ username: req.username });

  //ensure that the blog is owned by the user
  if (String(blog.user) != String(user._id)) {
    return res.status(401).json({ message: "Not Authorised" });
  }

  //delete the blog from the db
  await Blog.deleteOne({ title: blog.title });
  return res
    .status(200)
    .json({ message: `Blog ${blog._id} deleted`, ok: true });
});

module.exports = { getBlog, getBlogs, createBlog, updateBlog, deleteBlog };
