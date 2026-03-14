const express    = require("express");
const cors       = require("cors");
const dotenv     = require("dotenv");
const http       = require("http");
const { Server } = require("socket.io");

const connectDB      = require("./config/db.js");
const socketHandlers = require("./services/socketHandlers");

dotenv.config();

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);

connectDB();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/projects",      require("./routes/projectRoutes.js"));
app.use("/api/users",         require("./routes/userRoutes"));
app.use("/api/auth",          require("./routes/authRoutes.js"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/chat",          require("./routes/chatRoutes"));
app.use("/api/milestones",    require("./routes/milestoneRoutes"));  // NEW

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

socketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
