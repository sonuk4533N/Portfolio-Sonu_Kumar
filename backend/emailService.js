const nodemailer = require("nodemailer");

let transporter;

// Initialize email transporter
function initializeTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

// Send contact form email
async function sendContactEmail(name, email, phone, message) {
  try {
    if (process.env.EMAIL_ENABLED === 'false') {
      return { success: false, error: 'Email delivery is disabled' };
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECIPIENT_EMAIL) {
      return { success: false, error: 'Email delivery is not configured' };
    }
    const mailer = initializeTransporter();

    // Email to admin
    await mailer.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Received on: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    // Confirmation email to sender
    await mailer.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "We received your message",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Thank you for reaching out!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>We received your message and will get back to you within 24 hours.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
          </div>
          <p>Best regards,<br>Sonu Kumar</p>
        </div>
      `,
    });

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

module.exports = { sendContactEmail };
