// --------------------------
// Required Modules Import
// --------------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");

// function import
const { checkforauthenticationcookie } = require("./middleware/authentication");

// Database & Middleware Imports
// const { connecttomongodb } = require("./connection");
// const URL = require("./models/url");

// Route Imports
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
// --------------------------
// Express App Initialization
// --------------------------
const app = express();
const PORT = process.env.PORT || 3000;
// --------------------------
// Middleware Setup
// --------------------------
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieparser());
app.use(checkforauthenticationcookie("token"));


// --------------------------
// Database Connection
// --------------------------
//connecttomongodb("mongodb://localhost:27017/myshorturl");
// --------------------------
// View Engine Configuration (EJS)
// --------------------------
app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); // Set views directory
// --------------------------
// Route Handlers
// --------------------------
// Protected Routes (require auth)

// Public Routes (check auth but allow access)
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// --------------------------
// Server Startup
// --------------------------
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:3000`);
});
