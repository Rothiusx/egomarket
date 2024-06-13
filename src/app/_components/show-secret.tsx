'use client'

import { api } from '@/trpc/react'

export function ShowSecret() {
  const secret = api.post.getSecretMessage.useQuery()

  return (
    <div>
      {secret.isError
        ? secret.error.data?.code
        : secret.isLoading
          ? 'Loading secret...'
          : secret.data}
    </div>
  )
}
