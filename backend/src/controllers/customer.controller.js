const db = require("../models");
const bcrypt = require("bcryptjs");

const Customer = db.Customer;

const formatCustomer = (customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone_number: customer.phone_number,
  address: customer.address,
  deleted_at: customer.deleted_at,
  created_at: customer.created_at,
  updated_at: customer.updated_at,
});

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name, email, password, phone_number, address } = req.body;

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!password)
      return res.status(400).json({ message: "password is required" });

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

// ================= GET ALL (CHƯA XOÁ - DESC) =================
exports.findAll = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: { deleted_at: null },
      order: [["id", "DESC"]],
    });

    return res.status(200).json(customers.map(formatCustomer));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: { id, deleted_at: null },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(formatCustomer(customer));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const customer = await Customer.findOne({
      where: { id, deleted_at: null },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
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

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({
      where: { id, deleted_at: null },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.update({ deleted_at: new Date() });
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
