const nodemailer = require('nodemailer');

async function sendExcelEmail(buffer, filename, toEmail = 'admin@sunseating.com') {
  // Generate a free Ethereal test account automatically
  // This acts as our "free server" for development.
  const testAccount = await nodemailer.createTestAccount();

  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"SunSeating System" <system@sunseating.com>',
    to: toEmail,
    subject: "Employee Attendance Report",
    text: "Attached is the latest Employee Attendance Report in Excel format.",
    attachments: [
      {
        filename: filename,
        content: buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    ]
  });

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log("Preview URL: %s", previewUrl);
  return previewUrl;
}

module.exports = {
  sendExcelEmail
};
