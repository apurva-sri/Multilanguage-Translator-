const Visit = require("../models/Visit");

async function analyticsVisits(req, res) {
    try{
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const ua = req.headers['user-agent'] || "";
        const {path = "/"} = req.body;
        await Visit.create({ip_address: ip, user_agent: ua, path_visited: path});
        res.json({ok: true});
    }catch(err){
        res.status(500).json({ok: false, error: err.message});
    }
};

async function analyticsStats(req, res) {
    //simple aggregation to get unique visits and total visits
    const totalVisits = await Visit.countDocuments();
    const uniqueIPsAgg = await Visit.aggregate([
        {$group: {_id: "$ip_address"}},
        {$count: "unique"}
    ]);
    res.json({
      totalVisits,
      uniqueIPs: uniqueIPsAgg[0] ? uniqueIPsAgg[0].unique : 0,
    });
};

module.exports = {
    analyticsVisits,
    analyticsStats,
};