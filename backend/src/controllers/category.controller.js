const db = require("../models");
const Category = db.Category;

// ================= GET ALL (CHƯA XOÁ - DESC) =================
exports.findAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        deleted_at: null, // ✅ chỉ lấy category chưa xoá
      },
      order: [["id", "DESC"]],
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        deleted_at: null, // ✅
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const category = await Category.create({ name });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        deleted_at: null, // ✅ không cho update category đã xoá
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.update(req.body);

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        deleted_at: null, // ✅
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.update({
      deleted_at: new Date(), // ✅ XOÁ MỀM
    });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
