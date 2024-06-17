import { ScrollArea } from '@/components/ui/scroll-area'
import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function Page() {
  const session = await getServerAuthSession()
  const recentHistory = await api.history.getRecentHistory()

  return (
    <section className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
      {session && (
        <Link
          href="/history/upload"
          className="text-xl underline transition-colors"
        >
          Upload GDKP history
        </Link>
      )}
      <div className="flex flex-col gap-8 2xl:flex-row">
        {recentHistory.map((auction) => (
          <div
            key={auction.id}
            className="flex flex-col gap-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-8 text-slate-200 shadow-2xl dark:from-slate-900/50 dark:to-slate-950/50"
          >
            <h2 className="text-center text-3xl font-semibold">
              {auction.title}
            </h2>
            <div className="flex items-center justify-around">
              <span className="text-slate-400">
                {auction.createdAt.toLocaleDateString('en-us')}
              </span>
              {auction.report && (
                <Link
                  href={auction.report}
                  target="_blank"
                  className="underline"
                >
                  WCL Report
                </Link>
              )}
              <span className="text-xl font-semibold text-yellow-400">
                {auction.totalPot}
              </span>
            </div>
            <ScrollArea className="px-4">
              <ul className="flex h-[800px] max-h-[60vh] flex-col gap-4">
                {auction.items.map(
                  (item, index) =>
                    item && (
                      <li key={index}>
                        <Link
                          href={`https://www.wowhead.com/cata/item=${item.id}`}
                          target="_blank"
                        >
                          <div className="flex items-center gap-4 rounded-lg bg-slate-800 p-2 pr-4 text-xl font-medium shadow-lg transition-colors hover:bg-slate-800/50 2xl:text-sm">
                            <Image
                              width="36"
                              height="36"
                              src={item.icon ?? ''}
                              alt="item"
                              className="rounded-md border border-slate-950"
                            />
                            <span className="text-purple-600">{item.name}</span>
                            <span className="ml-auto text-yellow-400">
                              {item.price}
                            </span>
                          </div>
                        </Link>
                      </li>
                    )
                )}
              </ul>
            </ScrollArea>
          </div>
        ))}
      </div>
    </section>
  )
}
