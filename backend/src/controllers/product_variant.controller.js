const db = require("../models");
const cloudinary = require("../utils/cloudinary");
const { Op } = require("sequelize");

const ProductVariant = db.ProductVariant;
const Product = db.Product;
const Color = db.Color;
const Size = db.Size;

const CLOUDINARY_FOLDER =
    process.env.CLOUDINARY_FOLDER || "avatarProduct";

/**
 * Upload 1 avatar duy nhất cho product_variant
 * Upload lại => GHI ĐÈ
 */
async function uploadAvatar(avatar, variantId) {
  if (!avatar) return null;

  const result = await cloudinary.uploader.upload(avatar, {
    folder: CLOUDINARY_FOLDER,
    public_id: `variant_${variantId}`,
    overwrite: true,
    resource_type: "image",
  });

  return result.secure_url;
}

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
  avatar: v.avatar,
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
    const { product_id, sku, price, color_id, size_id, avatar } = req.body;

    if (!product_id || price == null || !color_id || !size_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const variant = await ProductVariant.create({
      product_id,
      sku,
      price,
      color_id,
      size_id,
    });

    // upload avatar (1 ảnh)
    if (avatar) {
      const avatarUrl = await uploadAvatar(avatar, variant.id);
      await variant.update({ avatar: avatarUrl });
    }

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
      color_id,
      size_id,
      avatar,
    } = req.body;

    const updateData = {};

    if (sku !== undefined) updateData.sku = sku;
    if (price !== undefined) updateData.price = price;
    if (color_id !== undefined) updateData.color_id = color_id;
    if (size_id !== undefined) updateData.size_id = size_id;

    // nếu có avatar → ghi đè ảnh cũ
    if (avatar) {
      updateData.avatar = await uploadAvatar(avatar, variant.id);
    }

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