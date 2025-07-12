import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: 'PayNXT360 Info <hello@paynxt360.com>',
    to: email,
    subject: 'Your OTP for Authentication',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px; background-color: #054B7D; padding: 10px; border-radius: 8px;">
          <img src="cid:paynxtlogo" alt="PayNXT360 Logo" style="max-width: 150px; height: auto;" />
        </div>
        <h2 style="text-align: center; color: #333;">Verification Code</h2>
        <p style="font-size: 14px; color: #555;">Your OTP for authentication is:</p>
        <h1 style="font-size: 36px; letter-spacing: 5px; color: #4a90e2; margin: 20px 0; text-align: center;">${otp}</h1>
        <p style="font-size: 12px; color: #999; margin: 0; display: block;">
          Note: This code is valid for 1 hour.
        </p>
        <p style="font-size: 12px; color: #999; margin: 0; display: block;">
          If you did not request it, please disregard this message.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: 'PayNxt_Logo.png',
        path: path.resolve(process.cwd(), 'public/Images/PayNxt_Logo.png'),
        cid: 'paynxtlogo'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
