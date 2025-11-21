const express = require("express");
const router = express.Router();

const { translateText } = require("../controllers/translateController");
const { translateLimiter } = require("../middleware/rateLimiter");

router.post("/",translateLimiter, translateText);

module.exports = router;