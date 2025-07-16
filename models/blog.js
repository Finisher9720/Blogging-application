const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/yourDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection error:", err));

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    coverImageUrl: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const blog = mongoose.model("blog", blogSchema);

module.exports = blog;
