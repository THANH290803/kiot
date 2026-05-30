const db = require("../models");

const Cart = db.Cart;
const CartItem = db.CartItem;
const ProductVariant = db.ProductVariant;
const Product = db.Product;
const Color = db.Color;
const Size = db.Size;
const Image = db.Image;

async function getOrCreateCart(customerId) {
  const [cart] = await Cart.findOrCreate({
    where: { customer_id: customerId },
    defaults: { customer_id: customerId },
  });
  return cart;
}

function formatCart(cart) {
  const items = (cart.items || []).map((item) => {
    const variant = item.variant;
    const primaryImage =
      (variant?.images || []).find((img) => img.is_primary)?.url ||
      variant?.images?.[0]?.url ||
      variant?.product?.avatar ||
      null;

    return {
      id: item.id,
      cart_id: item.cart_id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      price: item.price,
      unit_price: variant?.price || 0,
      line_total: item.price,
      product: {
        id: variant?.product?.id,
        name: variant?.product?.name,
        avatar: variant?.product?.avatar,
      },
      variant: {
        id: variant?.id,
        sku: variant?.sku,
        color: variant?.color,
        size: variant?.size,
        image: primaryImage,
      },
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  });

  const total_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total_amount = items.reduce((sum, item) => sum + item.line_total, 0);

  return {
    id: cart.id,
    customer_id: cart.customer_id,
    total_quantity,
    total_amount,
    items,
    created_at: cart.created_at,
    updated_at: cart.updated_at,
  };
}

async function sendCartResponse(customerId, res) {
  const cart = await getOrCreateCart(customerId);
  const cartWithItems = await Cart.findByPk(cart.id, {
    include: [
      {
        model: CartItem,
        as: "items",
        include: [
          {
            model: ProductVariant,
            as: "variant",
            include: [
              { model: Product, as: "product", attributes: ["id", "name", "avatar"] },
              { model: Color, as: "color", attributes: ["id", "name"] },
              { model: Size, as: "size", attributes: ["id", "name"] },
              { model: Image, as: "images", attributes: ["id", "url", "is_primary"] },
            ],
          },
        ],
        order: [["id", "DESC"]],
      },
    ],
  });

  return res.json(formatCart(cartWithItems));
}

exports.getMyCart = async (req, res) => {
  try {
    return sendCartResponse(req.user.id, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { product_variant_id, quantity = 1 } = req.body;

    if (!product_variant_id) {
      return res.status(400).json({ message: "product_variant_id is required" });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ message: "quantity must be greater than 0" });
    }

    const variant = await ProductVariant.findOne({
      where: { id: product_variant_id, deleted_at: null },
    });

    if (!variant) {
      return res.status(404).json({ message: "Product variant not found" });
    }

    const cart = await getOrCreateCart(customerId);

    const existed = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_variant_id,
      },
    });

    const nextQuantity = (existed?.quantity || 0) + qty;

    if (variant.quantity < nextQuantity) {
      return res.status(400).json({ message: "Quantity exceeds stock" });
    }

    if (existed) {
      await existed.update({
        quantity: nextQuantity,
        price: variant.price * nextQuantity,
      });
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_variant_id,
        quantity: qty,
        price: variant.price * qty,
      });
    }

    return sendCartResponse(customerId, res);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Item already exists in cart" });
    }
    return res.status(500).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const customerId = req.user.id;
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (!Number.isFinite(itemId)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ message: "quantity must be greater than 0" });
    }

    const cart = await getOrCreateCart(customerId);
    const item = await CartItem.findOne({
      where: {
        id: itemId,
        cart_id: cart.id,
      },
      include: [{ model: ProductVariant, as: "variant" }],
    });

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if ((item.variant?.quantity || 0) < qty) {
      return res.status(400).json({ message: "Quantity exceeds stock" });
    }

    await item.update({
      quantity: qty,
      price: (item.variant?.price || 0) * qty,
    });
    return sendCartResponse(customerId, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const customerId = req.user.id;
    const itemId = Number(req.params.itemId);

    if (!Number.isFinite(itemId)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const cart = await getOrCreateCart(customerId);
    const item = await CartItem.findOne({
      where: {
        id: itemId,
        cart_id: cart.id,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await item.destroy();
    return sendCartResponse(customerId, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.clearMyCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const cart = await getOrCreateCart(customerId);
    await CartItem.destroy({ where: { cart_id: cart.id } });
    return sendCartResponse(customerId, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
