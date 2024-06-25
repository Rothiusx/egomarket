import { DrizzleAdapter } from '@auth/drizzle-adapter'
import bcrypt from 'bcryptjs'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type RequestInternal,
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
  authenticators,
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
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
      }

      return token
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
      },
    }),
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }) as Adapter,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async function (
        credentials: Record<'email' | 'password', string> | undefined,
        request: Pick<RequestInternal, 'query' | 'body' | 'headers' | 'method'>
      ): Promise<User | null> {
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
          return null
        }

        const isAuthenticated = await bcrypt.compare(
          credentials.password,
          user.password ?? ''
        )

        return isAuthenticated ? user : null
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    BattleNetProvider({
      clientId: env.BATTLENET_CLIENT_ID,
      clientSecret: env.BATTLENET_CLIENT_SECRET,
      issuer: env.BATTLENET_ISSUER,
      authorization: {
        params: {
          scope: 'openid wow.profile',
        },
      },
      profile(profile: { sub: string; battle_tag: string }) {
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
