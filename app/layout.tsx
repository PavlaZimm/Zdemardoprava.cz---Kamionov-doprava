

import "./globals.css"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import siteMetadata from './metadata.json'
import { StructuredData } from '@/components/structured-data'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  ...siteMetadata['/'],
  metadataBase: new URL('https://zdemardoprava.cz'),
  authors: [{ name: 'Zdemardoprava.cz' }],
  creator: 'Zdemardoprava.cz',
  publisher: 'Zdemardoprava.cz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'google-site-verification-code-here',
  },
  category: 'transportation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
        <head>
          <StructuredData />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
    </html>
  )
}