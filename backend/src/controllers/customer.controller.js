const db = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

const Customer = db.Customer;

const CUSTOMER_SPENDING_SUBQUERY = `
  (
    SELECT COALESCE(SUM(o.total_amount), 0)
    FROM orders o
    WHERE o.customer_id = Customer.id
      AND o.deleted_at IS NULL
      AND (
        o.status = 'completed'
        OR o.status = 'COMPLETED'
        OR o.status = '5'
        OR o.status = 5
      )
  )
`;

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

    const normalizedEmail = email || `customer_${Date.now()}@kiot.local`;
    const normalizedPassword =
      password || `customer_${phone_number || Date.now()}`;

    const existEmail = await Customer.findOne({
      where: { email: normalizedEmail },
    });

    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    const customer = await Customer.create({
      name,
      email: normalizedEmail,
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
            Sequelize.literal(CUSTOMER_SPENDING_SUBQUERY),
            "total_spending",
          ],
        ],
      },
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    });

    return res.json({
      customers: rows.map(formatCustomer),
      pagination: {
        total: count,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(count / pageSize),
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
            db.sequelize.literal(CUSTOMER_SPENDING_SUBQUERY),
            "total_spending",
          ],
        ],
      },
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
    const { password, email, phone_number } = req.body;

    const customer = await Customer.findOne({
      where: { id, deleted_at: null },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (email && email !== customer.email) {
      const existEmail = await Customer.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
          deleted_at: null,
        },
      });
      if (existEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    if (phone_number && phone_number !== customer.phone_number) {
      const existPhone = await Customer.findOne({
        where: {
          phone_number,
          id: { [Op.ne]: id },
          deleted_at: null,
        },
      });

      if (existPhone) {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    await customer.update(req.body);

    return res.status(200).json(formatCustomer(customer));
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      const duplicatedField = error.errors?.[0]?.path || "field";
      return res.status(409).json({
        message: `${duplicatedField} already exists`,
      });
    }
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
