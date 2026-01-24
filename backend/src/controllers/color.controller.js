const db = require("../models");
const Color = db.Color;

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "name and code are required" });
    }

    const color = await Color.create({ name, code });
    return res.status(201).json(color);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL (CHƯA XOÁ - DESC) =================
exports.findAll = async (req, res) => {
  try {
    const colors = await Color.findAll({
      where: {
        deleted_at: null, // ✅ chỉ lấy color chưa xoá
      },
      order: [["id", "DESC"]],
    });

    return res.status(200).json(colors);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const color = await Color.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    return res.status(200).json(color);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const color = await Color.findOne({
      where: {
        id,
        deleted_at: null, // ✅ không cho update color đã xoá
      },
    });

    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    await color.update(req.body);
    return res.status(200).json(color);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const color = await Color.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    await color.update({
      deleted_at: new Date(), // ✅ XOÁ MỀM
    });

    return res.status(200).json({ message: "Color deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
