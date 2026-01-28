import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

if (!apiKey || !fromEmail) {
  throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
}

const resend = new Resend(apiKey);

export async function sendInvoiceEmail(options: { to: string; subject: string; text: string; html?: string }) {
  const { to, subject, text, html } = options;

  await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    text,
    html
  });
}
