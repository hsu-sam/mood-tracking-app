import { convert } from 'html-to-text';
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
    this.fromEmail = process.env.EMAIL_FROM;
  }

  // Sends through SendGrid's HTTPS API (port 443) instead of SMTP (port 587):
  // Render's free tier blocks outbound SMTP, which made sending hang and fail.
  async send(template, subject) {
    const { SENDGRID_PASSWORD } = process.env;

    if (!this.fromEmail || !SENDGRID_PASSWORD) {
      throw new Error('Email transport configuration is incomplete');
    }

    const html = pug.renderFile(
      resolve(templatesDirectory, `${template}.pug`),
      {
        fullName: this.fullName,
        url: this.url,
        subject,
      },
    );

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_PASSWORD}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: this.to }] }],
        from: { email: this.fromEmail, name: 'Mood Tracker' },
        subject,
        content: [
          { type: 'text/plain', value: convert(html) },
          { type: 'text/html', value: html },
        ],
      }),
      // Fail fast instead of leaving the request hanging.
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(
        `SendGrid responded ${response.status}: ${await response.text()}`,
      );
    }
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
