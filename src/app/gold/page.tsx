import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function Gold() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/')
  }

  return <section className="flex flex-col items-center">/gold</section>
}