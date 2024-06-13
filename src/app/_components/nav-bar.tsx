import { HomeIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

export async function NavBar() {
  return (
    <nav className="h-16 w-screen border-b border-slate-600 bg-slate-800">
      <ul className="mx-8 flex h-full items-center gap-8 [&_li]:flex">
        <li>
          <Link
            href="/"
            className="flex items-center gap-4 text-3xl text-purple-400"
          >
            <HomeIcon className="size-6" />
            Home
          </Link>
        </li>
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
