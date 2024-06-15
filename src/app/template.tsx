'use client'

import { AnimatedLayout } from '@/components/animated-layout'
import { AnimatePresence, useMotionValue } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const overflow = useMotionValue('scroll')

  return (
    <AnimatePresence mode="wait">
      <AnimatedLayout
        onAnimationStart={() => overflow.set('hidden')}
        key={pathname}
      >
        {children}
      </AnimatedLayout>
    </AnimatePresence>
  )
}
