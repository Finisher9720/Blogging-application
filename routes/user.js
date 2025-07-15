const User = require("../models/user");
const express = require("express");
const router = express.Router();

// signup 
router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

// signin page or login
router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchpasswordandgeneratetoken(email, password);
    console.log({ token: token });

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render('signin', {error:'incorrect email or password '})
  }
});

// logout
router.get('/logout', (req, res) => {
  return res.clearCookie('token').redirect('/')
});

module.exports = router;
