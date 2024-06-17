import * as schema from '@/server/db/schema'
import { pgGenerate } from 'drizzle-dbml-generator'

const out = '.db/schema.dbml'
const relational = true
pgGenerate({ schema, out, relational })
console.log('✅ Created the schema.dbml file')
console.log('⏳ Creating the erd.svg file')
