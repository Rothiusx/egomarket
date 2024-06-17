import { getServerAuthSession } from '@/server/auth'
import { HomeIcon } from '@heroicons/react/24/solid'
import { FileClock } from 'lucide-react'
import Link from 'next/link'
import { NavLinks } from './nav-links'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

const navLinks = [
  { href: '/gold', label: 'Need Gold? 💰', protected: true },
  { href: '/history', label: 'Loot History', icon: <FileClock /> },
]

export async function NavBar() {
  const session = await getServerAuthSession()

  return (
    <nav className="h-14 rounded-lg bg-slate-800 shadow-md shadow-slate-800">
      <ul className="mx-8 flex h-full items-center gap-8 [&_li]:flex">
        <li>
          <Link
            href="/"
            className="flex items-center gap-4 text-3xl text-slate-300"
          >
            <HomeIcon className="size-8" />
            <h1 className="text-2xl font-semibold tracking-tight">
              EgoMarket <span className="text-[hsl(280,100%,70%)]">GDKP</span>
            </h1>
          </Link>
        </li>
        <NavLinks
          links={navLinks
            .filter((navLink) => (session ? true : !navLink.protected))
            .map(({ href, label, icon }) => ({
              href,
              label,
              icon,
            }))}
        />
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
