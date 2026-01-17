const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleSignIn);
router.post("/apple", authController.appleSignIn);
module.exports = router;
