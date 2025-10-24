'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ["latin"] });

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://www.immowaechter.at';

// Metadata removed - Client Components cannot export metadata
// export const metadata: Metadata = {
//   title: "ImmoWächter - Nie wieder Wartungen vergessen | Österreich & Deutschland",
//   description: "648 Wartungen werden jährlich in Österreich vergessen – gehört Ihre dazu? ImmoWächter erinnert Sie rechtzeitig an gesetzlich vorgeschriebene Wartungen, zeigt Energie-Einsparpotenziale und findet verfügbare Förderungen.",
//   keywords: [
//     "Wartungserinnerung",
//     "Immobilienverwaltung",
//     "Gasthermen-Service",
//     "Rauchfangkehrer",
//     "Förderungen Österreich",
//     "Heizungswartung",
//     "CO-Vergiftung Prävention",
//     "OIB-Richtlinien",
//     "Energieberatung",
//     "Sanierungsförderung"
//   ],
//   authors: [{ name: "ImmoWächter Team" }],
//   creator: "ImmoWächter",
//   publisher: "ImmoWächter",
  
//   alternates: {
//     canonical: DOMAIN,
//     languages: {
//       'de-AT': 'https://www.immowaechter.at',
//       'de-DE': 'https://www.immowaechter.de',
//     },
//   },
//   
//   openGraph: {
//     type: 'website',
//     locale: 'de_AT',
//     url: DOMAIN,
//     title: 'ImmoWächter - Nie wieder Wartungen vergessen',
//     description: '648 Wartungen werden jährlich in Österreich vergessen. ImmoWächter erinnert Sie rechtzeitig an alle wichtigen Termine.',
//     siteName: 'ImmoWächter',
//     images: [
//       {
//         url: `${DOMAIN}/og-image.png`,
//         width: 1200,
//         height: 630,
//         alt: 'ImmoWächter - Digitaler Wartungsassistent',
//       }
//     ],
//   },
//   
//   twitter: {
//     card: 'summary_large_image',
//     title: 'ImmoWächter - Nie wieder Wartungen vergessen',
//     description: '648 Wartungen werden jährlich vergessen in Österreich. Jetzt auf Warteliste!',
//     images: [`${DOMAIN}/og-image.png`],
//     creator: '@immowaechter',
//   },
//   
//   // 👇 NEU: Favicon Configuration
//   icons: {
//     icon: [
//       { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
//       { url: '/favicon.svg', type: 'image/svg+xml' },
//       { url: '/favicon.ico' },
//     ],
//     apple: [
//       { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
//     ],
//   },
//   
//   manifest: '/site.webmanifest',
//   
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-AT">
      <head>
        {/* Additional SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#DC2626" />
        
        {/* Preconnect für Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log to error tracking service in production
            if (process.env.NODE_ENV === 'production') {
              console.error('Root Error Boundary caught error:', error, errorInfo);
              // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
            }
          }}
        >
          {children}
          <Footer />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}