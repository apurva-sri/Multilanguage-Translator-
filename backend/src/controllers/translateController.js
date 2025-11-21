const axios = require("axios");
const chalk = require("chalk");
const Translation = require("../models/Translation");

async function translateText(req, res) {
  const { text, from, to } = req.body;

  if (!text || !from || !to)
    return res.status(400).json({ message: "Missing fields" });

  // Role-based language access
  const freeAllowed = ["en", "hi", "fr", "es"];
  if (!req.user && (!freeAllowed.includes(from) || !freeAllowed.includes(to))) {
    return res
      .status(403)
      .json({ message: "Login required for this language pair" });
  }

  try {
    const response = await axios.post(
      "https://libretranslate.com/translate",
      {
        q: text,
        source: from,
        target: to,
        format: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log the full response from LibreTranslate for debugging
    console.log("LibreTranslate response:", response.data);

    if (!response.data || !response.data.translatedText) {
      console.log("Unexpected API response:", response.data);
      return res
        .status(500)
        .json({ message: "Translation API error", apiResponse: response.data });
    }

    const translated = response.data.translatedText;

    console.log("Parsed translated text:", translated);
    // Save to DB
    await Translation.create({
      userId: req.user ? req.user._id : null,
      from,
      to,
      sourceText: text,
      translatedText: translated,
      modelUsed: "LibreTranslate-FreeAPI",
    });

    console.log(
      chalk.greenBright.bold(
        `📝 FREE Translation DONE: ${from} → ${to} using LibreTranslate`
      )
    );

    res.json({
      translated,
      model: "LibreTranslate-FreeAPI",
    });
  } catch (err) {
    console.error(
      chalk.red.bold("❌ Translation error:"),
      err.response?.data || err.message
    );
    return res.status(500).json({ message: "Translation failed" });
  }
}

module.exports = { translateText };

// const Translation = require("../models/Translation");
// const chalk = require("chalk");
// const { translateWithFallback } = require("../utils/translator");

// async function translateText(req, res) {
//   // req.user may be undefined (unauthenticated)
//   const { text, from, to } = req.body;
//   if (!text || !from || !to)
//     return res.status(400).json({ message: "Missing fields" });

//   // Role-based language access
//   const freeAllowed = ["en", "hi", "fr", "es"];
//   if (!req.user && !freeAllowed.includes(from) && !freeAllowed.includes(to)) {
//     return res
//       .status(403)
//       .json({ message: "Login required for this language pair" });
//   }

//   try {
//     const { translated, model } = await translateWithFallback(text, from, to);

//     // Save to history optionally
//     await Translation.create({
//       userId: req.user ? req.user._id : null,
//       from,
//       to,
//       sourceText: text,
//       translatedText: translated,
//       modelUsed: model,
//     });

//     console.log(
//       chalk.greenBright.bold(
//         `📝 Translation completed: ${from} → ${to} using ${model}`
//       )
//     );
//     res.json({ translated, model });
//   } catch (err) {
//     console.error(chalk.red.bold("❌ Translate error:"), err.message);
//     res.status(500).json({ message: "Translation failed" });
//   }
// }

// module.exports = { translateText };
