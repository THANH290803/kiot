require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");

const app = express();
app.use(express.json());

// ===== DB connect =====
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
})();

// ===== Routes =====
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/roles", require("./routes/role.routes"));
app.use("/api/permissions", require("./routes/permission.route"));
app.use("/api/categories", require("./routes/category.route"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/statistics", require("./routes/statistics.routes"));

// ===== Test =====
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// ===== Start server (RENDER FIX) =====
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
