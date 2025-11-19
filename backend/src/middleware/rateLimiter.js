// prevents abuse & runaway costs.
const rateLimit = require("express-rate-limit");

const translateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, // limit each IP to 100 requests per windowMs
  message: "You have exceeded the 100 requests in 24 hrs limit from this IP!",
  standardHeaders: true, //Rate limit information modern/standard headers me bheji jayegi
  legacyHeaders: false,
});

module.exports = {translateLimiter};