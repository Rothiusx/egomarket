import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import { EditProfile } from './_components/edit-profile'

export default async function Page() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/')
  }

  return (
    <section className="container flex flex-col items-center justify-center gap-8 px-4 py-8">
      <Avatar className="size-48">
        <AvatarImage src={session.user.image ?? undefined} />
        <AvatarFallback className="text-6xl">
          {session.user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-4xl font-medium">Welcome, {session.user.name}!</h1>
      <Card className="w-1/3 min-w-fit">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Permissions</span>
            <Badge>{session.user.roles}</Badge>
          </div>
          <EditProfile session={session} />
        </CardContent>
      </Card>
    </section>
  )
}
