const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //   var transport = nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });

  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "18be1ed3be8059",
      pass: "6d471ea66f021d",
    },
  });

  const mailOptions = {
    from: "Fikirat Javadov (fikret@mail.ru)",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
