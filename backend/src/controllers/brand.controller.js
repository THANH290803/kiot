const db = require("../models");
const Brand = db.Brand;

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const brand = await Brand.create({ name });
    return res.status(201).json(brand);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL (CHƯA XOÁ - DESC) =================
exports.findAll = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      where: {
        deleted_at: null, // ✅ chỉ lấy brand chưa xoá
      },
      order: [["id", "DESC"]],
    });
    return res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    return res.status(200).json(brand);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findOne({
      where: {
        id,
        deleted_at: null, // ✅ không cho update brand đã xoá
      },
    });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await brand.update(req.body);
    return res.status(200).json(brand);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await brand.update({
      deleted_at: new Date(), // ✅ XOÁ MỀM
    });

    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
