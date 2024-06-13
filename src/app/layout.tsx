import '@/styles/globals.css'

import { GeistSans } from 'geist/font/sans'

import { AnimatedLayout } from '@/components/animated-layout'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/react'
import { NavBar } from './_components/nav-bar'

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
    <html
      lang="en"
      className="bg-slate-400 dark:bg-slate-900"
      suppressHydrationWarning
    >
      <body
        className={cn(
          'bg-background flex min-h-screen flex-col overflow-auto bg-gradient-to-b from-slate-300 to-slate-400 font-sans text-slate-900 antialiased dark:from-slate-950 dark:to-slate-900 dark:text-slate-300',
          GeistSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-10 p-2">
            <NavBar />
          </header>
          <main className="flex-grow p-2">
            <AnimatedLayout>
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </AnimatedLayout>
          </main>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
