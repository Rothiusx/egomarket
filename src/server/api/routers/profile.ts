import { profileSchema } from '@/schemas/profile'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { users } from '@/server/db/schema'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'

export const profileRouter = createTRPCRouter({
  edit: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      })

      if (existingUser && existingUser.id !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email is already in use!',
        })
      }

      if (
        input.email != ctx.session.user.email &&
        !!ctx.session.user.email &&
        ctx.session.user.oauth
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot edit email using an OAuth account!',
        })
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
