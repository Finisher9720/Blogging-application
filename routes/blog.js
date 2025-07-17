const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const blog = require("../models/blog");

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

router.post("/", upload.single("coverimage"), async(req, res) => {
  const { title, body } = req.body;
  const newblog = await blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${newblog._id}`);
});

module.exports = router;
