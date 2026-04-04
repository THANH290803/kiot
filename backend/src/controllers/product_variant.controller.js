const db = require("../models");
const { Op } = require("sequelize");

const ProductVariant = db.ProductVariant;
const Product = db.Product;
const Color = db.Color;
const Size = db.Size;

const includeRelations = [
  { model: Product, as: "product", attributes: ["id", "name"] },
  { model: Color, as: "color", attributes: ["id", "name"] },
  { model: Size, as: "size", attributes: ["id", "name"] },
];

const formatVariant = (v) => ({
  id: v.id,
  product_id: v.product_id,
  sku: v.sku,
  price: v.price,
  quantity: v.quantity,
  color_id: v.color_id,
  size_id: v.size_id,
  product: v.product,
  color: v.color,
  size: v.size,
  created_at: v.created_at,
  updated_at: v.updated_at,
});

// ================= GET ALL =================
exports.findAll = async (req, res) => {
  try {
    const {
      product_id,
      color_id,
      size_id,
      keyword,
    } = req.query;

    const where = {
      deleted_at: null,
    };

    if (product_id) where.product_id = product_id;
    if (color_id) where.color_id = color_id;
    if (size_id) where.size_id = size_id;

    if (keyword) {
      where[Op.or] = [
        { sku: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const variants = await ProductVariant.findAll({
      where,
      include: includeRelations,
      order: [["created_at", "DESC"]],
    });

    res.json(variants.map(formatVariant));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ONE =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await ProductVariant.findOne({
      where: {
        id,
        deleted_at: null,
      },
      include: includeRelations,
    });

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.json(formatVariant(variant));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { product_id, sku, price, quantity, color_id, size_id } = req.body;

    if (!product_id || price == null || quantity == null || !color_id || !size_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const variant = await ProductVariant.create({
      product_id,
      sku,
      price,
      quantity,
      color_id,
      size_id,
    });

    const result = await ProductVariant.findByPk(variant.id, {
      include: includeRelations,
    });

    res.status(201).json(formatVariant(result));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const variant = await ProductVariant.findOne({
      where: { id: req.params.id, deleted_at: null },
    });

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const {
      sku,
      price,
      quantity,
      color_id,
      size_id,
    } = req.body;

    const updateData = {};

    if (sku !== undefined) updateData.sku = sku;
    if (price !== undefined) updateData.price = price;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (color_id !== undefined) updateData.color_id = color_id;
    if (size_id !== undefined) updateData.size_id = size_id;

    await variant.update(updateData);

    const result = await ProductVariant.findByPk(variant.id, {
      include: includeRelations,
    });

    res.json(formatVariant(result));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE (SOFT) =================
exports.delete = async (req, res) => {
  try {
    const variant = await ProductVariant.findOne({
      where: {
        id: req.params.id,
        deleted_at: null,
      },
    });

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    await variant.update({
      deleted_at: new Date(),
    });

    res.json({ message: "Variant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
