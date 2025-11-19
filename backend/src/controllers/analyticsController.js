const Visit = require("../models/Visit");
const chalk = require("chalk");

async function analyticsVisits(req, res) {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const ua = req.headers["user-agent"] || "";
    const path = req.body?.path || "/";
    await Visit.create({ ip_address: ip, user_agent: ua, path_visited: path });
    console.log(chalk.blueBright.bold(`📋 Visit logged: IP ${ip} → ${path}`));
    res.json({ ok: true });
  } catch (err) {
    console.error(chalk.red.bold("❌ Analytics error:"), err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
}

async function analyticsStats(req, res) {
  //simple aggregation to get unique visits and total visits
  const totalVisits = await Visit.countDocuments();
  const uniqueIPsAgg = await Visit.aggregate([
    { $group: { _id: "$ip_address" } },
    { $count: "unique" },
  ]);
  console.log(
    chalk.yellow.bold(
      `📊 Analytics stats retrieved: ${totalVisits} total visits, ${
        uniqueIPsAgg[0]?.unique || 0
      } unique IPs`
    )
  );
  res.json({
    totalVisits,
    uniqueIPs: uniqueIPsAgg[0] ? uniqueIPsAgg[0].unique : 0,
  });
}

module.exports = {
  analyticsVisits,
  analyticsStats,
};
