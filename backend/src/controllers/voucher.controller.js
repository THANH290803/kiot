const db = require("../models");
const { Op } = require("sequelize");

const Voucher = db.Voucher;

const VALID_DISCOUNT_TYPES = ["percent", "fixed"];
const VALID_STATUSES = ["active", "inactive"];

const formatVoucher = (voucher) => ({
  id: voucher.id,
  code: voucher.code,
  description: voucher.description,
  discount_type: voucher.discount_type,
  discount_value: voucher.discount_value,
  max_use: voucher.max_use,
  used_count: voucher.used_count,
  status: voucher.status,
  start_date: voucher.start_date,
  end_date: voucher.end_date,
  deleted_at: voucher.deleted_at,
  created_at: voucher.created_at,
  updated_at: voucher.updated_at,
});

function validateVoucherPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.code !== undefined) {
    if (!payload.code || !String(payload.code).trim()) {
      errors.push("code is required");
    }
  }

  if (!partial || payload.discount_type !== undefined) {
    if (!VALID_DISCOUNT_TYPES.includes(payload.discount_type)) {
      errors.push("discount_type must be percent or fixed");
    }
  }

  if (!partial || payload.discount_value !== undefined) {
    const value = Number(payload.discount_value);
    if (!Number.isFinite(value) || value <= 0) {
      errors.push("discount_value must be greater than 0");
    }
  }

  if (!partial || payload.max_use !== undefined) {
    const value = Number(payload.max_use);
    if (!Number.isInteger(value) || value < 0) {
      errors.push("max_use must be an integer greater than or equal to 0");
    }
  }

  if (!partial || payload.used_count !== undefined) {
    const value = Number(payload.used_count);
    if (!Number.isInteger(value) || value < 0) {
      errors.push("used_count must be an integer greater than or equal to 0");
    }
  }

  if (!partial || payload.status !== undefined) {
    if (!VALID_STATUSES.includes(payload.status)) {
      errors.push("status must be active or inactive");
    }
  }

  if (!partial || payload.start_date !== undefined) {
    if (!payload.start_date) {
      errors.push("start_date is required");
    }
  }

  if (!partial || payload.end_date !== undefined) {
    if (!payload.end_date) {
      errors.push("end_date is required");
    }
  }

  if (payload.start_date && payload.end_date) {
    if (new Date(payload.end_date) < new Date(payload.start_date)) {
      errors.push("end_date must be greater than or equal to start_date");
    }
  }

  if (
    payload.max_use !== undefined &&
    payload.used_count !== undefined &&
    Number(payload.used_count) > Number(payload.max_use)
  ) {
    errors.push("used_count cannot be greater than max_use");
  }

  return errors;
}

exports.create = async (req, res) => {
  try {
    const payload = {
      code: req.body.code?.trim(),
      description: req.body.description || null,
      discount_type: req.body.discount_type,
      discount_value: Number(req.body.discount_value),
      max_use: Number(req.body.max_use ?? 0),
      used_count: Number(req.body.used_count ?? 0),
      status: req.body.status || "active",
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    };

    const errors = validateVoucherPayload(payload);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const existing = await Voucher.findOne({
      where: { code: payload.code, deleted_at: null },
    });

    if (existing) {
      return res.status(409).json({ message: "Voucher code already exists" });
    }

    const voucher = await Voucher.create(payload);
    return res.status(201).json(formatVoucher(voucher));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { keyword = "", status, page = 1, limit = 10 } = req.query;
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (currentPage - 1) * pageSize;

    const where = {
      deleted_at: null,
    };

    if (keyword) {
      where[Op.or] = [
        { code: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Voucher.findAndCountAll({
      where,
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    });

    return res.status(200).json({
      vouchers: rows.map(formatVoucher),
      pagination: {
        total: count,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({
      where: { id: req.params.id, deleted_at: null },
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    return res.status(200).json(formatVoucher(voucher));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({
      where: { id: req.params.id, deleted_at: null },
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    const payload = {
      code: req.body.code?.trim(),
      description: req.body.description,
      discount_type: req.body.discount_type,
      discount_value: req.body.discount_value !== undefined ? Number(req.body.discount_value) : undefined,
      max_use: req.body.max_use !== undefined ? Number(req.body.max_use) : undefined,
      used_count: req.body.used_count !== undefined ? Number(req.body.used_count) : undefined,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    };

    const normalizedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined)
    );

    const errors = validateVoucherPayload(
      {
        ...voucher.toJSON(),
        ...normalizedPayload,
      },
      { partial: true }
    );

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    if (normalizedPayload.code && normalizedPayload.code !== voucher.code) {
      const existing = await Voucher.findOne({
        where: {
          code: normalizedPayload.code,
          id: { [Op.ne]: voucher.id },
          deleted_at: null,
        },
      });

      if (existing) {
        return res.status(409).json({ message: "Voucher code already exists" });
      }
    }

    await voucher.update(normalizedPayload);
    return res.status(200).json(formatVoucher(voucher));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({
      where: { id: req.params.id, deleted_at: null },
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    await voucher.update({ deleted_at: new Date() });
    return res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
