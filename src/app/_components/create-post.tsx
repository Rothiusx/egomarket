'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { IconHoverButton } from '@/components/ui/icon-hover-button'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'

export function CreatePost() {
  const router = useRouter()
  const [name, setName] = useState('')

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh()
      setName('')
      toast.success(`Post created!`)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        createPost.mutate({ name })
      }}
      className="flex flex-col gap-2"
    >
      <Input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <IconHoverButton
        icon={<CheckIcon className="size-4" />}
        type="submit"
        className="bg-slate-800 px-10 py-3 font-semibold transition-colors hover:bg-slate-800/50"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? (
          <ArrowPathIcon className="size-4 animate-spin" />
        ) : (
          'Submit Post'
        )}
      </IconHoverButton>
    </form>
  )
}
