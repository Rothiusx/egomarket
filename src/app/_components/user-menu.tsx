import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getServerAuthSession } from '@/server/auth'
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/solid'
import Link from 'next/link'

export async function UserMenu() {
  const session = await getServerAuthSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="icon"
          size="icon"
          className="rounded-full text-slate-300 hover:bg-slate-600"
        >
          <Avatar className="size-8">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback className="bg-inherit">
              <UserCircleIcon />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <span className="flex flex-col items-center gap-2 p-4">
          <Avatar className="size-16">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback className="bg-inherit">
              <UserCircleIcon />
            </AvatarFallback>
          </Avatar>
          <span className="text-lg">{session?.user?.name}</span>
        </span>
        <DropdownMenuItem asChild disabled={!session}>
          <Link
            className="flex items-center gap-2 px-2 text-lg"
            href="/profile"
          >
            <UserIcon className="size-6" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="flex items-center gap-2 px-2 text-lg"
            href={session ? '/api/auth/signout' : '/auth/signin'}
          >
            {session ? (
              <>
                <ArrowLeftStartOnRectangleIcon className="size-6" />
                <span>Sign Out</span>
              </>
            ) : (
              <>
                <ArrowRightEndOnRectangleIcon className="size-6" />
                <span>Sign In</span>
              </>
            )}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
