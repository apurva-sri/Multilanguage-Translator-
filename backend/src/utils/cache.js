// cache translations to reduce model calls and cost.
const NodeCache = require("node-cache");
const cache = new NodeCache({stdTTL: 60 * 60 * 24}); // 24 hours TTL(cache)

module.exports = cache;