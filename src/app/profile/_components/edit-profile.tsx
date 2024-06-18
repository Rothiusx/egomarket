'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { profileSchema } from '@/schemas/profile'
import { api } from '@/trpc/react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type z } from 'zod'

export function EditProfile({ user }: { user: Session['user'] }) {
  const router = useRouter()

  const editProfile = api.profile.edit.useMutation({
    onSuccess: () => {
      router.refresh()
      toast.success('Profile saved!')
    },
    onError: (error) => {
      toast.error(error.message)
      form.setError('email', {
        message: error.message,
      })
    },
  })

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? '',
      email: user.email ?? '',
    },
  })

  function onSubmit({ name, email }: z.infer<typeof profileSchema>) {
    if (name === user.name && email === user.email) {
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
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormDescription>Your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="min-w-32"
          type="submit"
          disabled={editProfile.isPending}
        >
          {editProfile.isPending ? (
            <ArrowPathIcon className="size-4 animate-spin" />
          ) : (
            'Save Profile'
          )}
        </Button>
      </form>
    </Form>
  )
}
