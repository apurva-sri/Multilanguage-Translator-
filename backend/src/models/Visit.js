// store visits for analytics and unique counts.
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  ip_address: String,
  user_agent: String,
  path_visited: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Visit", VisitSchema);