const nodemailer = require("nodemailer");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  createTransport() {
    if (process.env.NODE_ENV === "production") {
      const transpoerterOpt = {
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_KEY,
        },
      };

      return nodemailer.createTransport(transpoerterOpt);
    }

    const transpoerterOpt = {
      host: process.env.MAILTRAP_HOST,
      port: +process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    };

    return nodemailer.createTransport(transpoerterOpt);
  }

  async send(subject) {
    try {
      await this.createTransport().sendMail({
        from: this.from,
        to: this.to,
        subject,
        text: this.url,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async sendWelcome() {
    await this.send(`Welcome ${this.firstName}`);
  }

  async sendResetPasswordLInk() {
    await this.send(
      `Your Password Reset Link(Valid for ${process.env.RESET_EXPIRY} minutes).`
    );
  }
}

module.exports = Email;
