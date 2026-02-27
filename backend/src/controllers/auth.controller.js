const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = db.User;

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

module.exports = { login, logout };
