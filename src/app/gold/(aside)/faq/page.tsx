import { sleep } from '@/lib/utils'

export default async function Page() {
  await sleep(2000)

  return <div>faq</div>
}
