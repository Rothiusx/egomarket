import { DiscordIcon } from '@/components/icons/discord'
import { FlipWords } from '@/components/ui/flip-words'
import { IconHoverButton } from '@/components/ui/icon-hover-button'
import { LinkPreview } from '@/components/ui/link-preview'
import { getServerAuthSession } from '@/server/auth'
import { api } from '@/trpc/server'
import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { CreatePost } from './_components/create-post'
import { Posts } from './_components/posts'
import { ShowSecret } from './_components/show-secret'

export default async function Home() {
  const hello = await api.post.hello({ text: 'from tRPC' })
  const session = await getServerAuthSession()

  return (
    <section className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
        EgoMarket <span className="text-[hsl(280,100%,70%)]">GDKP</span>
      </h1>
      <span className="my-4 h-12 text-xl font-semibold lg:text-3xl">
        <FlipWords
          className="w-[400px] text-center lg:w-[600px]"
          words={[
            'One of the most successful GDKP',
            'Multiple raids weekly',
            'One of the largest community',
            'Join us now!',
          ]}
          duration={5000}
        />
      </span>
      <Link href="https://discord.gg/gdkp" target="_blank">
        <IconHoverButton
          className="w-fit px-8 text-xl"
          icon={<ArrowRightIcon className="size-4" />}
        >
          <DiscordIcon />
          Discord
        </IconHoverButton>
      </Link>
      {session && (
        <Link href="/gold">
          <IconHoverButton
            className="w-fit px-8 text-xl"
            icon={<ArrowRightIcon className="size-4" />}
          >
            Need Gold? 💰
          </IconHoverButton>
        </Link>
      )}
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <LinkPreview
          url="https://create.t3.gg/en/usage/first-steps"
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
        >
          <h3 className="text-2xl font-bold">First Steps →</h3>
          <div className="text-lg">
            Just the basics - Everything you need to know to set up your
            database and authentication.
          </div>
        </LinkPreview>
        <LinkPreview
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
          url="https://create.t3.gg/en/introduction"
        >
          <h3 className="text-2xl font-bold">Documentation →</h3>
          <div className="text-lg">
            Learn more, the libraries it uses or how to deploy.
          </div>
        </LinkPreview>
      </div>
      <div className="flex flex-col items-center gap-2">
        {session ? (
          <span className="text-3xl">Welcome, {session.user.name}!</span>
        ) : (
          <Link href="/api/auth/signin">
            <IconHoverButton
              className="text-xl"
              icon={<ArrowRightEndOnRectangleIcon className="size-6" />}
            >
              Sign In
            </IconHoverButton>
          </Link>
        )}
        <p className="text-2xl">
          {hello ? hello.greeting : 'Loading tRPC query...'}
        </p>
        {session && <ShowSecret />}
      </div>
      <CrudShowcase />
    </section>
  )
}

async function CrudShowcase() {
  const session = await getServerAuthSession()
  if (!session) return null

  const latestPost = await api.post.getLatest()
  const allPosts = await api.post.getAll()

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      {latestPost ? (
        <p className="truncate">Most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <CreatePost />
      {allPosts.length > 0 ? (
        <Posts data={allPosts} />
      ) : (
        <p>You have no other posts yet.</p>
      )}
    </div>
  )
}
