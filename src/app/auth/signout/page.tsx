'use client'

import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export default function Page() {
  return (
    <section className="container flex flex-col">
      <Button onClick={() => signOut()}>Sign Out</Button>
    </section>
  )
}
