'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinksProps {
  links: { href: string; label: string }[]
}

export function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <>
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={`flex items-center gap-4 rounded-lg px-4 py-1 text-2xl transition-colors hover:bg-slate-700/50 ${
              pathname === href
                ? 'bg-slate-700/50 text-slate-100'
                : 'text-slate-400'
            }`}
          >
            {label}
          </Link>
        </li>
      ))}
    </>
  )
}
