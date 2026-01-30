import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prep4Pesach',
  description: 'Pesach cleaning, bookings, availability, and payroll for Ramat Beit Shemesh',
  metadataBase: new URL('https://prep4pesach.com'),
  icons: {
    icon: '/P4PFavicon.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
