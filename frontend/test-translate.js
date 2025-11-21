const axios = require("axios");

async function test() {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/translate",
      {
        text: "Hello world",
        from: "en",
        to: "hi",
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("RESPONSE", res.data);
  } catch (e) {
    if (e.response)
      console.error("ERR RESPONSE", e.response.status, e.response.data);
    else console.error("ERR", e.message);
  }
}

test();
