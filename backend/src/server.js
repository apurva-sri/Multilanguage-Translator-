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

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);


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
