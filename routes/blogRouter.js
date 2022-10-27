const router = require("express").Router();
const {
  getBlogs,
  deleteBlog,
  createBlog,
  getBlog,
  updateBlog,
} = require("../controllers/blogController");

router.route("/").get(getBlogs).post(createBlog);
router.get("/get", getBlog);
router.patch("/update", updateBlog);
router.delete("/remove", deleteBlog);

module.exports = router;
