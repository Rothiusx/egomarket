import '@/styles/globals.css'

import { GeistSans } from 'geist/font/sans'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/react'

export const metadata = {
  title: 'EgoMarket GDKP',
  description: 'We are GDKP community based on Golemagg EU server!',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'bg-background flex h-screen flex-col overflow-auto font-sans antialiased',
          GeistSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
