import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import ThemeProvider from '@/providers/ThemeProvider'
import localFont from 'next/font/local'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import ReduxProvider from '@/providers/ReduxProvider'

import '../styles/globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans'
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: {
    template: '%s | Next15 Starter',
    default: 'Next15 Starter'
  },
  description: 'Next15 Starter'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <ReduxProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ReduxProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
