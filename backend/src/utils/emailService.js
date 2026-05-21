const nodemailer = require('nodemailer');

function createTransport() {
  // Use Gmail or SendGrid for production
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email service not configured. Email not sent:', { to, subject });
    return null;
  }

  try {
    const transporter = createTransport();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@forum.local',
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw error;
  }
}

async function sendPasswordResetEmail(email, newPassword) {
  return sendEmail({
    to: email,
    subject: 'Mật khẩu được reset',
    html: `
      <h2>Mật khẩu của bạn đã được reset</h2>
      <p>Mật khẩu tạm thời của bạn: <strong>${newPassword}</strong></p>
      <p>Vui lòng đăng nhập và đổi mật khẩu ngay lập tức.</p>
    `,
  });
}

async function sendNewCommentNotification(email, postTitle, commentAuthor) {
  return sendEmail({
    to: email,
    subject: `Bài viết của bạn có bình luận mới: ${postTitle}`,
    html: `
      <h2>Bài viết của bạn có phản hồi mới</h2>
      <p><strong>${commentAuthor}</strong> đã bình luận trên bài viết <strong>"${postTitle}"</strong></p>
      <p><a href="${process.env.APP_URL || 'http://localhost:3000'}/forum">Xem bài viết</a></p>
    `,
  });
}

async function sendReplyNotification(email, commentAuthor, replyAuthor) {
  return sendEmail({
    to: email,
    subject: 'Bình luận của bạn có trả lời mới',
    html: `
      <h2>Bình luận của bạn có phản hồi mới</h2>
      <p><strong>${replyAuthor}</strong> đã trả lời bình luận của bạn.</p>
    `,
  });
}

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendNewCommentNotification,
  sendReplyNotification,
};
