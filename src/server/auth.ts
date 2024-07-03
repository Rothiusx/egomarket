import { DrizzleAdapter } from '@auth/drizzle-adapter'
import bcrypt from 'bcrypt'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
} from 'next-auth'
import { type Adapter } from 'next-auth/adapters'
import BattleNetProvider from 'next-auth/providers/battlenet'
import CredentialsProvider from 'next-auth/providers/credentials'
import DiscordProvider from 'next-auth/providers/discord'
import GitHubProvider from 'next-auth/providers/github'

import { env } from '@/env'
import { db } from '@/server/db'
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from '@/server/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      roles: UserRole
      oauth: boolean
      provider?: string
    } & DefaultSession['user']
  }
  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string
    roles: UserRole
    oauth: boolean
    provider?: string
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ user }) => {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      })

      if (!existingUser?.emailVerified) {
        return true
        throw new Error('Email not verified!')
      }

      return true
    },
    jwt: async ({ token, trigger }) => {
      if (trigger === 'update') {
        if (!token.sub) {
          return token
        }
      }

      const existingUser = await db.query.users.findFirst({
        columns: {
          email: true,
          name: true,
          roles: true,
        },
        where: eq(users.id, token.sub),
      })

      if (!existingUser) {
        return token
      }

      const existingAccount = await db.query.accounts.findFirst({
        columns: {
          type: true,
          provider: true,
        },
        where: eq(accounts.userId, token.sub),
      })

      token.email = existingUser.email
      token.name = existingUser.name
      token.roles = existingUser.roles
      token.oauth = existingAccount?.type === 'oauth'

      if (existingAccount) {
        token.provider = existingAccount.provider
      }

      return token
    },
    session: ({ session, token }) => {
      if (session.user && token.provider) {
        session.user.provider = token.provider
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          roles: token.roles,
          oauth: token.oauth,
        },
      }
    },
  },
  events: {
    linkAccount: async ({ user }) => {
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
        })
        .where(eq(users.id, user.id))
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/error',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (
        credentials: Record<'email' | 'password', string> | undefined
      ): Promise<User | null> => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials!')
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        })

        if (user && !user.password) {
          throw new Error('Sign in using your previous provider!')
        }

        if (!user) {
          throw new Error('Invalid credentials!')
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password!
        )

        if (passwordMatch) {
          return user
        }

        return null
      },
    }),
    DiscordProvider({
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
    }),
    GitHubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    BattleNetProvider({
      clientId: env.AUTH_BATTLENET_ID,
      clientSecret: env.AUTH_BATTLENET_SECRET,
      issuer: env.AUTH_BATTLENET_ISSUER,
      authorization: {
        params: {
          scope: 'openid wow.profile',
        },
      },
      profile: (profile: { sub: string; battle_tag: string }) => {
        return {
          id: profile.sub,
          name: profile.battle_tag,
          email: '',
          image: null,
        }
      },
    }),
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
