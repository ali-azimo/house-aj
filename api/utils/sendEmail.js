// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // ou outro (Outlook, SMTP do provedor)
    auth: {
      user: process.env.EMAIL_USER, // teu email
      pass: process.env.EMAIL_PASS, // senha/app password
    },
  });

  await transporter.sendMail({
    from: `"AJ project" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
