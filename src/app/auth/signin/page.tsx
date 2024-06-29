import { SignInOptions } from '@/app/auth/_components/sign-in-options'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerAuthSession()

  if (session) {
    redirect('/')
  }

  return (
    <section className="container flex flex-col items-center">
      <SignInOptions />
    </section>
  )
}
