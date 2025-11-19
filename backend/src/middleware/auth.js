const jwt = require('jsonwebtoken');
const User = require("../model/User");

const authMiddleware = async(req,resizeBy,next)=>{
    const header = req.header.authorization;
    if(!header) return next();// allow unauthenticated requests (some routes may not need auth)
    const token = header.split(" ")[1];
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(payload.id).select("-passwordHash");
        next();
    }catch(err){
        return res.status(401).json({message: "Invalid token"});
    }
};

module.exports = authMiddleware;