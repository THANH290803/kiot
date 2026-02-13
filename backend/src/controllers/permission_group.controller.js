const db = require("../models");
const PermissionGroup = db.PermissionGroup;

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const permissionGroup = await PermissionGroup.create({ name });
    return res.status(201).json(permissionGroup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const groups = await PermissionGroup.findAll({
      where: { deleted_at: null },
      order: [["id", "DESC"]],
    });

    const result = await Promise.all(
      groups.map(async (group) => {
        const count = await group.countPermissions({
          where: { deleted_at: null },
        });

        return {
          ...group.toJSON(),
          permission_count: count,
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const permissionGroup = await PermissionGroup.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!permissionGroup) {
      return res
        .status(404)
        .json({ message: "Permission group not found" });
    }

    return res.status(200).json(permissionGroup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const permissionGroup = await PermissionGroup.findOne({
      where: {
        id,
        deleted_at: null, // ✅ không cho update đã xoá
      },
    });

    if (!permissionGroup) {
      return res
        .status(404)
        .json({ message: "Permission group not found" });
    }

    await permissionGroup.update(req.body);
    return res.status(200).json(permissionGroup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const permissionGroup = await PermissionGroup.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!permissionGroup) {
      return res
        .status(404)
        .json({ message: "Permission group not found" });
    }

    await permissionGroup.update({
      deleted_at: new Date(), // ✅ XOÁ MỀM
    });

    return res
      .status(200)
      .json({ message: "Permission group deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
