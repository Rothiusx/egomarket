import { CreatePost } from '@/app/_components/create-post'
import { IconHoverButton } from '@/components/ui/icon-hover-button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { NavBar } from './_components/nav-bar'
import { ShowSecret } from './_components/show-secret'

export default async function Home() {
  const hello = await api.post.hello({ text: 'from tRPC' })
  const session = await getServerAuthSession()

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="flex flex-1 flex-col overflow-auto bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <ScrollArea>
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            {session && (
              <span className="text-3xl text-purple-200">
                Welcome, {session.user.name}!
              </span>
            )}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              EgoMarket <span className="text-[hsl(280,100%,70%)]">GDKP</span>
            </h1>
            <IconHoverButton
              className="w-fit px-8 text-xl"
              icon={<ArrowRightIcon className="size-4" />}
            >
              Need Gold? 💰
            </IconHoverButton>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                href="https://create.t3.gg/en/usage/first-steps"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">First Steps →</h3>
                <div className="text-lg">
                  Just the basics - Everything you need to know to set up your
                  database and authentication.
                </div>
              </Link>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                href="https://create.t3.gg/en/introduction"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">Documentation →</h3>
                <div className="text-lg">
                  Learn more about Create T3 App, the libraries it uses, and how
                  to deploy it.
                </div>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl text-white">
                {hello ? hello.greeting : 'Loading tRPC query...'}
              </p>
              <ShowSecret />
            </div>
            <CrudShowcase />
          </div>
        </ScrollArea>
      </main>
    </>
  )
}

async function CrudShowcase() {
  const session = await getServerAuthSession()
  if (!session?.user) return null

  const latestPost = await api.post.getLatest()
  const allPosts = await api.post.getAll()

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />

      {allPosts.length > 1 ? (
        <ul className="n flex w-full flex-col gap-2">
          {allPosts.map((post) => (
            <li className="rounded-lg bg-purple-400 p-2" key={post.id}>
              {post.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no other posts yet.</p>
      )}
    </div>
  )
}
