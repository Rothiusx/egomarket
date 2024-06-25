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
import { signUpSchema } from '@/schemas/auth'
import { api } from '@/trpc/react'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type z } from 'zod'

export function SignUpForm() {
  const router = useRouter()

  const signUp = api.auth.signUp.useMutation({
    onSuccess: () => {
      toast.success('Account created!')
    },
    onSettled: async () => {
      await signIn('credentials', {
        email: form.getValues().email,
        password: form.getValues().password,
        redirect: false,
      }).then((response) => {
        if (response?.ok) {
          router.refresh()
        } else {
          console.error(response)
        }
      })
    },
  })

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit({
    email,
    password,
    confirmPassword,
  }: z.infer<typeof signUpSchema>) {
    signUp.mutate({
      email,
      password,
      confirmPassword,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4 flex flex-col"
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm your password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <IconHoverButton
          className="min-w-32 mt-8"
          icon={<ArrowRightEndOnRectangleIcon className="size-6" />}
          type="submit"
          disabled={signUp.isPending}
        >
          Sign Up
        </IconHoverButton>
      </form>
    </Form>
  )
}
