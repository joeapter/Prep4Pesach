import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM;

if (!host || !user || !pass || !from) {
  throw new Error('Missing SMTP_HOST/SMTP_USER/SMTP_PASS/SMTP_FROM environment variables for the mailer.');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass
  }
});

export type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
};

export async function sendEmail(options: MailOptions) {
  await transporter.sendMail({
    from,
    ...options
  });
}
