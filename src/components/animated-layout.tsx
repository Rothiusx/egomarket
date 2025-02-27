'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 100, x: 0, y: 0 },
}

export function AnimatedLayout({
  className,
  children,
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 1, type: 'easeIn' }}
      className={cn('flex flex-grow flex-col', className)}
    >
      {children}
    </motion.div>
  )
}
