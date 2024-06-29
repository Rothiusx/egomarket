import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { BadgeCheck, TriangleAlert } from 'lucide-react'

const messageVariants = cva(
  'w-full px-4 py-2 flex gap-4 items-center rounded-lg',
  {
    variants: {
      variant: {
        success: 'bg-emerald-300/25 text-emerald-500',
        error: 'bg-red-300/25 text-red-500',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
)

const icon = ({ variant }: VariantProps<typeof messageVariants>) => {
  switch (variant) {
    case 'success':
      return <BadgeCheck className="size-6" />
    case 'error':
      return <TriangleAlert className="size-6" />
  }
}

export interface StatusMessageProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  message: string | null | undefined
}

export function StatusMessage({ variant, message }: StatusMessageProps) {
  if (!message) {
    return null
  }

  return (
    <motion.div
      className={cn(messageVariants({ variant }))}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, type: 'easeIn' }}
    >
      {icon({ variant })}
      <span className="text-sm font-semibold">{message}</span>
    </motion.div>
  )
}
