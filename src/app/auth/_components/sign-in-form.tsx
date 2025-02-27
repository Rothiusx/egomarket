'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { IconHoverButton } from '@/components/ui/icon-hover-button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import {
  StatusMessage,
  type StatusMessageProps,
} from '@/components/ui/status-message'
import { signInSchema } from '@/schemas/auth'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type z } from 'zod'

export function SignInForm() {
  const router = useRouter()
  const [message, setMessage] = useState<StatusMessageProps>(undefined!)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    setMessage(undefined!)
  }, [form.formState.isDirty])

  async function onSubmit({ email, password }: z.infer<typeof signInSchema>) {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    }).then((response) => {
      console.log(response)
      if (response?.error) {
        console.error(response)
        setMessage({
          variant: 'error',
          message: response?.error,
        })
      } else if (response?.ok) {
        router.refresh()
        toast.success('User signed in!')
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StatusMessage {...message} />
        <IconHoverButton
          className="mt-8 min-w-32"
          icon={<ArrowRightEndOnRectangleIcon className="size-6" />}
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Sign In
        </IconHoverButton>
      </form>
    </Form>
  )
}
