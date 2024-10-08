// sendEmail.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config(); 

const sendEmail = async ( recipientEmail: string,
  subject: string,
  message: string
): Promise<string> => { 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail, 
    subject: subject, 
    text: message,   
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return `Email sent successfully to ${recipientEmail}`; 
  } catch (error) {
    console.error('Error sending email:', error);
    return 'Failed to send email';
  }
};

export default sendEmail;
