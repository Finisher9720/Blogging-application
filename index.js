// --------------------------
// Required Modules Import
// --------------------------
const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");

// Database & Middleware Imports
// const { connecttomongodb } = require("./connection");
// const URL = require("./models/url");

// Route Imports
//const userRoute = require("./routes/user");
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
  res.render("home");
});



app.use("/user", userRoute);

// --------------------------
// Server Startup
// --------------------------
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:3000`);
});
