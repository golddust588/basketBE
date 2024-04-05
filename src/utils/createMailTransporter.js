import nodemailer from "nodemailer";

const createMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "outlook_C913BF087AD6E946@outlook.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

export default createMailTransporter;
