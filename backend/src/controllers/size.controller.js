const db = require("../models");
const Size = db.Size;

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const size = await Size.create({ name });
    return res.status(201).json(size);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL (CHƯA XOÁ - DESC) =================
exports.findAll = async (req, res) => {
  try {
    const sizes = await Size.findAll({
      where: {
        deleted_at: null, // ✅ chỉ lấy size chưa xoá
      },
      order: [["id", "DESC"]],
    });
    return res.status(200).json(sizes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const size = await Size.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }

    return res.status(200).json(size);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const size = await Size.findOne({
      where: {
        id,
        deleted_at: null, // ✅ không cho update size đã xoá
      },
    });

    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }

    await size.update(req.body);
    return res.status(200).json(size);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const size = await Size.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!size) {
      return res.status(404).json({ message: "Size not found" });
    }

    await size.update({
      deleted_at: new Date(), // ✅ XOÁ MỀM
    });

    return res.status(200).json({ message: "Size deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
