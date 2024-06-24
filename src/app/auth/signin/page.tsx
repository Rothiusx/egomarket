import { SignInForm } from '@/app/auth/_components/sign-in-options'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerAuthSession()

  if (session) {
    redirect('/')
  }

  return (
    <section className="container flex items-center flex-col">
      <div className="flex flex-col p-8 rounded-xl bg-slate-900 items-center min-w-[32rem] shadow-lg">
        <SignInForm />
      </div>
    </section>
  )
}
