'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const asideLinks = [
    { id: 'home', text: 'Home', href: '/gold' },
    { id: 'buy', text: 'Buy Gold', href: '/gold/buy' },
    { id: 'sell', text: 'Sell Gold', href: '/gold/sell' },
    { id: 'faq', text: 'FAQ', href: '/gold/faq' },
  ]

  return (
    <section className="flex flex-grow gap-8">
      <aside className="flex w-64 flex-col border-r-2 border-r-slate-400/75 p-4">
        <ul className="flex flex-col gap-2">
          {asideLinks.map(({ id, text, href }) => (
            <li
              key={id}
              className={cn(
                'slate-800/50 rounded-lg border border-slate-800/75 px-4 py-2 transition-colors hover:bg-slate-800/25',
                pathname.includes(href) && 'bg-slate-800/25'
              )}
            >
              <Link className="flex" href={href}>
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div>{children}</div>
    </section>
  )
}
