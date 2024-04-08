import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.env === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'mezbaul@programming-hero.com',
      pass: 'xfqj dshz wdui ymtb',
    },
  });

  await transporter.sendMail({
    from: 'mezbaul@programming-hero.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within ten mins!', // Subject line
    text: '', // plain text body
    html, // html body
  });
};

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function sendMail(recipient: string) {
  const transport = nodemailer.createTransport({
    service: 'gmail',

    host: 'smtp.gmail.com',
    port: 465,

    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: `${process.env.USER_EMAIL}`,
    to: `${recipient}`,
    subject: `Message from  (${process.env.USER_EMAIL})`,
    html: `
<html>
<head><title></title></head>
<body>
<h1>Welcome to Autox</h1>
</body>

</html>
    
    `,
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
    return 'Email sent Successfully';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error?.message;
  }
}
