const nodemailer = require("nodemailer");
const pug = require("pug");

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
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    };

    return nodemailer.createTransport(transpoerterOpt);
  }

  async send(template, subject) {
    // create html from pug
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      subject,
      firstName: this.firstName,
      url: this.url,
    });

    await this.createTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      text: this.url,
      html,
    });
  }

  async sendWelcome() {
    await this.send("welcome", `Welcome ${this.firstName}`);
  }

  async sendResetPasswordLInk() {
    await this.send(
      "reset",
      `Your Password Reset Link(Valid for ${process.env.RESET_EXPIRY} minutes).`
    );
  }

  async sendEmailVerification() {
    await this.send(
      "welcome",
      `Your Email verification LInk(Valid for ${process.env.EMAIL_VERIFICATION} minutes).`
    );
  }
}

module.exports = Email;
