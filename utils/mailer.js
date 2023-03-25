/* eslint-disable object-curly-newline */
const nodemailer = require('nodemailer');
const { NODEMAILER_SENDER_EMAIL, NODEMAILER_SENDER_NAME, NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: false,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async ({ to, subject, text, bcc, cc }) => {
  try {
    const res = await transporter.sendMail({
      to,
      cc,
      bcc,
      from: `${NODEMAILER_SENDER_NAME}<${NODEMAILER_SENDER_EMAIL}>`,
      subject,
      text,
    });
    return res;
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = { sendEmail };
