import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import { HistoryUploadForm } from './_components/history-upload-form'

export default async function Gold() {
  const session = await getServerAuthSession()

  if (session?.user.roles !== 'ADMIN') {
    redirect('/history')
  }

  return (
    <section className="container flex flex-col items-center justify-center gap-8 px-4 py-8">
      <HistoryUploadForm />
    </section>
  )
}
