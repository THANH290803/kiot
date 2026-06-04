require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

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
const paymentRoutes = require("./routes/payment.routes");
const imageRoutes = require("./routes/image.routes");
const cartRoutes = require("./routes/cart.routes");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", Number(process.env.TRUST_PROXY || 1));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "1mb" }));

const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.AUTH_RATE_LIMIT_MAX || 30),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many authentication requests. Please try again later." },
});

app.use(globalLimiter);

/* =========================
   ✅ CORS CONFIG (LOCAL + PROD)
========================= */
const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3003",
  "http://127.0.0.1:3000",
  "https://kiot-blush.vercel.app",
  "https://kiot-dev.vercel.app",
];

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  allowedOrigins.push(...defaultAllowedOrigins);
}

const allowVercelPreviewOrigins =
  String(process.env.CORS_ALLOW_VERCEL_PREVIEWS || "false").toLowerCase() === "true";

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            // allow exact domains
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // allow localhost / 127.0.0.1 on any port for local development
            if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
                return callback(null, true);
            }

            // optional: allow all Vercel preview domains only when explicitly enabled
            if (allowVercelPreviewOrigins && origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Chặn mở trực tiếp API GET trên tab trình duyệt, nhưng vẫn cho phép fetch/axios từ frontend.
app.use("/api", (req, res, next) => {
  const isSwaggerRequest = req.path === "/docs" || req.path.startsWith("/docs/");
  if (isSwaggerRequest) {
    return next();
  }

  const isGetRequest = req.method === "GET";
  const isBrowserNavigate =
    req.headers["sec-fetch-mode"] === "navigate" ||
    req.headers["sec-fetch-dest"] === "document";
  const acceptHeader = req.headers.accept || "";
  const wantsHtml = acceptHeader.includes("text/html");

  if (isGetRequest && isBrowserNavigate && wantsHtml) {
    return res.status(404).json({ message: "Not found" });
  }

  return next();
});

/* =========================
   DB CONNECT
========================= */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
})();

/* =========================
   ROUTES
========================= */
app.use("/api/users", userRoutes);
app.use("/api/auth", authLimiter, authRoutes);
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
app.use("/api/payments", paymentRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/vouchers", require("./routes/voucher.routes"));
app.use("/api/customer-vouchers", require("./routes/customer_voucher.routes"));
app.get("/health", (req, res) => {
    const expectedToken = process.env.HEALTH_CHECK_TOKEN;
    if (expectedToken && req.headers["x-health-check-token"] !== expectedToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
        status: "ok",
        service: "backend"
    });
});

// nếu có route khác, ví dụ: app.use("/products", productRoutes);

// ===== Swagger chung =====
swaggerSetup(app);

// ===== Test route =====
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

const DEFAULT_PORT = Number(process.env.APP_PORT || 3001);
const MAX_PORT_ATTEMPTS = 10;

function startServer(port, attempt = 0) {
  const server = app.listen(port, () => {
    console.log(`🚀 Backend API running on port ${port}`);
    console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempt < MAX_PORT_ATTEMPTS) {
      const nextPort = port + 1;
      console.warn(`⚠️ Port ${port} is already in use. Retrying on port ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error(`❌ Failed to start backend server: ${error.message}`);
    process.exit(1);
  });
}

startServer(DEFAULT_PORT);
