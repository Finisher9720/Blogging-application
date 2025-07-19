const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const blog = require("../models/blog");
const comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// GET route
router.get("/add-new", (req, res) => {
  return res.render("addblog", { user: req.user });
});

router.get("/:id", async (req, res) => {
  const Blog = await blog.findById(req.params.id).populate("createdBy");
  const comments = await comment.find({blogId: req.params.id}).populate("createdBy");
  return res.render("blog", { user: req.user, Blog ,comments});
});

router.post("/", upload.single("coverimage"), async (req, res) => {
  const { title, body } = req.body;
  const newblog = await blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${newblog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  const comments = await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;
