const db = require("../models");

const Order = db.Order;

function normalizeAmount(value) {
  const amount = Number(value);

  if (!amount || Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount);
}

function buildVietQrImageUrl({ bankBin, accountNo, template, amount, addInfo, accountName }) {
  const baseUrl = `https://img.vietqr.io/image/${bankBin}-${accountNo}-${template}.png`;
  const params = new URLSearchParams();

  if (amount) {
    params.set("amount", String(amount));
  }

  if (addInfo) {
    params.set("addInfo", addInfo);
  }

  if (accountName) {
    params.set("accountName", accountName);
  }

  const query = params.toString();
  return query ? `${baseUrl}?${query}` : baseUrl;
}

// ================= BANK QR CREATE PAYMENT =================
exports.createBankQrPayment = async (req, res) => {
  try {
    const { order_id, amount, transferContent, orderDescription } = req.body;

    let order = null;

    if (order_id) {
      order = await Order.findOne({
        where: { id: order_id, deleted_at: null },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
    }

    const bankBin = process.env.BANK_QR_BIN || process.env.BANK_BIN;
    const accountNo = process.env.BANK_QR_ACCOUNT_NO || process.env.BANK_ACCOUNT_NO;
    const accountName = process.env.BANK_QR_ACCOUNT_NAME || process.env.BANK_ACCOUNT_NAME;
    const bankName = process.env.BANK_QR_BANK_NAME || process.env.BANK_NAME || "Ngân hàng";
    const template = process.env.BANK_QR_TEMPLATE || "compact2";

    if (!bankBin || !accountNo || !accountName) {
      return res.status(500).json({
        message:
          "Thiếu cấu hình QR ngân hàng. Cần BANK_QR_BIN, BANK_QR_ACCOUNT_NO, BANK_QR_ACCOUNT_NAME.",
      });
    }

    const normalizedAmount = normalizeAmount(order ? order.total_amount : amount);

    if (!normalizedAmount) {
      return res.status(400).json({ message: "amount phải lớn hơn 0 để tạo QR thanh toán." });
    }

    const orderCode = order?.order_code || `POS-${Date.now()}`;
    const contentRaw =
      transferContent ||
      orderDescription ||
      process.env.BANK_QR_DEFAULT_CONTENT ||
      `Thanh toan don ${orderCode}`;
    const content = String(contentRaw).slice(0, 120);

    const qrUrl = buildVietQrImageUrl({
      bankBin,
      accountNo,
      template,
      amount: normalizedAmount,
      addInfo: content,
      accountName,
    });

    if (order) {
      await order.update({
        payment_method: "bank_transfer",
      });
    }

    return res.status(200).json({
      order_id: order?.id || null,
      order_code: orderCode,
      amount: normalizedAmount,
      bank_name: bankName,
      bank_bin: bankBin,
      account_no: accountNo,
      account_name: accountName,
      transfer_content: content,
      qr_url: qrUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.confirmBankQrPayment = async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);

    if (!orderId || Number.isNaN(orderId)) {
      return res.status(400).json({ message: "orderId không hợp lệ" });
    }

    const order = await Order.findOne({
      where: { id: orderId, deleted_at: null },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({
      status: "completed",
      payment_method: "bank_transfer",
    });

    return res.status(200).json({
      message: "Xác nhận thanh toán QR thành công.",
      order_id: order.id,
      order_code: order.order_code,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
