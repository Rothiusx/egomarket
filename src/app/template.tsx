'use client'

import { AnimatedLayout } from '@/components/animated-layout'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnimatePresence mode="wait">
        <AnimatedLayout key={pathname}>{children}</AnimatedLayout>
      </AnimatePresence>
    </Suspense>
  )
}
