const db = require("../models");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");
const cloudinary = require("../utils/cloudinary");

const Product = db.Product;
const Category = db.Category;
const Brand = db.Brand;
const ProductVariant = db.ProductVariant;
const Image = db.Image;

const includeRelations = [
  { model: Category, as: "category", attributes: ["id", "name"] },
  { model: Brand, as: "brand", attributes: ["id", "name"] },
];

const CLOUDINARY_FOLDER =
    process.env.CLOUDINARY_FOLDER || "avatarProduct";

async function uploadProductAvatar(avatar, productId) {
  if (!avatar) return null;

  const result = await cloudinary.uploader.upload(avatar, {
    folder: CLOUDINARY_FOLDER,
    public_id: `product_${productId}`,
    overwrite: true,
    resource_type: "image",
  });

  return result.secure_url;
}

function sortVariantImages(images = []) {
  return [...images].sort((left, right) => {
    if (left.is_primary !== right.is_primary) {
      return left.is_primary ? -1 : 1;
    }

    return (left.sort_order || 0) - (right.sort_order || 0);
  });
}

function normalizeProductVariantImages(product) {
  if (!product?.variants) {
    return product;
  }

  product.variants.forEach((variant) => {
    if (Array.isArray(variant.images)) {
      variant.images = sortVariantImages(variant.images);
    }
  });

  return product;
}

const getVariantImages = (files, color_id, size_id) => {
  const key = `images_${color_id}_${size_id}`;
  return files.filter(f => f.fieldname === key);
};

const formatProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  avatar: product.avatar,
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
    const { name, category_id, brand_id, status, description, avatar } = req.body;

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

    if (avatar) {
      const avatarUrl = await uploadProductAvatar(avatar, product.id);
      await product.update({ avatar: avatarUrl });
    }

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

    const { avatar, ...restBody } = req.body;
    const updateData = { ...restBody };

    if (avatar) {
      updateData.avatar = await uploadProductAvatar(avatar, product.id);
    }

    await product.update(updateData);

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

exports.createProductWithVariants = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    /* ================= VALIDATE ================= */
    if (!req.body.variants || !req.body.name || !req.body.category_id || !req.body.brand_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const variants = JSON.parse(req.body.variants);
    const rawImageMap = JSON.parse(req.body.image_map || "{}");

    /* ================= NORMALIZE IMAGE MAP ================= */
    const imageMap = Object.entries(rawImageMap).map(
        ([file_index, value]) => ({
          file_index: Number(file_index),
          color_id: value.color_id,
          size_id: value.size_id,
        })
    );

    /* ================= CREATE PRODUCT (⚠️ Ở ĐÂY) ================= */
    const product = await Product.create(
        {
          name: req.body.name,
          category_id: req.body.category_id,
          brand_id: req.body.brand_id,
          description: req.body.description,
        },
        { transaction: t }
    );

    /* ================= UPLOAD AVATAR ================= */
    const avatarFile = req.files.find(f => f.fieldname === "avatar");
    if (avatarFile?.path) {
      await product.update({ avatar: avatarFile.path }, { transaction: t });
    }
    /* ================= ALL IMAGES ================= */
    const images = req.files.filter(f => f.fieldname === "images");

    const resultVariants = [];

    /* ================= CREATE VARIANTS ================= */
    for (const v of variants) {
      const variant = await ProductVariant.create(
          {
            product_id: product.id,
            sku: `SKU-${product.id}-${v.color_id}-${v.size_id}`,
            price: v.price,
            quantity: v.quantity,
            color_id: v.color_id,
            size_id: v.size_id,
          },
          { transaction: t }
      );

      /* ===== MAP IMAGE → VARIANT ===== */
      const filesOfVariant = imageMap
          .filter(m => m.color_id === v.color_id && m.size_id === v.size_id)
          .map(m => images[m.file_index])
          .filter(Boolean);

      const uploadedImages = [];

      for (const [index, file] of filesOfVariant.entries()) {
        if (!file?.path) {
          continue;
        }

        uploadedImages.push(file.path);

        await Image.create(
            {
              variant_id: variant.id,
              url: file.path,
              is_primary: index === 0,
              sort_order: index,
            },
            { transaction: t }
        );
      }

      resultVariants.push({
        ...variant.toJSON(),
        images: uploadedImages,
      });
    }

    await t.commit();

    return res.status(201).json({
      product: {
        id: product.id,
        name: product.name,
        avatar: product.avatar,
      },
      variants: resultVariants,
    });

  } catch (e) {
    await t.rollback();
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
};

exports.getAllProductsWithVariants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      name,
      category_id,
      brand_id,
      status
    } = req.query;

    const where = {
      deleted_at: null
    };

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`
      };
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (brand_id) {
      where.brand_id = brand_id;
    }

    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      distinct: true,
      col: "id",

      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"]
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name"]
        },
        {
          model: ProductVariant,
          as: "variants",
          required: false,
          where: {
            [Op.or]: [
              { deleted_at: null },
              { deleted_at: { [Op.is]: null } }
            ]
          },
          include: [
            {
              model: db.Color,
              as: "color",
              attributes: ["id", "name"],
              required: false
            },
            {
              model: db.Size,
              as: "size",
              attributes: ["id", "name"],
              required: false
            },
            {
              model: db.Image,
              as: "images",
              attributes: ["id", "url", "is_primary", "sort_order"],
              required: false,
              where: {
                [Op.or]: [
                  { deleted_at: null },
                  { deleted_at: { [Op.is]: null } }
                ]
              }
            }
          ]
        }
      ],

      limit: parseInt(limit),
      offset: parseInt(offset),

      order: [["id", "DESC"]]
    });

    const normalizedRows = rows.map((row) => normalizeProductVariantImages(row));

    return res.status(200).json({
      data: normalizedRows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(count / parseInt(limit))
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message
    });
  }
};

exports.exportProductsExcel = async (req, res) => {
  try {
    const { name, category_id, brand_id, status } = req.query;

    const where = {
      deleted_at: null,
    };

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (brand_id) {
      where.brand_id = brand_id;
    }

    if (status !== undefined) {
      where.status = status;
    }

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name"],
        },
        {
          model: ProductVariant,
          as: "variants",
          required: false,
          where: {
            [Op.or]: [{ deleted_at: null }, { deleted_at: { [Op.is]: null } }],
          },
          include: [
            {
              model: db.Color,
              as: "color",
              attributes: ["id", "name"],
              required: false,
            },
            {
              model: db.Size,
              as: "size",
              attributes: ["id", "name"],
              required: false,
            },
            {
              model: db.Image,
              as: "images",
              attributes: ["id", "url", "is_primary", "sort_order"],
              required: false,
              where: {
                [Op.or]: [{ deleted_at: null }, { deleted_at: { [Op.is]: null } }],
              },
            },
          ],
        },
      ],
      order: [
        ["id", "DESC"],
        [{ model: ProductVariant, as: "variants" }, "id", "ASC"],
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách hàng hóa");

    worksheet.columns = [
      { header: "ID sản phẩm", key: "product_id", width: 14 },
      { header: "Tên hàng hóa", key: "product_name", width: 28 },
      { header: "Danh mục", key: "category", width: 18 },
      { header: "Thương hiệu", key: "brand", width: 18 },
      { header: "Trạng thái", key: "status", width: 18 },
      { header: "ID biến thể", key: "variant_id", width: 14 },
      { header: "SKU", key: "sku", width: 24 },
      { header: "Màu sắc", key: "color", width: 16 },
      { header: "Kích thước", key: "size", width: 16 },
      { header: "Giá bán", key: "price", width: 16 },
      { header: "Tồn kho", key: "quantity", width: 14 },
      { header: "Ảnh đại diện sản phẩm", key: "product_avatar", width: 40 },
      { header: "Ảnh biến thể", key: "variant_images", width: 70 },
      { header: "Ngày tạo", key: "created_at", width: 22 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    products.forEach((product) => {
      const normalizedProduct = normalizeProductVariantImages(product);
      const variants = normalizedProduct.variants || [];
      const statusLabel =
        normalizedProduct.status === 1
          ? "Đang kinh doanh"
          : normalizedProduct.status === 2
            ? "Không còn hàng"
            : "Ngừng kinh doanh";

      if (variants.length === 0) {
        worksheet.addRow({
          product_id: normalizedProduct.id,
          product_name: normalizedProduct.name,
          category: normalizedProduct.category?.name || "",
          brand: normalizedProduct.brand?.name || "",
          status: statusLabel,
          product_avatar: normalizedProduct.avatar || "",
          created_at: normalizedProduct.created_at,
        });
        return;
      }

      variants.forEach((variant) => {
        const variantImages = sortVariantImages(variant.images || []).map((image) => image.url).join("\n");

        worksheet.addRow({
          product_id: normalizedProduct.id,
          product_name: normalizedProduct.name,
          category: normalizedProduct.category?.name || "",
          brand: normalizedProduct.brand?.name || "",
          status: statusLabel,
          variant_id: variant.id,
          sku: variant.sku,
          color: variant.color?.name || "",
          size: variant.size?.name || "",
          price: variant.price,
          quantity: variant.quantity,
          product_avatar: normalizedProduct.avatar || "",
          variant_images: variantImages,
          created_at: normalizedProduct.created_at,
        });
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=danh_sach_hang_hoa.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProductDetailsWithVariants = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: {
        id,
        deleted_at: null,
      },

      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name"],
        },

        {
          model: ProductVariant,
          as: "variants",
          where: { deleted_at: null },
          required: false,

          include: [
            {
              model: db.Color,
              as: "color",
              attributes: ["id", "name"],
            },
            {
              model: db.Size,
              as: "size",
              attributes: ["id", "name"],
            },
            {
              model: db.Image,
              as: "images",
              attributes: ["id", "url", "is_primary", "sort_order"],
              where: { deleted_at: null },
              required: false,
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(normalizeProductVariantImages(product));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
