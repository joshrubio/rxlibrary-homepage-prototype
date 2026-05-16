import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RX Library',
  description: 'Precision compounding for personalized care — prescriptions delivered to your door.',
  openGraph: {
    title: 'RX Library',
    description: 'Precision compounding for personalized care — prescriptions delivered to your door.',
    siteName: 'RX Library',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
