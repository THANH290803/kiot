const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const {
  TWO_FACTOR_TYPES,
  createLoginChallengeToken,
  createAndSendOtp,
  verifyLoginChallengeToken,
  verifyOtp,
} = require("../services/two_factor.service");

const User = db.User;
const Customer = db.Customer;
const Cart = db.Cart;

const TOKEN_EXPIRES_IN = "7d"; // 1 tuần
const TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

function buildAuthUser(user) {
  return {
    id: user.id,
    employee_code: user.employee_code,
    username: user.username,
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    address: user.address,
    role: user.role,
    status: user.status,
    is_two_factor_enabled: Boolean(user.is_two_factor_enabled),
    two_factor_enabled_at: user.two_factor_enabled_at,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

function createAccessTokenPayload(user) {
  return { id: user.id, roleId: user.role_id };
}

function issueAuthSuccessResponse(user) {
  const token = jwt.sign(
    createAccessTokenPayload(user),
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );

  const expiresAt = new Date(Date.now() + TOKEN_EXPIRES_IN_MS);

  return {
    token,
    expires_at: expiresAt.toISOString(),
    user: buildAuthUser(user),
  };
}

function getEmailDeliveryErrorResponse(error) {
  const message = String(error?.message || "");

  if (
    error?.code === "ETIMEDOUT" ||
    error?.command === "CONN" ||
    message.includes("Connection timeout")
  ) {
    return {
      statusCode: 503,
      body: {
        message: "Email service is unavailable from this server. Please check SMTP outbound access or use an email HTTP API provider.",
      },
    };
  }

  return null;
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: db.Role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status !== 1) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa hoặc ngừng hoạt động." });
    }

    if (!user.is_two_factor_enabled) {
      return res.json(issueAuthSuccessResponse(user));
    }

    const challengeToken = createLoginChallengeToken(user);
    const otpResult = await createAndSendOtp({
      user,
      type: TWO_FACTOR_TYPES.LOGIN,
    });

    return res.json({
      requires_2fa: true,
      temp_token: challengeToken,
      expires_at: otpResult.expires_at,
      masked_email: otpResult.masked_email,
      message: "Đã gửi mã OTP xác thực 2 lớp qua email.",
    });
  } catch (err) {
    const emailError = getEmailDeliveryErrorResponse(err);
    if (emailError) {
      return res.status(emailError.statusCode).json(emailError.body);
    }

    res.status(500).json({ message: err.message });
  }
};

const verifyLoginTwoFactor = async (req, res) => {
  try {
    const { temp_token, otp_code } = req.body;

    if (!temp_token || !otp_code) {
      return res.status(400).json({ message: "temp_token and otp_code are required" });
    }

    const payload = verifyLoginChallengeToken(temp_token);

    const user = await User.findByPk(payload.id, {
      include: [
        {
          model: db.Role,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await verifyOtp({
      userId: user.id,
      type: TWO_FACTOR_TYPES.LOGIN,
      code: otp_code,
    });

    return res.json(issueAuthSuccessResponse(user));
  } catch (err) {
    const message = err.message || "Xác thực OTP thất bại.";
    const statusCode = message.includes("OTP") || message.includes("challenge token") ? 400 : 500;
    return res.status(statusCode).json({ message });
  }
};

const getTwoFactorStatus = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "is_two_factor_enabled", "two_factor_enabled_at"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      is_two_factor_enabled: Boolean(user.is_two_factor_enabled),
      email: user.email,
      two_factor_enabled_at: user.two_factor_enabled_at,
    });
  } catch (err) {
    const emailError = getEmailDeliveryErrorResponse(err);
    if (emailError) {
      return res.status(emailError.statusCode).json(emailError.body);
    }

    return res.status(500).json({ message: err.message });
  }
};

const requestTwoFactorAction = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const { action } = req.body;

    if (!["enable", "disable"].includes(action)) {
      return res.status(400).json({ message: "action must be enable or disable" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (action === "enable" && user.is_two_factor_enabled) {
      return res.status(400).json({ message: "Tài khoản đã bật xác thực 2 lớp." });
    }

    if (action === "disable" && !user.is_two_factor_enabled) {
      return res.status(400).json({ message: "Tài khoản chưa bật xác thực 2 lớp." });
    }

    const otpResult = await createAndSendOtp({
      user,
      type: action === "enable" ? TWO_FACTOR_TYPES.ENABLE : TWO_FACTOR_TYPES.DISABLE,
    });

    return res.json({
      message: "Đã gửi mã OTP qua email.",
      action,
      expires_at: otpResult.expires_at,
      masked_email: otpResult.masked_email,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const confirmTwoFactorAction = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const { action, otp_code } = req.body;

    if (!["enable", "disable"].includes(action)) {
      return res.status(400).json({ message: "action must be enable or disable" });
    }

    if (!otp_code) {
      return res.status(400).json({ message: "otp_code is required" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await verifyOtp({
      userId,
      type: action === "enable" ? TWO_FACTOR_TYPES.ENABLE : TWO_FACTOR_TYPES.DISABLE,
      code: otp_code,
    });

    await user.update({
      is_two_factor_enabled: action === "enable",
      two_factor_enabled_at: action === "enable" ? new Date() : null,
    });

    return res.json({
      message: action === "enable" ? "Đã bật xác thực 2 lớp." : "Đã tắt xác thực 2 lớp.",
      is_two_factor_enabled: action === "enable",
      two_factor_enabled_at: action === "enable" ? user.two_factor_enabled_at : null,
    });
  } catch (err) {
    const message = err.message || "Xác nhận OTP thất bại.";
    const statusCode = message.includes("OTP") ? 400 : 500;
    return res.status(statusCode).json({ message });
  }
};

const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const customer = await Customer.findOne({
      where: {
        email,
        deleted_at: null,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: customer.id, type: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    const expiresAt = new Date(Date.now() + TOKEN_EXPIRES_IN_MS);

    return res.json({
      token,
      expires_at: expiresAt.toISOString(),
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number,
        address: customer.address,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    // JWT không lưu session → backend chỉ trả thông báo
    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { name, email, password, phone_number, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }

    const existingCustomer = await Customer.findOne({
      where: {
        [Op.or]: [
          { email },
          ...(phone_number ? [{ phone_number }] : []),
        ],
      },
      transaction,
    });

    if (existingCustomer) {
      if (existingCustomer.email === email) {
        return res.status(409).json({ message: "Email already registered" });
      }

      if (phone_number && existingCustomer.phone_number === phone_number) {
        return res.status(409).json({ message: "Phone number already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      phone_number: phone_number || null,
      address: address || null,
      password: hashedPassword,
    }, { transaction });

    await Cart.findOrCreate({
      where: { customer_id: customer.id },
      defaults: { customer_id: customer.id },
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      message: "Register successfully",
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number,
        address: customer.address,
      },
    });
  } catch (err) {
    await transaction.rollback();
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  verifyLoginTwoFactor,
  getTwoFactorStatus,
  requestTwoFactorAction,
  confirmTwoFactorAction,
  customerLogin,
  logout,
  register,
};
