import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ImmoWächter - Nie wieder Wartungen vergessen',
  description: '648 CO-Vergiftungen/Jahr durch vergessene Wartungen. ImmoWächter erinnert Sie rechtzeitig an Thermenservice, Rauchfangkehrer & Co. Jetzt auf Warteliste!',
  keywords: 'Wartungserinnerung, Immobilienwartung, Gasthermenwartung, OIB-Richtlinien, Förderungen Österreich',
  openGraph: {
    title: 'ImmoWächter - Ihr Wartungsassistent',
    description: 'Automatische Wartungserinnerungen + €24.000 Förderungen finden',
    type: 'website',
    locale: 'de_AT',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}