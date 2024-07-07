import { relations, sql } from 'drizzle-orm'
import {
  bigint,
  index,
  integer,
  json,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { type AdapterAccount } from 'next-auth/adapters'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `egomarket_${name}`)

export const posts = createTable(
  'post',
  {
    id: serial('id').primaryKey(),
    name: text('name'),
    createdById: text('createdById')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (post) => ({
    createdByIdIdx: index('createdById_idx').on(post.createdById),
    nameIndex: index('name_idx').on(post.name),
  })
)

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.createdById], references: [users.id] }),
}))

export const history = createTable(
  'history',
  {
    id: serial('id').primaryKey(),
    uploadedAt: timestamp('uploaded_at').default(sql`CURRENT_TIMESTAMP`),
    uploadedById: text('uploaded_by_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    report: text('report'),
    totalPot: integer('total_pot').notNull(),
    auctions: json('auctions').notNull(),
    createdBy: json('created_by').notNull(),
    goldLedger: json('gold_ledger').notNull(),
    sessionId: text('session_id').notNull(),
    mailHistory: json('mail_history').notNull(),
    pot: json('pot').notNull(),
    createdAt: timestamp('created_at').notNull(),
    lastAvailableBase: bigint('last_available_base', {
      mode: 'number',
    }).notNull(),
    lockedAt: timestamp('locked_at').notNull(),
    managementCut: bigint('management_cut', { mode: 'number' }).notNull(),
    title: text('title').notNull(),
    type: text('type').notNull(),
  },
  (history) => ({
    uploadedByIdIdx: index('uploaded_by_id_idx').on(history.uploadedById),
  })
)

export const historyRelations = relations(history, ({ one }) => ({
  user: one(users, { fields: [history.uploadedById], references: [users.id] }),
}))

export const items = createTable('items', {
  id: bigint('id', { mode: 'number' }).notNull().primaryKey(),
  mediaId: bigint('media_id', { mode: 'number' }).notNull(),
  icon: text('image').notNull(),
})

/**
 * ! IMPORTANT: The following tables are used by NextAuth.js for authentication!
 */
export const users = createTable('user', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    precision: 3,
  }),
  password: text('password'),
  roles: text('roles').notNull().default('USER').$type<UserRole>(),
  image: text('image'),
})

export const accounts = createTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = createTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = createTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    iv: text('iv').notNull(),
    type: text('type'),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
