// history & auditing; help caching/popularity stats.
const mongoose = require("mongoose");

const TranslationSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    
})