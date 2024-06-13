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
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export async function UserMenu() {
  const session = await getServerAuthSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="icon"
          size="icon"
          className="rounded-full text-purple-300 hover:bg-purple-600"
        >
          <UserCircleIcon className="size-8" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session && (
          <span className="flex flex-col items-center gap-2 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session.user?.image ?? undefined} />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-lg">{session.user?.name}</span>
          </span>
        )}
        <DropdownMenuItem asChild>
          <Link
            className="flex items-center gap-2 px-2 text-lg"
            href={session ? '/api/auth/signout' : '/api/auth/signin'}
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
