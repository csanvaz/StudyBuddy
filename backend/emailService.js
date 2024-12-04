const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,                         
    subject,                   
    html,                       
  };
  try {
    const response = await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function sendWelcomeEmail(username, email) {
  const welcomeEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Study Buddy</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
            }
            .content {
                padding: 20px;
            }
            .content h1 {
                color: #333333;
            }
            .content p {
                color: #666666;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background-color: #f4f4f4;
                color: #666666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h1>Welcome to Study Buddy!</h1>
                <p>Dear ${username},</p>
                <p>We are thrilled to have you join our community of learners. Study Buddy is your go-to platform for enhancing your knowledge through interactive quizzes and flashcards.</p>
                <p>Here are some features you can explore:</p>
                <ul>
                    <li>Create and manage your own study materials.</li>
                    <li>Access a variety of quizzes and flashcards to test your knowledge.</li>
                    <li>Track your progress and stay motivated with our streak and XP system.</li>
                </ul>
                <p>We hope you have a great learning experience with Study Buddy. If you have any questions or need assistance, feel free to reach out to our support team.</p>
                <p>Happy Studying!</p>
                <p>The Study Buddy Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Study Buddy. All rights reserved(not really hehe).</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return sendEmail(email, 'Welcome to Study Buddy', welcomeEmailHtml);
}

module.exports = {
  sendEmail,
  sendWelcomeEmail
};