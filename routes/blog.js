const express = require("express");
const router = express.Router();

// GET route
router.get("/add-new", (req, res) => {
  return res.render("addblog", { user: req.user });
});

router.post('/', (req, res) => {
    console.log(req.body);
  
});

module.exports = router;
