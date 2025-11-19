const Translation = require("../models/Translation");
const { translateWithFallback } = require("../utils/translator");

async function translateText(req, res) {
  // req.user may be undefined (unauthenticated)
  const { text, from, to } = req.body;
  if (!text || !from || !to)
    return res.status(400).json({ message: "Missing fields" });

  // Role-based language access
  const freeAllowed = ["en", "hi", "fr", "es"];
  if (!req.user && !freeAllowed.includes(from) && !freeAllowed.includes(to)) {
    return res
      .status(403)
      .json({ message: "Login required for this language pair" });
  }

  try {
    const { translated, model } = await translateWithFallback(text, from, to);

    // Save to history optionally
    await Translation.create({
      userId: req.user ? req.user._id : null,
      from,
      to,
      sourceText: text,
      translatedText: translated,
      modelUsed: model,
    });

    res.json({ translated, model });
  } catch (err) {
    console.error("Translate error:", err);
    res.status(500).json({ message: "Translation failed" });
  }
};

module.exports = { translateText };