import { convert } from 'html-to-text';
import nodemailer from 'nodemailer';
import pug from 'pug';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const templatesDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../views/emails',
);

export function validateEmailConfiguration() {
  const missing = ['SENDGRID_PASSWORD', 'EMAIL_FROM', 'CLIENT_URL'].filter(
    (key) => !process.env[key],
  );

  if (missing.length) {
    throw new Error(
      `Missing production email configuration: ${missing.join(', ')}`,
    );
  }

  let clientUrl;
  try {
    clientUrl = new URL(process.env.CLIENT_URL);
  } catch {
    throw new Error('CLIENT_URL must be a valid absolute URL');
  }

  if (clientUrl.protocol !== 'https:') {
    throw new Error('CLIENT_URL must use HTTPS in production');
  }
}

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.fullName = user.fullName;
    this.url = url;
    this.from = process.env.EMAIL_FROM
      ? `Mood Tracker <${process.env.EMAIL_FROM}>`
      : undefined;
  }

  createTransport() {
    const { SENDGRID_PASSWORD } = process.env;

    if (!this.from || !SENDGRID_PASSWORD) {
      throw new Error('Email transport configuration is incomplete');
    }

    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'apikey',
        pass: SENDGRID_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      resolve(templatesDirectory, `${template}.pug`),
      {
        fullName: this.fullName,
        url: this.url,
        subject,
      },
    );

    await this.createTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    });
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Mood Tracker');
  }

  async sendPasswordReset() {
    await this.send('reset-password', 'Reset your Mood Tracker password');
  }

  async sendPasswordChanged() {
    await this.send(
      'password-changed',
      'Your Mood Tracker password has been reset',
    );
  }
}
