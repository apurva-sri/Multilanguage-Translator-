import React, { useEffect, useState } from "react";
import api from "../services/api";
import LanguageSelect, { LANGUAGES } from "../components/LanguageSelect";
import { motion } from "framer-motion";

export default function Home({ user }) {
  const [from, setFrom] = useState("en");
  const [to, setTo] = useState("hi");
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const freeAllowed = ["en", "hi", "fr", "es"];

  const allowedCodes = user ? LANGUAGES.map((l) => l.code) : freeAllowed;

  useEffect(() => {
    // record visit
    api.post("/analytics/visit", { path: "/" }).catch(() => {});
    // optionally fetch stats
    api
      .get("/analytics/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setTranslated("");
  };

  const translate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/translate", { text, from, to });
      setTranslated(res.data.translated);
    }catch (err) {
  console.log("Error:", err.response?.data);
  alert(err.response?.data?.message || "Translate failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-4">
          <LanguageSelect
            value={from}
            onChange={setFrom}
            allowed={allowedCodes}
          />
          <button onClick={swap} className="p-2 rounded bg-gray-100">
            ↔
          </button>
          <LanguageSelect value={to} onChange={setTo} allowed={allowedCodes} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full mt-4 p-3 border rounded"
          placeholder="Type text to translate..."
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={translate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Translating..." : "Translate"}
          </button>
          <button
            onClick={() => {
              setText("");
              setTranslated("");
            }}
            className="px-4 py-2 border rounded"
          >
            Clear
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <h4 className="text-sm text-gray-500">Output</h4>
          <div className="p-4 bg-gray-50 rounded min-h-[80px]">
            {translated || (
              <span className="text-gray-400">No translation yet</span>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        {stats && (
          <div>
            Total visits: {stats.totalVisits} • Unique IPs: {stats.uniqueIPs}
          </div>
        )}
      </div>
    </div>
  );
}
