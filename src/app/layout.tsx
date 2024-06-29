import '@/styles/globals.css'

import { GeistSans } from 'geist/font/sans'

import { AuthSessionProvider } from '@/auth/react'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { getServerAuthSession } from '@/server/auth'
import { TRPCReactProvider } from '@/trpc/react'
import { NavBar } from './_components/nav-bar'

export const metadata = {
  title: 'EgoMarket GDKP',
  description: 'We are GDKP community based on Golemagg EU server!',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  return (
    <html
      lang="en"
      className="bg-slate-400 dark:bg-slate-900"
      suppressHydrationWarning
    >
      <body
        className={cn(
          'flex min-h-screen flex-col bg-gradient-to-b from-slate-300 to-slate-400 font-sans text-slate-900 antialiased dark:from-slate-950 dark:to-slate-900 dark:text-slate-300',
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
          <main className="flex flex-grow flex-col p-2">
            <AuthSessionProvider session={session}>
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </AuthSessionProvider>
          </main>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
