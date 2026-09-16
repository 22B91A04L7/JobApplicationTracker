const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

//route to signup controller
router.post("/signup", signup);

//route to login controller
router.post("/login", login);

module.exports = router;
