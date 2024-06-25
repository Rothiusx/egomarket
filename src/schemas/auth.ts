import { z } from 'zod'

export const signUpSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address!' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long!' }),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords don't match!",
    path: ['confirmPassword'],
  })

export const credentialsSchema = z.object({
  email: z.string().email({ message: 'Invalid email address!' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 8 characters long!' }),
})
