const db = require("../models");
const Permission = db.Permission;
const PermissionGroup = db.PermissionGroup;

// ================= GET ALL =================
exports.findAll = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      where: { deleted_at: null },
      order: [["id", "DESC"]],
      include: [
        {
          model: PermissionGroup,
          as: "group",
          attributes: ["id", "name"],
          where: { deleted_at: null },
          required: false,
        },
      ],
    });

    return res.json(permissions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE =================
exports.findOne = async (req, res) => {
  try {
    const permission = await Permission.findOne({
      where: { id: req.params.id, deleted_at: null },
      include: [
        {
          model: PermissionGroup,
          as: "group",
          attributes: ["id", "name"],
          where: { deleted_at: null },
          required: false,
        },
      ],
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    return res.json(permission);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { code, name, description, group_id } = req.body;

    if (!code || !name || !group_id) {
      return res
        .status(400)
        .json({ message: "code, name, group_id are required" });
    }

    // check trùng code
    const existed = await Permission.findOne({
      where: { code, deleted_at: null },
    });

    if (existed) {
      return res.status(409).json({ message: "Permission code already exists" });
    }

    const permission = await Permission.create({
      code,
      name,
      description: description ?? null,
      group_id,
      deleted_at: null,
    });

    const result = await Permission.findByPk(permission.id, {
      include: [
        {
          model: PermissionGroup,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, group_id } = req.body;

    const permission = await Permission.findOne({
      where: { id, deleted_at: null },
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    // check trùng code khi update
    if (code && code !== permission.code) {
      const duplicated = await Permission.findOne({
        where: { code, deleted_at: null },
      });

      if (duplicated) {
        return res
          .status(409)
          .json({ message: "Permission code already exists" });
      }
    }

    await permission.update({
      code: code ?? permission.code,
      name: name ?? permission.name,
      description: description ?? permission.description,
      group_id: group_id ?? permission.group_id,
    });

    const result = await Permission.findByPk(permission.id, {
      include: [
        {
          model: PermissionGroup,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE (SOFT) =================
exports.delete = async (req, res) => {
  try {
    const permission = await Permission.findOne({
      where: { id: req.params.id, deleted_at: null },
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    await permission.update({ deleted_at: new Date() });

    return res.json({ message: "Permission deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
