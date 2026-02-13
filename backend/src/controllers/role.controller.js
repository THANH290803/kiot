const db = require("../models");
const Role = db.Role;
const Permission = db.Permission;

// ================= UTILS =================
function normalizeRoleName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function isMasterAdminRole(role) {
  return normalizeRoleName(role?.name) === "masteradmin";
}

// ================= CREATE =================
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const normalizedName = normalizeRoleName(name);

    const existedRoles = await Role.findAll({
      where: { deleted_at: null },
    });

    const duplicated = existedRoles.find(
      (r) => normalizeRoleName(r.name) === normalizedName
    );

    if (duplicated) {
      return res.status(409).json({ message: "Role name already exists" });
    }

    const role = await Role.create({
      name,
      description: description ?? null,
    });

    return res.status(201).json({
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL =================
exports.findAll = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: { deleted_at: null },
      order: [["id", "DESC"]],
    });

    // Tổng quyền (dùng cho MASTER_ADMIN)
    const totalPermissions = await Permission.count({
      where: { deleted_at: null },
    });

    const result = await Promise.all(
      roles.map(async (role) => {
        // MASTER_ADMIN → full quyền
        if (isMasterAdminRole(role)) {
          return {
            ...role.toJSON(),
            permission_count: totalPermissions,
          };
        }

        // Role thường → đếm pivot
        const permissionCount = await role.countPermissions({
          where: { deleted_at: null },
        });

        return {
          ...role.toJSON(),
          permission_count: permissionCount,
        };
      })
    );

    // ===== ĐƯA MASTER_ADMIN LÊN ĐẦU =====
    const masterAdmin = result.find(isMasterAdminRole);
    const otherRoles = result.filter(
      (role) => !isMasterAdminRole(role)
    );

    const sortedResult = masterAdmin
      ? [masterAdmin, ...otherRoles]
      : otherRoles;

    return res.json(sortedResult);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({
      where: { id, deleted_at: null },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json(role);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findOne({
      where: { id, deleted_at: null },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (name !== undefined) {
      const normalizedName = normalizeRoleName(name);

      const roles = await Role.findAll({
        where: { deleted_at: null },
      });

      const duplicated = roles.find(
        (r) =>
          r.id !== role.id &&
          normalizeRoleName(r.name) === normalizedName
      );

      if (duplicated) {
        return res.status(409).json({ message: "Role name already exists" });
      }

      role.name = name;
    }

    if (description !== undefined) {
      role.description = description;
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

// ================= DELETE (SOFT) =================
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({
      where: { id, deleted_at: null },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.update({ deleted_at: new Date() });

    return res.json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET PERMISSIONS =================
exports.getPermissions = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findOne({
      where: { id, deleted_at: null },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (isMasterAdminRole(role)) {
      const allPermissions = await Permission.findAll({
        where: { deleted_at: null },
      });
      return res.json(allPermissions);
    }

    const result = await Role.findOne({
      where: { id },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
          where: { deleted_at: null },
          required: false,
        },
      ],
    });

    return res.json(result.permissions || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= SET PERMISSIONS =================
exports.setPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission_ids } = req.body;

    if (!Array.isArray(permission_ids)) {
      return res
        .status(400)
        .json({ message: "permission_ids must be an array" });
    }

    const role = await Role.findOne({
      where: { id, deleted_at: null },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (isMasterAdminRole(role)) {
      return res.json({
        message: "MASTER_ADMIN always has all permissions",
      });
    }

    const permissions = await Permission.findAll({
      where: {
        id: [...new Set(permission_ids)],
        deleted_at: null,
      },
    });

    await role.setPermissions(permissions);

    return res.json({ message: "Permissions updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= REMOVE PERMISSION =================
exports.removePermission = async (req, res) => {
  try {
    const { id, permissionId } = req.params;

    const role = await Role.findOne({
      where: { id, deleted_at: null },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (isMasterAdminRole(role)) {
      return res
        .status(400)
        .json({ message: "Cannot modify MASTER_ADMIN" });
    }

    const permission = await Permission.findOne({
      where: { id: permissionId, deleted_at: null },
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    await role.removePermission(permission);

    return res.json({ message: "Permission removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
