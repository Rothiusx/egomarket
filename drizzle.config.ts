import { env } from '@/env'
import { type Config } from 'drizzle-kit'

const config = {
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ['egomarket_*'],
} satisfies Config

export default config
