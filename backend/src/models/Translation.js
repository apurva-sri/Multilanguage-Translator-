// history & auditing; help caching/popularity stats.
const mongoose = require("mongoose");

const TranslationSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", default: null },
  from: String,
  to: String,
  sourceText: String,
  translatedText: String,
  modelUsed: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Translation", TranslationSchema);