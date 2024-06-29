import { relations, sql } from 'drizzle-orm'
import {
  bigint,
  index,
  int,
  json,
  mysqlTableCreator,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'
import { type AdapterAccount } from 'next-auth/adapters'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `egomarket_${name}`)

export const posts = createTable(
  'post',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 256 }),
    createdById: varchar('createdById', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt').onUpdateNow(),
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
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    uploadedAt: timestamp('uploaded_at').default(sql`CURRENT_TIMESTAMP`),
    uploadedById: varchar('uploaded_by_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    report: varchar('report', { length: 255 }),
    totalPot: bigint('total_pot', { mode: 'number' }).notNull(),
    auctions: json('auctions').notNull(),
    createdBy: json('created_by').notNull(),
    goldLedger: json('gold_ledger').notNull(),
    sessionId: varchar('session_id', { length: 255 }).notNull(),
    mailHistory: json('mail_history').notNull(),
    pot: json('pot').notNull(),
    createdAt: timestamp('created_at').notNull(),
    lastAvailableBase: bigint('last_available_base', {
      mode: 'number',
    }).notNull(),
    lockedAt: timestamp('locked_at').notNull(),
    managementCut: bigint('management_cut', { mode: 'number' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
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
  icon: varchar('image', { length: 255 }).notNull(),
})

/**
 * ! IMPORTANT: The following tables are used by NextAuth.js for authentication!
 */
export const users = createTable('user', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    fsp: 3,
  }),
  password: varchar('password', { length: 255 }),
  roles: varchar('roles', { length: 255 })
    .notNull()
    .default('USER')
    .$type<UserRole>(),
  image: varchar('image', { length: 255 }),
})

export const accounts = createTable(
  'account',
  {
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: varchar('refresh_token', { length: 255 }),
    access_token: varchar('access_token', { length: 255 }),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: varchar('id_token', { length: 2048 }),
    session_state: varchar('session_state', { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = createTable('session', {
  sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = createTable(
  'verification_token',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    iv: varchar('iv', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
