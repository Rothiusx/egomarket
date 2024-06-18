import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/')
  }

  return (
    <section className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
      <Avatar className="size-48">
        <AvatarImage src={session.user.image ?? undefined} />
        <AvatarFallback>
          {session.user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-4xl font-medium">Welcome, {session.user.name}!</h1>
    </section>
  )
}
