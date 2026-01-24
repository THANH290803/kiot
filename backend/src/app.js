require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const userRoutes = require("./routes/user.routes");
const swaggerSetup = require("./swagger/swagger");
const authRoutes = require("./routes/auth.routes");
const roleRoutes = require("./routes/role.routes");
const permissionRoutes = require("./routes/permission.route")
const categoryRoutes = require("./routes/category.route");
const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const productVariantRoutes = require("./routes/product_variant.routes");
const orderRoutes = require("./routes/order.routes");
const orderItemRoutes = require("./routes/order_item.routes");
const statisticsRoutes = require("./routes/statistics.routes");

const app = express();
app.use(express.json());

// ===== Kiểm tra kết nối DB =====
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
})();

// ===== Routes =====
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/colors", require("./routes/color.routes"));
app.use("/api/sizes", require("./routes/size.routes"));
app.use("/api/brands", require("./routes/brand.routes"));
app.use(
  "/api/permission-groups",
  require("./routes/permission_group.routes")
);
app.use("/api/permissions", permissionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-variants", productVariantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/statistics", statisticsRoutes);




// nếu có route khác, ví dụ: app.use("/products", productRoutes);

// ===== Swagger chung =====
swaggerSetup(app);

// ===== Test route =====
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// ===== Start server =====
const PORT = process.env.APP_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
  console.log(`📖 Swagger docs: http://localhost:${PORT}/api/docs`);
});
