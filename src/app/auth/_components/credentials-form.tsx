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
import { credentialsSchema } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { SaveAll } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { type z } from 'zod'

export function CredentialsForm() {
  const form = useForm<z.infer<typeof credentialsSchema>>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit({
    email,
    password,
  }: z.infer<typeof credentialsSchema>) {
    console.log(email, password)
    await signIn('credentials', { email, password })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <IconHoverButton
          className="min-w-32"
          icon={<SaveAll className="size-4" />}
          type="submit"
        >
          Sign In
        </IconHoverButton>
      </form>
    </Form>
  )
}
