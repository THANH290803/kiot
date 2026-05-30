const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const db = require("../models");
const { sendMail } = require("./email.service");

const UserOtpCode = db.UserOtpCode;

const TWO_FACTOR_TYPES = {
  LOGIN: "login_2fa",
  ENABLE: "enable_2fa",
  DISABLE: "disable_2fa",
};

const OTP_EXPIRES_MINUTES = Number(process.env.TWO_FACTOR_OTP_EXPIRES_MINUTES || 10);
const OTP_EXPIRES_MS = OTP_EXPIRES_MINUTES * 60 * 1000;

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function maskEmail(value) {
  const email = String(value || "").trim();
  const [localPart, domain = ""] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  if (localPart.length <= 2) {
    return `${localPart.charAt(0)}***@${domain}`;
  }

  return `${localPart.slice(0, 2)}***${localPart.slice(-1)}@${domain}`;
}

function getTwoFactorJwtSecret() {
  return process.env.JWT_2FA_SECRET || process.env.JWT_SECRET;
}

function createLoginChallengeToken(user) {
  return jwt.sign(
    {
      id: user.id,
      purpose: TWO_FACTOR_TYPES.LOGIN,
      roleId: user.role_id,
    },
    getTwoFactorJwtSecret(),
    { expiresIn: `${OTP_EXPIRES_MINUTES}m` }
  );
}

function verifyLoginChallengeToken(token) {
  const payload = jwt.verify(token, getTwoFactorJwtSecret());

  if (payload?.purpose !== TWO_FACTOR_TYPES.LOGIN) {
    throw new Error("Invalid 2FA challenge token");
  }

  return payload;
}

async function createAndSendOtp({ user, type }) {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_MS);

  await UserOtpCode.destroy({
    where: {
      user_id: user.id,
      type,
      used_at: null,
    },
  });

  await UserOtpCode.create({
    user_id: user.id,
    type,
    code,
    expires_at: expiresAt,
  });

  const actionLabel =
    type === TWO_FACTOR_TYPES.LOGIN
      ? "xác thực đăng nhập"
      : type === TWO_FACTOR_TYPES.ENABLE
        ? "bật xác thực 2 lớp"
        : "tắt xác thực 2 lớp";

  await sendMail({
    to: user.email,
    subject: `Ma OTP ${actionLabel} - Kiot`,
    text: `Ma OTP cua ban la ${code}. Ma co hieu luc trong ${OTP_EXPIRES_MINUTES} phut.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6">
        <h2 style="margin-bottom: 12px;">Kiot - Xac thuc 2 lop</h2>
        <p>Ban vua yeu cau ${actionLabel}.</p>
        <p>Ma OTP cua ban la:</p>
        <div style="display: inline-block; padding: 12px 18px; border-radius: 10px; background: #eff6ff; color: #1d4ed8; font-size: 24px; font-weight: 700; letter-spacing: 4px;">
          ${code}
        </div>
        <p style="margin-top: 16px;">Ma co hieu luc trong ${OTP_EXPIRES_MINUTES} phut.</p>
        <p style="color: #6b7280; font-size: 13px;">Neu ban khong thuc hien thao tac nay, vui long doi mat khau ngay.</p>
      </div>
    `,
  });

  return {
    expires_at: expiresAt.toISOString(),
    masked_email: maskEmail(user.email),
  };
}

async function verifyOtp({ userId, type, code }) {
  const otpRecord = await UserOtpCode.findOne({
    where: {
      user_id: userId,
      type,
      code: String(code || "").trim(),
      used_at: null,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
    order: [["id", "DESC"]],
  });

  if (!otpRecord) {
    throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn.");
  }

  await otpRecord.update({
    used_at: new Date(),
  });

  return otpRecord;
}

module.exports = {
  TWO_FACTOR_TYPES,
  OTP_EXPIRES_MINUTES,
  maskEmail,
  createLoginChallengeToken,
  verifyLoginChallengeToken,
  createAndSendOtp,
  verifyOtp,
};
