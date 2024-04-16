import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import config from '../config';

export const sendEmail = async (
  recipient: string,
  emailSubject: string,
  html: string,
) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.env === 'production',
    auth: {
      user: config.user_email,
      pass: config.user_pass,
    },
  });

  const mailOptions: Mail.Options = {
    from: config.user_email,
    to: recipient,
    subject: emailSubject,
    html,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (error) {
        if (!error) {
          resolve('Email sent');
        } else {
          reject(error.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return 'Email sent successfully.';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error?.message;
  }
};
