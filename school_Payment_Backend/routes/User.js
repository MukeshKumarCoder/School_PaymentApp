const router = require("express").Router();
const { signUp, login, logout } = require("../controllers/Auth");
const { auth } = require("../middleware/auth");

// Auth Routes
router.post("/login", login);
router.get("/logout", auth, logout);
router.post("/signup", signUp);

module.exports = router;
