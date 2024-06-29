import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address!' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' }),
})

export const signUpSchema = signInSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ['confirmPassword'],
  })
