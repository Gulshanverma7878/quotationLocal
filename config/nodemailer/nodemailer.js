const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "gamerronak9@gmail.com",
    pass: "dhjq cche edjn fcto",
  },
});




// Function to send an email

async function sendEmail(email, subject, text) {
  try {
    let info = await transporter.sendMail({
      from: "gamerronak9@gmail.com",
      to: email,
      subject: subject,
      text: text
    });
    console.log('Message sent: %s', info.messageId);
    
    return info.messageId;
  } catch (error) {
    console.error('Error occurred while sending email:', error.message);
    throw error;
  }
}

module.exports = { sendEmail };
