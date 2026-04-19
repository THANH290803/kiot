const db = require("../models");
const { Op } = require("sequelize");

const Order = db.Order;
const OrderItem = db.OrderItem;
const Customer = db.Customer;
const CustomerVoucher = db.CustomerVoucher;
const Voucher = db.Voucher;
const User = db.User;
const Product = db.Product;
const ProductVariant = db.ProductVariant;
const Color = db.Color;
const Size = db.Size;

const orderStatusTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipping"],
  shipping: ["delivered"],
  delivered: ["completed"],
  completed: [],
  cancelled: [],
};

const orderChannels = ["online", "in_store"];

const includeRelations = [
  {
    model: Customer,
    as: "customer",
    attributes: ["id", "name", "email", "phone_number"],
  },
  {
    model: CustomerVoucher,
    as: "customerVoucher",
    attributes: ["id", "customer_id", "voucher_id", "status", "assigned_at", "used_at", "expired_at"],
    include: [
      {
        model: Voucher,
        as: "voucher",
        attributes: ["id", "code", "description", "discount_type", "discount_value", "status", "start_date", "end_date"],
      },
    ],
  },
  {
    model: User,
    as: "user",
    attributes: ["id", "name", "email"],
  },
  {
    model: OrderItem,
    as: "orderItems",
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "name", "avatar"],
      },
      {
        model: ProductVariant,
        as: "variant",
        attributes: ["id", "sku"],
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "avatar"],
          },
          {
            model: Color,
            as: "color",
            attributes: ["id", "name"],
          },
          {
            model: Size,
            as: "size",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  },
];

const formatOrder = (order) => ({
  id: order.id,
  order_code: order.order_code,
  customer_id: order.customer_id,
  customer_voucher_id: order.customer_voucher_id,
  user_id: order.user_id,
  total_quantity: order.total_quantity,
  total_amount: order.total_amount,
  payment_method: order.payment_method,
  channel: order.channel,
  status: order.status,
  note: order.note,
  customer: order.customer,
  customerVoucher: order.customerVoucher,
  user: order.user,
  orderItems: order.orderItems?.map((item) => ({
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    price: item.price,
    total: item.total,
    product: item.product,
    variant: item.variant,
    deleted_at: item.deleted_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
  })),
  deleted_at: order.deleted_at,
  created_at: order.created_at,
  updated_at: order.updated_at,
});

// Generate unique order code
function generateOrderCode() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

async function restoreCustomerVoucherForOrder(order, transaction) {
  if (!order.customer_voucher_id) {
    return;
  }

  const customerVoucher = await CustomerVoucher.findOne({
    where: {
      id: order.customer_voucher_id,
      deleted_at: null,
    },
    include: [
      {
        model: Voucher,
        as: "voucher",
      },
    ],
    transaction,
  });

  if (!customerVoucher || !customerVoucher.voucher) {
    return;
  }

  await customerVoucher.update(
    {
      status: "available",
      used_at: null,
    },
    { transaction }
  );

  const nextUsedCount = Math.max(0, Number(customerVoucher.voucher.used_count || 0) - 1);
  await customerVoucher.voucher.update(
    {
      used_count: nextUsedCount,
    },
    { transaction }
  );
}

// ================= CREATE =================
// Create order with order items
exports.create = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      customer_id,
      customer_voucher_id,
      user_id,
      order_items,
      payment_method = "cash",
      channel,
      status = "pending",
      note,
    } = req.body;

    const tokenUserId = req.user?.id ? Number(req.user.id) : null;
    const isCustomerToken = req.user?.type === "customer";

    const resolvedCustomerId = isCustomerToken
      ? tokenUserId
      : (customer_id ? Number(customer_id) : null);
    const resolvedCustomerVoucherId = customer_voucher_id ? Number(customer_voucher_id) : null;
    const resolvedUserId = isCustomerToken
      ? null
      : (user_id ? Number(user_id) : tokenUserId);
    const resolvedChannel = isCustomerToken
      ? "online"
      : (orderChannels.includes(channel) ? channel : "in_store");

    // Validate required fields
    if (!resolvedUserId && !resolvedCustomerId) {
      return res.status(400).json({ message: "user_id or customer_id is required" });
    }
    if (!orderChannels.includes(resolvedChannel)) {
      return res.status(400).json({ message: "channel must be online or in_store" });
    }
    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return res.status(400).json({ message: "order_items is required and must be a non-empty array" });
    }

    let resolvedCustomerVoucher = null;
    if (resolvedCustomerVoucherId) {
      resolvedCustomerVoucher = await CustomerVoucher.findOne({
        where: {
          id: resolvedCustomerVoucherId,
          deleted_at: null,
        },
        include: [
          {
            model: Voucher,
            as: "voucher",
          },
        ],
        transaction,
      });

      if (!resolvedCustomerVoucher) {
        await transaction.rollback();
        return res.status(404).json({ message: "Customer voucher not found" });
      }

      if (!resolvedCustomerId || resolvedCustomerVoucher.customer_id !== resolvedCustomerId) {
        await transaction.rollback();
        return res.status(400).json({ message: "customer_voucher_id does not belong to the selected customer" });
      }

      if (resolvedCustomerVoucher.status !== "available") {
        await transaction.rollback();
        return res.status(400).json({ message: "Customer voucher is not available" });
      }

      const voucher = resolvedCustomerVoucher.voucher;
      const now = new Date();
      const voucherStartDate = new Date(voucher.start_date);
      const voucherEndDate = new Date(voucher.end_date);

      if (voucher.status !== "active") {
        await transaction.rollback();
        return res.status(400).json({ message: "Voucher is not active" });
      }

      if (voucherStartDate > now || voucherEndDate < now) {
        await transaction.rollback();
        return res.status(400).json({ message: "Voucher is outside the valid date range" });
      }

      if (resolvedCustomerVoucher.expired_at && new Date(resolvedCustomerVoucher.expired_at) < now) {
        await transaction.rollback();
        return res.status(400).json({ message: "Customer voucher has expired" });
      }

      if (voucher.max_use > 0 && voucher.used_count >= voucher.max_use) {
        await transaction.rollback();
        return res.status(400).json({ message: "Voucher usage limit has been reached" });
      }
    }

    // Generate unique order code
    let orderCode;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      orderCode = generateOrderCode();
      const existingOrder = await Order.findOne({
        where: { order_code: orderCode },
        transaction,
      });
      if (!existingOrder) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      await transaction.rollback();
      return res.status(500).json({ message: "Failed to generate unique order code" });
    }

    // Calculate totals
    let totalQuantity = 0;
    let totalAmount = 0;
    const processedOrderItems = [];

    for (const item of order_items) {
      const { product_id, variant_id, quantity, price } = item;

      if (!product_id || !quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Each order item must have product_id and quantity"
        });
      }

      // Get product price if not provided
      let itemPrice = price;
      if (!itemPrice) {
        if (variant_id) {
          const variant = await ProductVariant.findByPk(variant_id, { transaction });
          if (variant && variant.price) {
            itemPrice = variant.price;
          }
        }
        // If no price found, require price in request
        if (!itemPrice) {
          await transaction.rollback();
          return res.status(400).json({
            message: `Price is required for product_id ${product_id}${variant_id ? ` and variant_id ${variant_id}` : ''}`
          });
        }
      }

      // Verify product exists
      const product = await Product.findByPk(product_id, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: `Product with id ${product_id} not found` });
      }

      const itemTotal = itemPrice * quantity;
      totalQuantity += quantity;
      totalAmount += itemTotal;

      processedOrderItems.push({
        product_id,
        variant_id: variant_id || null,
        quantity,
        price: itemPrice,
        total: itemTotal,
      });
    }

    // Create order
    const order = await Order.create(
      {
        order_code: orderCode,
        customer_id: resolvedCustomerId,
        customer_voucher_id: resolvedCustomerVoucherId,
        user_id: resolvedUserId,
        total_quantity: totalQuantity,
        total_amount: totalAmount,
        payment_method,
        channel: resolvedChannel,
        status,
        note,
      },
      { transaction }
    );

    // Create order items
    const orderItemsData = processedOrderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction });

    if (resolvedCustomerVoucher) {
      await resolvedCustomerVoucher.update(
        {
          status: "used",
          used_at: new Date(),
        },
        { transaction }
      );

      await resolvedCustomerVoucher.voucher.update(
        {
          used_count: resolvedCustomerVoucher.voucher.used_count + 1,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Fetch the created order with relations
    const result = await Order.findByPk(order.id, {
      include: includeRelations,
    });

    return res.status(201).json(formatOrder(result));
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL (CHƯA XOÁ, SEARCH THEO ORDER_CODE, CUSTOMER NAME) =================
exports.findAll = async (req, res) => {
  try {
    const { keyword, order_code, customer_name, status, channel, page = 1, limit = 10 } = req.query;

    const where = { deleted_at: null };
    const include = [...includeRelations];

    const normalizedKeyword = keyword || order_code || customer_name;

    if (normalizedKeyword) {
      where[Op.or] = [
        { order_code: { [Op.like]: `%${normalizedKeyword}%` } },
        { "$customer.name$": { [Op.like]: `%${normalizedKeyword}%` } },
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }
    if (channel) {
      if (!orderChannels.includes(channel)) {
        return res.status(400).json({ message: "channel must be online or in_store" });
      }
      where.channel = channel;
    }

    // Pagination
    const offset = (page - 1) * limit;
    const { count, rows } = await Order.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      orders: rows.map(formatOrder),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE (CHƯA XOÁ) =================
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id, deleted_at: null },
      include: includeRelations,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(formatOrder(order));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE (CHƯA XOÁ) =================
exports.update = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const { status, note, payment_method } = req.body;

    const order = await Order.findOne({
      where: { id, deleted_at: null },
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order
    await order.update(
      {
        status: status || order.status,
        note: note !== undefined ? note : order.note,
        payment_method: payment_method || order.payment_method,
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch updated order
    const result = await Order.findByPk(order.id, {
      include: includeRelations,
    });

    return res.status(200).json(formatOrder(result));
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      await transaction.rollback();
      return res.status(400).json({ message: "status is required" });
    }

    const order = await Order.findOne({
      where: { id, deleted_at: null },
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    const allowedNextStatuses = orderStatusTransitions[order.status] || [];

    if (!allowedNextStatuses.includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Không thể chuyển trạng thái từ ${order.status} sang ${status}`,
        current_status: order.status,
        allowed_statuses: allowedNextStatuses,
      });
    }

    if (status === "cancelled") {
      await restoreCustomerVoucherForOrder(order, transaction);
    }

    await order.update({ status }, { transaction });
    await transaction.commit();

    const result = await Order.findByPk(order.id, {
      include: includeRelations,
    });

    return res.status(200).json(formatOrder(result));
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE (XOÁ MỀM) =================
exports.delete = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id, deleted_at: null },
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    // Soft delete order
    await restoreCustomerVoucherForOrder(order, transaction);

    await order.update({ deleted_at: new Date() }, { transaction });

    // Soft delete order items
    await OrderItem.update(
      { deleted_at: new Date() },
      {
        where: { order_id: id },
        transaction,
      }
    );

    await transaction.commit();

    return res.status(200).json({
      message: "Order and order items deleted successfully"
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
