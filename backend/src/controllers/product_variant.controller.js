const db = require("../models");
const cloudinary = require("cloudinary").v2;
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

const formatVariant = (variant) => ({
  id: variant.id,
  product_id: variant.product_id,
  sku: variant.sku,
  price: variant.price,
  avatar: variant.avatar,
  color_id: variant.color_id,
  size_id: variant.size_id,
  product: variant.product,
  color: variant.color,
  size: variant.size,
  deleted_at: variant.deleted_at,
  created_at: variant.created_at,
  updated_at: variant.updated_at,
});

// Folder trên Cloudinary, mặc định là "avartar" (như bạn đang tạo)
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "avartar";
// CLOUDINARY_URL is expected to be set in env (cloudinary://<key>:<secret>@<cloud_name>)
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
}

async function uploadAvatarIfNeeded(avatarInput) {
  if (!avatarInput) return null;
  if (!process.env.CLOUDINARY_URL) {
    throw new Error("CLOUDINARY_URL is not configured");
  }
  const uploadRes = await cloudinary.uploader.upload(avatarInput, {
    folder: CLOUDINARY_FOLDER,
  });
  return uploadRes.secure_url;
}

async function generateSku(product_id, color_id, size_id) {
  try {
    // Fetch product, color, and size data
    const [product, color, size] = await Promise.all([
      Product.findByPk(product_id, { attributes: ['name'] }),
      Color.findByPk(color_id, { attributes: ['name', 'code'] }),
      Size.findByPk(size_id, { attributes: ['name'] })
    ]);

    if (!product || !color || !size) {
      // Fallback to random SKU if data not found
      const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      return `PV-${Date.now()}-${rand}`;
    }

    // Generate meaningful SKU components
    const productPrefix = product.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const colorCode = color.code.replace('#', '').substring(0, 3).toUpperCase();
    const sizeCode = size.name.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Generate unique number (count existing variants for this product + 1)
    const existingVariants = await ProductVariant.count({
      where: { product_id, deleted_at: null }
    });
    const uniqueNum = (existingVariants + 1).toString().padStart(3, '0');

    return `${productPrefix}-${colorCode}-${sizeCode}-${uniqueNum}`;
  } catch (error) {
    console.error('Error generating SKU:', error);
    // Fallback to random SKU
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `PV-${Date.now()}-${rand}`;
  }
}

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { product_id, sku, price, avatar, color_id, size_id } = req.body;

    if (!product_id)
      return res.status(400).json({ message: "product_id is required" });
    if (price === undefined)
      return res.status(400).json({ message: "price is required" });
    if (!color_id)
      return res.status(400).json({ message: "color_id is required" });
    if (!size_id)
      return res.status(400).json({ message: "size_id is required" });

    let avatarUrl = null;
    if (avatar) {
      avatarUrl = await uploadAvatarIfNeeded(avatar);
    }

    // Generate SKU if not provided
    const finalSku = sku || await generateSku(product_id, color_id, size_id);

    const variant = await ProductVariant.create({
      product_id,
      sku: finalSku,
      price,
      avatar: avatarUrl,
      color_id,
      size_id,
    });

    const result = await ProductVariant.findByPk(variant.id, {
      include: includeRelations,
    });

    return res.status(201).json(formatVariant(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL (CHƯA XOÁ, SEARCH SKU) =================
exports.findAll = async (req, res) => {
  try {
    const { sku, product_id } = req.query;

    const where = { deleted_at: null };
    if (sku) {
      where.sku = { [Op.like]: `%${sku}%` };
    }
    if (product_id) {
      where.product_id = product_id;
    }

    const variants = await ProductVariant.findAll({
      where,
      include: includeRelations,
      order: [["id", "DESC"]],
    });

    return res.status(200).json(variants.map(formatVariant));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await ProductVariant.findOne({
      where: { id, deleted_at: null },
      include: includeRelations,
    });

    if (!variant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    return res.status(200).json(formatVariant(variant));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;

    const variant = await ProductVariant.findOne({
      where: { id, deleted_at: null },
    });

    if (!variant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    // Upload avatar if provided
    if (avatar) {
      req.body.avatar = await uploadAvatarIfNeeded(avatar);
    }

    await variant.update(req.body);

    const result = await ProductVariant.findByPk(variant.id, {
      include: includeRelations,
    });

    return res.status(200).json(formatVariant(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await ProductVariant.findOne({
      where: { id, deleted_at: null },
    });

    if (!variant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    await variant.update({ deleted_at: new Date() });
    return res
      .status(200)
      .json({ message: "Product variant deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
