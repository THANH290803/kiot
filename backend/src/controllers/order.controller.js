const db = require("../models");
const { Op } = require("sequelize");

const Order = db.Order;
const OrderItem = db.OrderItem;
const Customer = db.Customer;
const User = db.User;
const Product = db.Product;
const ProductVariant = db.ProductVariant;

const includeRelations = [
  {
    model: Customer,
    as: "customer",
    attributes: ["id", "name", "email", "phone_number"],
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
        attributes: ["id", "name"],
      },
      {
        model: ProductVariant,
        as: "variant",
        attributes: ["id", "sku"],
        include: [
          {
            model: Product,
            as: "product",
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
  user_id: order.user_id,
  total_quantity: order.total_quantity,
  total_amount: order.total_amount,
  payment_method: order.payment_method,
  status: order.status,
  note: order.note,
  customer: order.customer,
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

// ================= CREATE =================
// Create order with order items
exports.create = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      customer_id,
      user_id,
      order_items,
      payment_method = "cash",
      status = "pending",
      note,
    } = req.body;

    // Validate required fields
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return res.status(400).json({ message: "order_items is required and must be a non-empty array" });
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
        customer_id: customer_id || null,
        user_id,
        total_quantity: totalQuantity,
        total_amount: totalAmount,
        payment_method,
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
    const { order_code, customer_name, status, page = 1, limit = 10 } = req.query;

    const where = { deleted_at: null };
    const include = [...includeRelations];

    // Search by order_code
    if (order_code) {
      where.order_code = { [Op.like]: `%${order_code}%` };
    }

    // Search by customer name
    if (customer_name) {
      include[0] = {
        ...include[0],
        where: { name: { [Op.like]: `%${customer_name}%` } },
        required: true,
      };
    }

    // Filter by status
    if (status) {
      where.status = status;
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