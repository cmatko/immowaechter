import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ImmoWaechter - Nie wieder Wartungen vergessen',
  description: 'Digitale Wartungserinnerung fuer Immobilien in Oesterreich',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
