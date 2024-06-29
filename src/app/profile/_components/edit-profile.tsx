'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { IconHoverButton } from '@/components/ui/icon-hover-button'
import { Input } from '@/components/ui/input'
import {
  StatusMessage,
  type StatusMessageProps,
} from '@/components/ui/status-message'
import { profileSchema } from '@/schemas/profile'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, SaveAll } from 'lucide-react'
import { type Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type z } from 'zod'

export function EditProfile({ session }: { session: Session }) {
  const router = useRouter()
  const { update } = useSession()
  const [message, setMessage] = useState<StatusMessageProps>(undefined!)

  const editProfile = api.profile.edit.useMutation({
    onSuccess: async () => {
      const { name, email } = form.getValues()
      form.reset({ name, email })
      await update()
      router.refresh()
      toast.success('Changes saved!')
      setMessage({
        variant: 'success',
        message: 'Changes saved!',
      })
    },
    onError: (error) => {
      toast.error(error.message)
      setMessage({
        variant: 'error',
        message: error.message,
      })
    },
  })

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session.user.name ?? undefined,
      email: session.user.email ?? undefined,
    },
  })

  useEffect(() => {
    setMessage(undefined!)
  }, [form.formState.isDirty])

  function onSubmit({ name, email }: z.infer<typeof profileSchema>) {
    if (name === session.user.name && email === session.user.email) {
      toast.error('No changes detected!')
    } else {
      try {
        editProfile.mutate({
          name,
          email,
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="bg-slate-200/50 dark:bg-slate-900/50"
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your name as it will appear on the website
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="bg-slate-200/50 dark:bg-slate-900/50"
                  placeholder="john.doe@example.com"
                  disabled={!!session.user.email && session.user.oauth}
                  {...field}
                />
              </FormControl>
              <FormDescription>Your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <StatusMessage {...message} />
        <IconHoverButton
          className="min-w-32 float-right"
          icon={<SaveAll className="size-4" />}
          type="submit"
          disabled={editProfile.isPending || !form.formState.isDirty}
        >
          {editProfile.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            'Save Profile'
          )}
        </IconHoverButton>
      </form>
    </Form>
  )
}
