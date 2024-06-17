import { z } from 'zod'

export const auctionsSchema = z.record(
  z.string(),
  z.object({
    Bids: z.record(z.string(), z.unknown()).optional(),
    CreatedBy: z.record(z.string(), z.unknown()),
    ID: z.string(),
    PreviousStates: z.unknown().optional(),
    Winner: z.record(z.string(), z.unknown()).optional(),
    awardChecksum: z.string().optional(),
    checksum: z.string(),
    createdAt: z.number(),
    itemID: z.number(),
    itemLink: z.string(),
    price: z.number().optional(),
    reason: z.string().optional(),
  })
)

export const potSchema = z.object({
  Cuts: z.record(z.string(), z.number()),
})

export const historySchema = z.object({
  Auctions: auctionsSchema,
  CreatedBy: z.record(z.string(), z.unknown()),
  GoldLedger: z.record(z.string(), z.unknown()),
  ID: z.string(),
  MailHistory: z.record(z.string(), z.unknown()),
  Pot: potSchema,
  createdAt: z.number(),
  lastAvailableBase: z.number(),
  lockedAt: z.number(),
  managementCut: z.number(),
  title: z.string(),
  type: z.string(),
})
