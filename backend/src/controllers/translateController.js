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
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `${from}|${to}`,
        },
        timeout: 15000,
      }
    );

    // console.log("MyMemory Response:", response.data);

    if (!response.data || !response.data.responseData) {
      console.log("Unexpected API response:", response.data);
      return res.status(500).json({
        message: "Translation API error",
        apiResponse: response.data,
      });
    }

    const translated = response.data.responseData.translatedText;

    console.log("Parsed translated text:", translated);

    // Save to DB
    await Translation.create({
      userId: req.user ? req.user._id : null,
      from,
      to,
      sourceText: text,
      translatedText: translated,
      modelUsed: "MyMemory-FreeAPI",
    });

    console.log(
      chalk.greenBright.bold(
        `📝 FREE Translation DONE: ${from} → ${to} using MyMemory`
      )
    );

    res.json({
      translated,
      model: "MyMemory-FreeAPI",
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
