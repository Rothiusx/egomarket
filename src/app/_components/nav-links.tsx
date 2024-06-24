'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinksProps {
  links: {
    href: string
    label: string
    icon?: React.ReactNode
  }[]
}

export function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <>
      {links.map(({ href, label, icon }) => (
        <li key={href}>
          <Link
            href={href}
            prefetch={true}
            className={`flex items-center gap-2 rounded-lg px-4 py-1 text-2xl transition-colors hover:bg-slate-700/50 ${
              pathname === href
                ? 'bg-slate-700/50 text-slate-100'
                : 'text-slate-400'
            }`}
          >
            {icon && icon}
            <span className="tracking-tight">{label}</span>
          </Link>
        </li>
      ))}
    </>
  )
}
