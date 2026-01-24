const db = require("../models");
const Role = db.Role;
const Permission = db.Permission;

function isMasterAdminRole(role) {
  const normalized = String(role?.name || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  return normalized === "masteradmin";
}

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const role = await Role.create({ name });

    return res.status(201).json({
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL (CHƯA XOÁ) =================
exports.findAll = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: {
        deleted_at: null, // ✅ chỉ lấy role chưa xoá
      },
      order: [["id", "DESC"]],
    });

    return res.json(roles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({
      where: {
        id,
        deleted_at: null, // ✅
      },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json(role);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const role = await Role.findOne({
      where: {
        id,
        deleted_at: null, // ✅ không cho update role đã xoá
      },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (name !== undefined) {
      role.name = name;
    }

    await role.save();

    return res.json({
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.update({
      deleted_at: new Date(), // ✅ XOÁ MỀM
    });

    return res.json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET PERMISSIONS OF A ROLE =================
exports.getPermissions = async (req, res) => {
  try {
    const { id } = req.params;

    const roleOnly = await Role.findOne({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!roleOnly) {
      return res.status(404).json({ message: "Role not found" });
    }

    // MASTER_ADMIN có toàn bộ quyền hạn (không phụ thuộc pivot)
    if (isMasterAdminRole(roleOnly)) {
      const allPermissions = await Permission.findAll({
        where: { deleted_at: null },
        order: [["id", "DESC"]],
      });
      return res.json(allPermissions);
    }

    const role = await Role.findOne({
      where: {
        id,
        deleted_at: null,
      },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] }, // ẩn cột pivot
          where: {
            deleted_at: null,
          },
          required: false,
        },
      ],
      order: [[{ model: Permission, as: "permissions" }, "id", "DESC"]],
    });

    return res.json(role.permissions || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= ASSIGN (REPLACE) PERMISSIONS FOR A ROLE =================
// Body: { permission_ids: [1,2,3] }
exports.setPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission_ids } = req.body;

    if (!Array.isArray(permission_ids)) {
      return res
        .status(400)
        .json({ message: "permission_ids must be an array of IDs" });
    }

    const role = await Role.findOne({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // MASTER_ADMIN luôn full quyền, không cần set pivot
    if (isMasterAdminRole(role)) {
      const allPermissions = await Permission.findAll({
        where: { deleted_at: null },
        order: [["id", "DESC"]],
      });
      return res.json({
        message: "MASTER_ADMIN always has all permissions",
        data: allPermissions,
      });
    }

    // Lọc bỏ các id trùng và null
    const uniqueIds = [...new Set(permission_ids)].filter(Boolean);

    // Lấy các permission hợp lệ (chưa bị xoá mềm)
    const validPermissions = await Permission.findAll({
      where: {
        id: uniqueIds,
        deleted_at: null,
      },
    });

    const validIds = validPermissions.map((p) => p.id);

    await role.setPermissions(validIds);

    const result = await Role.findOne({
      where: { id },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
          where: {
            deleted_at: null,
          },
          required: false,
        },
      ],
      order: [[{ model: Permission, as: "permissions" }, "id", "DESC"]],
    });

    return res.json({
      message: "Permissions updated successfully",
      data: result.permissions || [],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= REMOVE ONE PERMISSION FROM ROLE =================
exports.removePermission = async (req, res) => {
  try {
    const { id, permissionId } = req.params;

    const role = await Role.findOne({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // MASTER_ADMIN luôn full quyền, không cho remove
    if (isMasterAdminRole(role)) {
      return res
        .status(400)
        .json({ message: "Cannot remove permissions from MASTER_ADMIN role" });
    }

    const permission = await Permission.findOne({
      where: {
        id: permissionId,
        deleted_at: null,
      },
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    await role.removePermission(permission);

    return res.json({ message: "Permission removed from role successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
