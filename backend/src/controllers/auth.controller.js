const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = db.User;

// ===== Login =====
// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Tìm user và include role
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: db.Role,
          as: "role", // tên alias trong association
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, roleId: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Trả về token và user info
    res.json({
      token,
      user: {
        id: user.id,
        employee_code: user.employee_code,
        username: user.username,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        role: user.role, // role object
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { login };
