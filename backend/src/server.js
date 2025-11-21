require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const chalk = require("chalk");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const translateRoutes = require("./routes/translateRoute");
const analyticsRoutes = require("./routes/analyticsRoute");
const auth = require("./middleware/auth");

const app = express();
app.use(helmet());
// CORS configuration - allow multiple frontend ports during development
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("tiny"));

connectDB(process.env.MONGO_URI);

// attach user if token present
app.use(auth);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => res.send("Translation backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(chalk.blue.bold(`🚀 Server running on port ${PORT}`))
);
