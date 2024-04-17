import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (
  recipient: string,
  emailSubject: string,
  html: string,
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.env === 'production',
    auth: {
      user: config.user_email,
      pass: config.user_pass,
    },
  });

  await transporter.sendMail({
    from: config.user_email,
    to: recipient,
    subject: emailSubject,
    html,
  });
};
