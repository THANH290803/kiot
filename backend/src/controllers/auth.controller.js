const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const User = db.User;
const Customer = db.Customer;
const Cart = db.Cart;

const TOKEN_EXPIRES_IN = "7d"; // 1 tuần
const TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

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

    const token = jwt.sign(
      { id: user.id, roleId: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    // 🔥 Thời điểm hết hạn token
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRES_IN_MS);

    res.json({
      token,
      expires_at: expiresAt.toISOString(), // ISO 8601
      user: {
        id: user.id,
        employee_code: user.employee_code,
        username: user.username,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        role: user.role,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

module.exports = { login, customerLogin, logout, register };
