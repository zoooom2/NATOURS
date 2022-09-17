const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Adeyinka Roqeeb <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // send(template, subject) {
  //   const mailOptions = {
  //     from: 'Adeyinka Roqeeb <roqeebadeyinka@gmail.com>',
  //     to: options.email,
  //     subject: options.subject,
  //     text: options.message,
  //     // html:
  //   };
  }

  sendWelcome() {
    this.send('welcome', 'welcome to the natours family');
  }
};

const sendEmail = async (options) => {
  //create a transporter
  // define email options

  //actually send the email
  await transporter.sendMail(mailOptions);
};
