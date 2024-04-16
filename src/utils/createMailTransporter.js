import nodemailer from "nodemailer";

const createMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 587,
    service: "Yahoo",
    secure: false,
    auth: {
      user: "durubum@yahoo.com",
      pass: process.env.EMAIL_PASS,
    },
    debug: false,
    logger: true,
  });

  return transporter;
};

export default createMailTransporter;
