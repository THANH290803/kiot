const db = require("../models");
const crypto = require("crypto");
const qs = require("qs");

const Order = db.Order;

// ================= VNPAY CREATE PAYMENT =================
exports.createVnpayPayment = async (req, res) => {
  try {
    const { order_id, amount, order_info } = req.body;

    let order = null;

    if (order_id) {
      order = await Order.findOne({
        where: { id: order_id, deleted_at: null },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
    }

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;
    const ipnUrl = process.env.VNP_IPN_URL;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl || !ipnUrl) {
      return res.status(500).json({
        message: "Thiếu cấu hình VNPay. Vui lòng kiểm tra VNP_TMN_CODE, VNP_HASH_SECRET, VNP_URL và PUBLIC_BACKEND_URL hoặc VNP_RETURN_URL/VNP_IPN_URL.",
      });
    }

    const normalizedAmount = Number(order ? order.total_amount : amount);

    if (!normalizedAmount || Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({ message: "amount phải lớn hơn 0 để tạo thanh toán VNPay." });
    }

    const txnRef = order?.order_code || `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderInfo = order_info || `Thanh toan don hang ${txnRef}`;

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
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: normalizedAmount * 100,
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
      payment_url: `${vnpUrl}?${qs.stringify(vnpParams, { encode: true })}`,
      order_id: order?.id || null,
      order_code: txnRef,
      amount: normalizedAmount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.verifyVnpayReturn = async (req, res) => {
  try {
    const vnpParams = { ...req.query };
    const secureHash = vnpParams.vnp_SecureHash;

    if (!secureHash) {
      return res.status(400).json({ message: "Thiếu chữ ký VNPay.", success: false });
    }

    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const secretKey = process.env.VNP_HASH_SECRET;

    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnpParams[key];
        return acc;
      }, {});

    const signData = qs.stringify(sortedParams, { encode: true });
    const checkHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData))
      .digest("hex");

    if (secureHash !== checkHash) {
      return res.status(400).json({ message: "Chữ ký VNPay không hợp lệ.", success: false });
    }

    const isSuccess = vnpParams.vnp_ResponseCode === "00" && vnpParams.vnp_TransactionStatus === "00";

    return res.status(200).json({
      success: isSuccess,
      order_code: vnpParams.vnp_TxnRef,
      amount: vnpParams.vnp_Amount ? Number(vnpParams.vnp_Amount) / 100 : 0,
      response_code: vnpParams.vnp_ResponseCode || null,
      transaction_status: vnpParams.vnp_TransactionStatus || null,
      message: isSuccess ? "Xác thực thanh toán VNPay thành công." : "Thanh toán VNPay chưa thành công.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

exports.vnpayReturnRedirect = async (req, res) => {
  try {
    const frontendReturnUrl =
      process.env.FRONTEND_VNPAY_RETURN_URL || "http://localhost:3003/payment/vnpay-return";
    const queryString = qs.stringify(req.query, { encode: false });
    const redirectUrl = queryString ? `${frontendReturnUrl}?${queryString}` : frontendReturnUrl;

    return res.redirect(302, redirectUrl);
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
        status: "completed",
        payment_method: "vnpay",
      });
      return res.json({ RspCode: "00", Message: "Success" });
    }

    await order.update({ status: "cancelled" });
    return res.json({ RspCode: "00", Message: "Payment failed" });
  } catch (error) {
    console.error(error);
    return res.json({ RspCode: "99", Message: "Unknown error" });
  }
};
