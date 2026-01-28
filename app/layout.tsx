import '@/app/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prep4Pesach',
  description: 'Pesach cleaning, booking, payroll, and invoices for Ramat Beit Shemesh'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
