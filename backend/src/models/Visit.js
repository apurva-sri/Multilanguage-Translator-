// store visits for analytics and unique counts.
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    ip: String,
    userAgent: String,
    path: String,
    date: { type: Date, default: Date.now},
});

module.exports = mongoose.model("Visit", VisitSchema);