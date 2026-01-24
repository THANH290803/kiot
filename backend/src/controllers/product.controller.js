const db = require("../models");
const { Op } = require("sequelize");

const Product = db.Product;
const Category = db.Category;
const Brand = db.Brand;

const includeRelations = [
  { model: Category, as: "category", attributes: ["id", "name"] },
  { model: Brand, as: "brand", attributes: ["id", "name"] },
];

const formatProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  status: product.status,
  category_id: product.category_id,
  brand_id: product.brand_id,
  category: product.category,
  brand: product.brand,
  deleted_at: product.deleted_at,
  created_at: product.created_at,
  updated_at: product.updated_at,
});

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name, category_id, brand_id, status, description } = req.body;

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!category_id)
      return res.status(400).json({ message: "category_id is required" });
    if (!brand_id)
      return res.status(400).json({ message: "brand_id is required" });

    const product = await Product.create({
      name,
      category_id,
      brand_id,
      status: status || 1,
      description,
    });

    const result = await Product.findByPk(product.id, {
      include: includeRelations,
    });

    return res.status(201).json(formatProduct(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL (CHƯA XOÁ, SEARCH NAME, FILTER CATEGORY & BRAND) =================
exports.findAll = async (req, res) => {
  try {
    const { name, category_id, brand_id, status, page = 1, limit = 10 } = req.query;

    const where = { deleted_at: null };
    const include = [...includeRelations];

    // Search by name
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    // Filter by category
    if (category_id) {
      where.category_id = category_id;
    }

    // Filter by brand
    if (brand_id) {
      where.brand_id = brand_id;
    }

    // Filter by status
    if (status !== undefined) {
      where.status = status;
    }

    // Pagination
    const offset = (page - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      products: rows.map(formatProduct),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, deleted_at: null },
      include: includeRelations,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(formatProduct(product));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, deleted_at: null },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update(req.body);

    const result = await Product.findByPk(product.id, {
      include: includeRelations,
    });

    return res.status(200).json(formatProduct(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, deleted_at: null },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({ deleted_at: new Date() });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= CHANGE STATUS =================
exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status === undefined) {
      return res.status(400).json({ message: "status is required" });
    }

    const product = await Product.findOne({
      where: { id, deleted_at: null },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({ status });

    const result = await Product.findByPk(product.id, {
      include: includeRelations,
    });

    return res.status(200).json(formatProduct(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
