const db = require("../models");
const crypto = require("crypto");
const qs = require("qs");

const Order = db.Order;

// ================= VNPAY CREATE PAYMENT =================
exports.createVnpayPayment = async (req, res) => {
  try {
    const { order_id } = req.body;

    const order = await Order.findOne({
      where: { id: order_id, deleted_at: null },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const createDate = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    let vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: order.order_code,
      vnp_OrderInfo: `Thanh toan don hang ${order.order_code}`,
      vnp_OrderType: "other",
      vnp_Amount: order.total_amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // sort params
    vnpParams = Object.keys(vnpParams)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnpParams[key];
        return acc;
      }, {});

    const signData = qs.stringify(vnpParams, { encode: false });
    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData))
      .digest("hex");

    vnpParams.vnp_SecureHash = secureHash;

    return res.json({
      payment_url: `${vnpUrl}?${qs.stringify(vnpParams, { encode: false })}`,
      order_id: order.id,
      order_code: order.order_code,
      amount: order.total_amount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= VNPAY IPN =================
exports.vnpayIPN = async (req, res) => {
  try {
    const vnpParams = { ...req.query };
    const secureHash = vnpParams.vnp_SecureHash;

    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const secretKey = process.env.VNP_HASH_SECRET;

    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnpParams[key];
        return acc;
      }, {});

    const signData = qs.stringify(sortedParams, { encode: false });
    const checkHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData))
      .digest("hex");

    if (secureHash !== checkHash) {
      return res.json({ RspCode: "97", Message: "Invalid signature" });
    }

    const order = await Order.findOne({
      where: { order_code: vnpParams.vnp_TxnRef },
    });

    if (!order) {
      return res.json({ RspCode: "01", Message: "Order not found" });
    }

    if (vnpParams.vnp_ResponseCode === "00") {
      await order.update({
        status: "paid",
        payment_method: "vnpay",
      });
      return res.json({ RspCode: "00", Message: "Success" });
    }

    await order.update({ status: "failed" });
    return res.json({ RspCode: "00", Message: "Payment failed" });
  } catch (error) {
    console.error(error);
    return res.json({ RspCode: "99", Message: "Unknown error" });
  }
};
