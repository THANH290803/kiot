const db = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const Order = db.Order;

const Customer = db.Customer;

// ===== Format response =====
const formatCustomer = (customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone_number: customer.phone_number,
  address: customer.address,
  total_spending: Number(customer.total_spending || 0),
  deleted_at: customer.deleted_at,
  created_at: customer.created_at,
  updated_at: customer.updated_at,
});

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name, email, password, phone_number, address } = req.body;

    if (!name)
      return res.status(400).json({ message: "name is required" });

    if (!email)
      return res.status(400).json({ message: "email is required" });

    if (!password)
      return res.status(400).json({ message: "password is required" });

    const existEmail = await Customer.findOne({
      where: { email },
    });

    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
    });

    return res.status(201).json(formatCustomer(customer));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL (SEARCH + PAGINATION) =================
exports.findAll = async (req, res) => {
  try {
    const { keyword = "", page = 1, limit = 10 } = req.query;

    const currentPage = parseInt(page);
    const pageSize = parseInt(limit);
    const offset = (currentPage - 1) * pageSize;

    const whereCondition = {
      deleted_at: null,
      ...(keyword && {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
        ],
      }),
    };

    const { rows, count } = await Customer.findAndCountAll({
      where: whereCondition,
      attributes: {
        include: [
          [
            Sequelize.fn(
                "COALESCE",
                Sequelize.fn("SUM", Sequelize.col("orders.total_amount")),
                0
            ),
            "total_spending",
          ],
        ],
      },
      include: [
        {
          model: Order,
          as: "orders",
          attributes: [],
          where: {
            deleted_at: null,
            status: {
              [Op.in]: ["PAID", "COMPLETED"],
            },
          },
          required: false,
        },
      ],
      group: ["Customer.id"],
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
      subQuery: false,
    });

    return res.json({
      customers: rows.map(formatCustomer),
      pagination: {
        total: count.length,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(count.length / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: { id, deleted_at: null },
      attributes: {
        include: [
          [
            db.sequelize.fn(
                "COALESCE",
                db.sequelize.fn("SUM", db.sequelize.col("orders.total_amount")),
                0
            ),
            "total_spending",
          ],
        ],
      },
      include: [
        {
          model: db.Order,
          as: "orders",
          attributes: [],
          where: {
            deleted_at: null,
            status: {
              [Op.in]: ["PAID", "COMPLETED"],
            },
          },
          required: false,
        },
      ],
      group: ["Customer.id"],
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.json(formatCustomer(customer));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, email } = req.body;

    const customer = await Customer.findOne({
      where: { id, deleted_at: null },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (email && email !== customer.email) {
      const existEmail = await Customer.findOne({ where: { email } });
      if (existEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    await customer.update(req.body);

    return res.status(200).json(formatCustomer(customer));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE (SOFT DELETE) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: { id, deleted_at: null },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.update({
      deleted_at: new Date(),
    });

    return res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};