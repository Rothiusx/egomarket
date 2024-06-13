'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type RouterOutputs } from '@/trpc/react'
import { AnimatePresence, motion } from 'framer-motion'

interface PostProps {
  posts: RouterOutputs['post']['getAll']
}

export function Posts({ posts }: PostProps) {
  return (
    <ul className="n flex w-full flex-col gap-2">
      <AnimatePresence initial={false}>
        {posts.map((post) => (
          <motion.li
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex rounded-lg bg-slate-600 px-4 py-2 text-slate-200"
            key={post.id}
          >
            <span className="flex max-w-[50%]">{post.name}</span>
            <div className="ml-auto flex items-center gap-2">
              {post.user.name}
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.user.image ?? undefined} />
                <AvatarFallback>
                  {post.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
