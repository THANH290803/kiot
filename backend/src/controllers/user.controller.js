const db = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");

const User = db.User;
const Role = db.Role;

// Tạo employeeCode tự động
const generateEmployeeCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  code += chars[Math.floor(Math.random() * 26)]; // ký tự đầu tiên là chữ
  for (let i = 1; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// ===== CREATE USER =====
const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role_id, phone_number, address, status } = req.body;

    if (!role_id) return res.status(400).json({ message: "role_id is required" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      employee_code: generateEmployeeCode(),
      username,
      name,
      email,
      phone_number,
      address,
      password: hashedPassword,
      role_id,
      status: status || 1,
    });

    // Lấy lại user kèm role
    const createdUser = await User.findByPk(user.id, {
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    });

    res.status(201).json({
      user: {
        id: createdUser.id,
        employee_code: createdUser.employee_code,
        username: createdUser.username,
        name: createdUser.name,
        email: createdUser.email,
        phone_number: createdUser.phone_number,
        address: createdUser.address,
        role: createdUser.role,
        status: createdUser.status,
        created_at: createdUser.created_at,
        updated_at: createdUser.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== GET ALL USERS =====
const getAllUsers = async (req, res) => {
  try {
    const { role_id, status, name, page = 1, limit = 10 } = req.query;

    const where = {};
    const include = [{ model: Role, as: "role", attributes: ["id", "name"] }];

    // Filter by role
    if (role_id) {
      where.role_id = role_id;
    }

    // Filter by status
    if (status !== undefined) {
      where.status = status;
    }

    // Search by name
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    // Pagination
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    const formattedUsers = rows.map(user => ({
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
    }));

    res.json({
      users: formattedUsers,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== GET USER BY ID =====
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
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
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== UPDATE USER =====
const updateUser = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    await user.update(req.body);

    // Lấy lại user kèm role
    const updatedUser = await User.findByPk(user.id, {
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    });

    res.json({
      user: {
        id: updatedUser.id,
        employee_code: updatedUser.employee_code,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number,
        address: updatedUser.address,
        role: updatedUser.role,
        status: updatedUser.status,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== DELETE USER =====
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== CHANGE USER STATUS =====
const changeUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (status === undefined) {
      return res.status(400).json({ message: "status is required" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ status });

    const updatedUser = await User.findByPk(user.id, {
      include: [{ model: Role, as: "role", attributes: ["id", "name"] }],
    });

    res.json({
      message: "User status updated successfully",
      data: {
        employee_code: updatedUser.employee_code,
        username: updatedUser.username,
        name: updatedUser.name,
        status: updatedUser.status,
        role: {
          id: updatedUser.role.id,
          name: updatedUser.role.name,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== EXPORT USERS TO EXCEL =====
// ===== EXPORT USERS TO EXCEL =====
const exportUsersExcel = async (req, res) => {
  try {
    const { role_id, status, name } = req.query;

    const where = {};
    const include = [{ model: Role, as: "role", attributes: ["id", "name"] }];

    if (role_id) where.role_id = role_id;
    if (status !== undefined) where.status = status;
    if (name) where.name = { [Op.like]: `%${name}%` };

    const users = await User.findAll({
      where,
      include,
      order: [["id", "DESC"]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách người dùng");

    // ===== HEADER TIẾNG VIỆT =====
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Mã nhân viên", key: "employee_code", width: 20 },
      { header: "Tên đăng nhập", key: "username", width: 20 },
      { header: "Họ và tên", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Số điện thoại", key: "phone_number", width: 20 },
      { header: "Địa chỉ", key: "address", width: 30 },
      { header: "Vai trò", key: "role", width: 20 },
      { header: "Trạng thái", key: "status", width: 18 },
      { header: "Ngày tạo", key: "created_at", width: 25 },
    ];

    // In đậm header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    // ===== DATA =====
    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        employee_code: user.employee_code,
        username: user.username,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        role: user.role ? user.role.name : "",
        status: user.status === 1 ? "Hoạt động" : "Ngừng hoạt động",
        created_at: user.created_at,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=danh_sach_nguoi_dung.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== EXPORT =====
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserStatus,
  exportUsersExcel
};
