const { sendEmail } = require('./emailService');

// Example email details
const recipient = 'tryder292@gmail.com';
const subject = 'Hello from Nodemailer!';
const htmlContent = `
  <h1>Welcome!</h1>
  <p>This is an example email sent using <b>Nodemailer</b>.</p>
`;

// Wrap the await call inside an async function
async function main() {
  try {
    const response = await sendEmail(recipient, subject, htmlContent);
    console.log(response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Call the async function
main();