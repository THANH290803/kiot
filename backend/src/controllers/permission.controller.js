const db = require("../models");
const Permission = db.Permission;
const PermissionGroup = db.PermissionGroup;

module.exports = {
  // ================= GET ALL (CHƯA XOÁ) =================
  async findAll(req, res) {
    try {
      const permissions = await Permission.findAll({
        where: {
          deleted_at: null, // ✅ chỉ lấy permission chưa xoá
        },
        order: [["id", "DESC"]],
        include: [
          {
            model: PermissionGroup,
            as: "group",
            attributes: ["id", "name"],
            where: {
              deleted_at: null, // ✅ chỉ lấy group chưa xoá
            },
            required: false, // phòng trường hợp permission chưa có group
          },
        ],
      });

      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ================= GET ONE (CHƯA XOÁ) =================
  async findOne(req, res) {
    try {
      const permission = await Permission.findOne({
        where: {
          id: req.params.id,
          deleted_at: null, // ✅
        },
        include: [
          {
            model: PermissionGroup,
            as: "group",
            attributes: ["id", "name"],
            where: {
              deleted_at: null,
            },
            required: false,
          },
        ],
      });

      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }

      res.json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ================= CREATE =================
  async create(req, res) {
    try {
      const permission = await Permission.create({
        ...req.body,
        deleted_at: null, // ✅ đảm bảo luôn có
      });

      // ✅ QUERY LẠI để lấy đầy đủ quan hệ
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
  },

  // ================= UPDATE (CHƯA XOÁ) =================
  async update(req, res) {
    try {
      const permission = await Permission.findOne({
        where: {
          id: req.params.id,
          deleted_at: null, // ✅ không update permission đã xoá
        },
      });

      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }

      await permission.update(req.body);
      res.json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ================= DELETE (XOÁ MỀM) =================
  async delete(req, res) {
    try {
      const permission = await Permission.findOne({
        where: {
          id: req.params.id,
          deleted_at: null, // ✅
        },
      });

      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }

      await permission.update({
        deleted_at: new Date(), // ✅ XOÁ MỀM
      });

      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
