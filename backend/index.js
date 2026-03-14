const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db.js");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

connectDB();

app.use(cors());
app.use(express.json());

const projectRoutes = require("./routes/projectRoutes.js");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes.js");

app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
console.log("Project routes loaded");

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 