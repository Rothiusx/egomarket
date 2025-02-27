import { signUpSchema } from '@/schemas/auth'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { users } from '@/server/db/schema'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      })

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Account already exists!',
        })
      }

      const hashedPassword = await bcrypt.hash(input.password, 10)

      await ctx.db.insert(users).values({
        name: input.email,
        email: input.email,
        password: hashedPassword,
      })
    }),
})
