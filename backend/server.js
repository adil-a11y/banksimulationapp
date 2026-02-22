require("dotenv").config();
const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/ai");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001"
  ]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bank Simulation Backend Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Bank Simulation Backend"
  });
});

// Keep AI route for UI compatibility but returns disabled message
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Bank Simulation Backend`);
  console.log(`🌐 Frontend should be on: http://localhost:3000 or http://localhost:3001`);
  console.log(`\n🧪 Test endpoints:`);
  console.log(`- GET  http://localhost:${PORT}/`);
  console.log(`- GET  http://localhost:${PORT}/api/health`);
});
