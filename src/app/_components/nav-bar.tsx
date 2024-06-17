import { HomeIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { NavLinks } from './nav-links'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

const navLinks = [
  { href: '/gold', label: 'Need Gold? 💰' },
  { href: '/history', label: 'Loot History' },
]

export async function NavBar() {
  return (
    <nav className="h-14 rounded-lg bg-slate-800 shadow-md shadow-slate-800">
      <ul className="mx-8 flex h-full items-center gap-8 [&_li]:flex">
        <li>
          <Link
            href="/"
            className="flex items-center gap-4 text-3xl text-slate-300"
          >
            <HomeIcon className="size-8" />
          </Link>
        </li>
        <NavLinks links={navLinks} />
        <li className="ml-auto">
          <ThemeToggle />
        </li>
        <li>
          <UserMenu />
        </li>
      </ul>
    </nav>
  )
}
