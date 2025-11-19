const axios = require("axios");
const cache = require("./cache");

const openaiTranslate = async (text, form, to) => {
  // Using OpenAI ChatCompletion (or the chat/completions client you prefer)
  const prompt = `Translate the following text from ${from} to ${to} precisely:\n\n${text}\n\nProvide only the translated text.`;
  const url = "https://api.openai.com/v1/chat/completions";

  const res = await axios.post(
    url,
    {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0,
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds timeout
    }
  );

  const translatedText = res.data.choices[0].message.content.trim();
  return { translatedText, model: "openai-gpt4o-mini" };
};


const hfFallbackTranslate = async (text, from, to) => {
   // Use a generic sentence translation via HuggingFace's translation pipeline if possible
  // For many language pairs you need a specific model; here we'll use the inference API generic call.
  const model = `facebook/m2m100_418M`; // Generic multilingual model
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const res = await axios.post(
    url,
    {
        input: text, parameters: {src_lang: from, tgt_lang: to}
    },
    {
        headers: {Authorization: `Bearer ${process.env.HF_API_KEY}`}, timeout: 30000, // 30 seconds timeout
    }
  );
  const translatedText = Array.isArray(res.data)
    ? res.data[0].translation_text
    : res.data.translation_text || res.data[0].generated_text;
    return { translatedText, model: `hf-${model}` };
};


const translateWithFallback = async(text, from, to)=>{
    const key = `${from}:${to}:${text}`;
    const cached = cache.get(key);
    if(cached) return cached;

    try{
        const result = await openaiTranslate(text, from, to);
        cache.set(key, result);
        return result;
    }catch(e){
        console.error("OpenAI translation failed, falling back to HuggingFace:", e.message);
        try{
            const result = await hfFallbackTranslate(text, from, to);
            cache.set(key, result);
            return result;
        }catch(e2){
            console.error("HuggingFace translation also failed:", e2.message);
            throw new Error("All translators failed");
        }
    }
};

module.exports = {
  translateWithFallback,
};
