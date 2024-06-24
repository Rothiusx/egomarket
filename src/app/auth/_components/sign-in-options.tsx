'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { CredentialsForm } from './credentials-form'

export function SignInForm() {
  return (
    <div>
      <CredentialsForm />
      <Button onClick={() => signIn('github')}>Github</Button>
    </div>
  )
}
