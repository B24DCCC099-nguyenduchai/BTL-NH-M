const nodemailer = require('nodemailer');
const { Notification, User } = require('../models');

function getEmailTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendEmail(to, subject, text, html = null) {
  const transport = getEmailTransport();
  if (!transport) {
    return null;
  }

  try {
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
    const result = await transport.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html: html || undefined,
    });
    return result;
  } catch (error) {
    console.error('Email notification failed:', error.message || error);
    return null;
  }
}

async function notifyUser(recipientId, type, targetId, message) {
  const notification = await Notification.create({
    recipientId,
    type,
    targetId,
    message,
  });

  const recipient = await User.findByPk(recipientId);
  if (recipient?.email) {
    await sendEmail(recipient.email, 'Thông báo Diễn đàn hỏi đáp', message);
  }

  return notification;
}

async function sendPasswordResetEmail(email, newPassword) {
  return sendEmail(
    email,
    'Mật khẩu được reset',
    `Mật khẩu tạm thời của bạn là: ${newPassword}. Vui lòng đăng nhập và đổi mật khẩu ngay.`,
    `
      <h2>Mật khẩu của bạn đã được reset</h2>
      <p>Mật khẩu tạm thời của bạn: <strong>${newPassword}</strong></p>
      <p>Vui lòng đăng nhập và đổi mật khẩu ngay lập tức.</p>
    `
  );
}

module.exports = {
  getEmailTransport,
  sendEmail,
  notifyUser,
  sendPasswordResetEmail,
};