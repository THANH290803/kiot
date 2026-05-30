const db = require("../models");
const { Op } = require("sequelize");

const CustomerVoucher = db.CustomerVoucher;
const Customer = db.Customer;
const Voucher = db.Voucher;
const Order = db.Order;

const VALID_STATUSES = ["available", "used", "expired"];

const includeRelations = [
  {
    model: Customer,
    as: "customer",
    attributes: ["id", "name", "email", "phone_number"],
  },
  {
    model: Voucher,
    as: "voucher",
    attributes: [
      "id",
      "code",
      "description",
      "discount_type",
      "discount_value",
      "max_use",
      "used_count",
      "status",
      "start_date",
      "end_date",
    ],
  },
];

const formatCustomerVoucher = (record) => ({
  id: record.id,
  customer_id: record.customer_id,
  voucher_id: record.voucher_id,
  status: record.status,
  assigned_at: record.assigned_at,
  used_at: record.used_at,
  expired_at: record.expired_at,
  customer: record.customer,
  voucher: record.voucher,
  deleted_at: record.deleted_at,
  created_at: record.created_at,
  updated_at: record.updated_at,
});

async function loadVoucherOrFail(voucherId) {
  return Voucher.findOne({
    where: { id: voucherId, deleted_at: null },
  });
}

async function loadCustomerOrFail(customerId) {
  return Customer.findOne({
    where: { id: customerId, deleted_at: null },
  });
}

function validateStatus(status) {
  return !status || VALID_STATUSES.includes(status);
}

function resolveExpiredAt(expiredAt, voucher) {
  if (!expiredAt) {
    return null;
  }

  const voucherEndDate = new Date(voucher.end_date);
  const customerExpiredAt = new Date(expiredAt);

  if (customerExpiredAt > voucherEndDate) {
    return "expired_at cannot be greater than voucher end_date";
  }

  return null;
}

exports.assign = async (req, res) => {
  try {
    const customer_id = Number(req.body.customer_id);
    const voucher_id = Number(req.body.voucher_id);
    const status = req.body.status || "available";
    const expired_at = req.body.expired_at || null;

    if (!Number.isInteger(customer_id) || !Number.isInteger(voucher_id)) {
      return res.status(400).json({ message: "customer_id and voucher_id are required" });
    }

    if (!validateStatus(status)) {
      return res.status(400).json({ message: "status must be available, used or expired" });
    }

    const [customer, voucher] = await Promise.all([
      loadCustomerOrFail(customer_id),
      loadVoucherOrFail(voucher_id),
    ]);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    const expiredAtError = resolveExpiredAt(expired_at, voucher);
    if (expiredAtError) {
      return res.status(400).json({ message: expiredAtError });
    }

    const existing = await CustomerVoucher.findOne({
      where: {
        customer_id,
        voucher_id,
        deleted_at: null,
      },
      include: includeRelations,
    });

    if (existing) {
      return res.status(409).json({ message: "Customer already has this voucher" });
    }

    const customerVoucher = await CustomerVoucher.create({
      customer_id,
      voucher_id,
      status,
      expired_at,
      assigned_at: new Date(),
      used_at: status === "used" ? new Date() : null,
    });

    const result = await CustomerVoucher.findByPk(customerVoucher.id, {
      include: includeRelations,
    });

    return res.status(201).json(formatCustomerVoucher(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const {
      customer_id,
      voucher_id,
      status,
      keyword = "",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (currentPage - 1) * pageSize;

    const where = { deleted_at: null };

    if (customer_id) {
      where.customer_id = Number(customer_id);
    }

    if (voucher_id) {
      where.voucher_id = Number(voucher_id);
    }

    if (status) {
      if (!validateStatus(status)) {
        return res.status(400).json({ message: "status must be available, used or expired" });
      }
      where.status = status;
    }

    const voucherWhere = {};
    if (keyword) {
      voucherWhere[Op.or] = [
        { code: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { count, rows } = await CustomerVoucher.findAndCountAll({
      where,
      include: includeRelations.map((relation) =>
        relation.as === "voucher" ? { ...relation, where: voucherWhere, required: Boolean(keyword) } : relation
      ),
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    });

    return res.status(200).json({
      customer_vouchers: rows.map(formatCustomerVoucher),
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
    const customerVoucher = await CustomerVoucher.findOne({
      where: { id: req.params.id, deleted_at: null },
      include: includeRelations,
    });

    if (!customerVoucher) {
      return res.status(404).json({ message: "Customer voucher not found" });
    }

    return res.status(200).json(formatCustomerVoucher(customerVoucher));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const customerVoucher = await CustomerVoucher.findOne({
      where: { id: req.params.id, deleted_at: null },
      include: includeRelations,
    });

    if (!customerVoucher) {
      return res.status(404).json({ message: "Customer voucher not found" });
    }

    const status = req.body.status;
    const expired_at = req.body.expired_at;

    if (status && !validateStatus(status)) {
      return res.status(400).json({ message: "status must be available, used or expired" });
    }

    if (expired_at !== undefined) {
      const voucher = await loadVoucherOrFail(customerVoucher.voucher_id);
      const expiredAtError = resolveExpiredAt(expired_at, voucher);
      if (expiredAtError) {
        return res.status(400).json({ message: expiredAtError });
      }
    }

    const payload = {};
    if (status !== undefined) {
      payload.status = status;
      payload.used_at = status === "used" ? (customerVoucher.used_at || new Date()) : null;
    }
    if (expired_at !== undefined) {
      payload.expired_at = expired_at;
    }

    await customerVoucher.update(payload);

    const result = await CustomerVoucher.findByPk(customerVoucher.id, {
      include: includeRelations,
    });

    return res.status(200).json(formatCustomerVoucher(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const customerVoucher = await CustomerVoucher.findOne({
      where: { id: req.params.id, deleted_at: null },
    });

    if (!customerVoucher) {
      return res.status(404).json({ message: "Customer voucher not found" });
    }

    const linkedOrder = await Order.findOne({
      where: {
        customer_voucher_id: customerVoucher.id,
        deleted_at: null,
      },
    });

    if (linkedOrder) {
      return res.status(400).json({ message: "Customer voucher is already linked to an order" });
    }

    await customerVoucher.update({ deleted_at: new Date() });
    return res.status(200).json({ message: "Customer voucher deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
