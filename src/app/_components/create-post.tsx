'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { IconHoverButton } from '@/components/ui/icon-hover-button'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const postSchema = z.object({
  name: z.string().min(1, { message: "Post can't be empty!" }),
})

export function CreatePost() {
  const router = useRouter()

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      form.reset()
      router.refresh()
      toast.success('Post created!')
    },
  })

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit({ name }: z.infer<typeof postSchema>) {
    createPost.mutate({
      name,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <IconHoverButton
          icon={<CheckIcon className="size-4" />}
          type="submit"
          className="!mt-2 w-full bg-slate-800 px-10 py-3 font-semibold transition-colors hover:bg-slate-800/50"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            'Submit Post'
          )}
        </IconHoverButton>
      </form>
    </Form>
  )
}
