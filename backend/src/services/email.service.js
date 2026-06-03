const dns = require("dns");
const net = require("net");
const nodemailer = require("nodemailer");

let transporter;

dns.setDefaultResultOrder("ipv4first");

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return String(value).toLowerCase() === "true";
}

async function resolveSmtpHost(host) {
  if (net.isIP(host)) {
    return {
      connectionHost: host,
      tlsServername: undefined,
    };
  }

  const { address } = await dns.promises.lookup(host, { family: 4 });

  return {
    connectionHost: address,
    tlsServername: host,
  };
}

async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = String(process.env.SMTP_PASS || "").replace(/\s/g, "");

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.");
  }

  const { connectionHost, tlsServername } = await resolveSmtpHost(host);
  const tls = tlsServername ? { servername: tlsServername } : undefined;

  transporter = nodemailer.createTransport({
    host: connectionHost,
    port,
    secure: parseBoolean(process.env.SMTP_SECURE, port === 465),
    requireTLS: parseBoolean(process.env.SMTP_REQUIRE_TLS, port === 587),
    family: 4,
    tls,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "Kiot";

  const activeTransporter = await getTransporter();

  await activeTransporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });
}

module.exports = {
  sendMail,
};
