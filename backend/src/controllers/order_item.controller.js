const db = require("../models");
const { Op } = require("sequelize");

const OrderItem = db.OrderItem;
const Order = db.Order;
const Product = db.Product;
const ProductVariant = db.ProductVariant;

const includeRelations = [
  {
    model: Order,
    as: "order",
    attributes: ["id", "order_code", "status"],
  },
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
];

const formatOrderItem = (orderItem) => ({
  id: orderItem.id,
  order_id: orderItem.order_id,
  product_id: orderItem.product_id,
  variant_id: orderItem.variant_id,
  quantity: orderItem.quantity,
  price: orderItem.price,
  total: orderItem.total,
  order: orderItem.order,
  product: orderItem.product,
  variant: orderItem.variant,
  deleted_at: orderItem.deleted_at,
  created_at: orderItem.created_at,
  updated_at: orderItem.updated_at,
});

// ================= CREATE =================
exports.create = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { order_id, product_id, variant_id, quantity, price } = req.body;

    if (!order_id || !product_id || !quantity) {
      await transaction.rollback();
      return res.status(400).json({
        message: "order_id, product_id, and quantity are required"
      });
    }

    // Check if order exists and is not deleted
    const order = await Order.findOne({
      where: { id: order_id, deleted_at: null },
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if variant exists (if provided)
    if (variant_id) {
      const variant = await ProductVariant.findByPk(variant_id, { transaction });
      if (!variant) {
        await transaction.rollback();
        return res.status(404).json({ message: "Product variant not found" });
      }
    }

    // Get price from variant or require in request
    let itemPrice = price;
    if (!itemPrice && variant_id) {
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

    const total = itemPrice * quantity;

    const orderItem = await OrderItem.create(
      {
        order_id,
        product_id,
        variant_id: variant_id || null,
        quantity,
        price: itemPrice,
        total,
      },
      { transaction }
    );

    // Update order totals
    const allOrderItems = await OrderItem.findAll({
      where: { order_id, deleted_at: null },
      transaction,
    });

    const newTotalQuantity = allOrderItems.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalAmount = allOrderItems.reduce((sum, item) => sum + item.total, 0);

    await order.update(
      {
        total_quantity: newTotalQuantity,
        total_amount: newTotalAmount,
      },
      { transaction }
    );

    await transaction.commit();

    const result = await OrderItem.findByPk(orderItem.id, {
      include: includeRelations,
    });

    return res.status(201).json(formatOrderItem(result));
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL (CHƯA XOÁ) =================
exports.findAll = async (req, res) => {
  try {
    const { order_id, product_id, page = 1, limit = 10 } = req.query;

    const where = { deleted_at: null };

    if (order_id) {
      where.order_id = order_id;
    }
    if (product_id) {
      where.product_id = product_id;
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await OrderItem.findAndCountAll({
      where,
      include: includeRelations,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      orderItems: rows.map(formatOrderItem),
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

    const orderItem = await OrderItem.findOne({
      where: { id, deleted_at: null },
      include: includeRelations,
    });

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    return res.status(200).json(formatOrderItem(orderItem));
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
    const { quantity, price } = req.body;

    const orderItem = await OrderItem.findOne({
      where: { id, deleted_at: null },
      transaction,
    });

    if (!orderItem) {
      await transaction.rollback();
      return res.status(404).json({ message: "Order item not found" });
    }

    // Update price and quantity
    const newQuantity = quantity !== undefined ? quantity : orderItem.quantity;
    const newPrice = price !== undefined ? price : orderItem.price;
    const newTotal = newPrice * newQuantity;

    await orderItem.update(
      {
        quantity: newQuantity,
        price: newPrice,
        total: newTotal,
      },
      { transaction }
    );

    // Update order totals
    const order = await Order.findByPk(orderItem.order_id, { transaction });
    if (order) {
      const allOrderItems = await OrderItem.findAll({
        where: { order_id: orderItem.order_id, deleted_at: null },
        transaction,
      });

      const newTotalQuantity = allOrderItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalAmount = allOrderItems.reduce((sum, item) => sum + item.total, 0);

      await order.update(
        {
          total_quantity: newTotalQuantity,
          total_amount: newTotalAmount,
        },
        { transaction }
      );
    }

    await transaction.commit();

    const result = await OrderItem.findByPk(orderItem.id, {
      include: includeRelations,
    });

    return res.status(200).json(formatOrderItem(result));
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

    const orderItem = await OrderItem.findOne({
      where: { id, deleted_at: null },
      transaction,
    });

    if (!orderItem) {
      await transaction.rollback();
      return res.status(404).json({ message: "Order item not found" });
    }

    // Soft delete order item
    await orderItem.update({ deleted_at: new Date() }, { transaction });

    // Update order totals
    const order = await Order.findByPk(orderItem.order_id, { transaction });
    if (order) {
      const remainingOrderItems = await OrderItem.findAll({
        where: { order_id: orderItem.order_id, deleted_at: null },
        transaction,
      });

      const newTotalQuantity = remainingOrderItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalAmount = remainingOrderItems.reduce((sum, item) => sum + item.total, 0);

      await order.update(
        {
          total_quantity: newTotalQuantity,
          total_amount: newTotalAmount,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(200).json({
      message: "Order item deleted successfully"
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};