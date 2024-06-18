import { profileSchema } from '@/schemas/profile'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export const profileRouter = createTRPCRouter({
  edit: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      })

      if (existingUser && existingUser.email !== input.email) {
        throw new Error('Email is already taken!')
      }

      await ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.id, ctx.session.user.id))
    }),
})
