import { sleep } from '@/lib/utils'
import { auctionsSchema, historySchema } from '@/schemas/history'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { history, items } from '@/server/db/schema'
import { BattleNet } from '@/tokens/blizzard/token'
import axios, { isAxiosError } from 'axios'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'

export const historyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        history: historySchema,
        report: z.literal('').or(z.string().url().optional()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(history).values({
        uploadedById: ctx.session.user.id,
        report: input.report,
        totalPot:
          Object.values(input.history.Pot.Cuts).reduce(
            (pot, cut) => pot + cut,
            0
          ) /
          (1 - input.history.managementCut / 100),
        auctions: input.history.Auctions,
        createdBy: input.history.CreatedBy,
        goldLedger: input.history.GoldLedger,
        sessionId: input.history.ID,
        mailHistory: input.history.MailHistory,
        pot: input.history.Pot,
        createdAt: new Date(input.history.createdAt * 1000),
        lastAvailableBase: input.history.lastAvailableBase,
        lockedAt: new Date(input.history.lockedAt * 1000),
        managementCut: input.history.managementCut,
        title: input.history.title,
        type: input.history.type,
      })
    }),

  getRecentHistory: publicProcedure.query(async ({ ctx }) => {
    const recentHistoryData = await ctx.db.query.history.findMany({
      columns: {
        id: true,
        title: true,
        createdAt: true,
        report: true,
        totalPot: true,
        auctions: true,
      },
      orderBy: [desc(history.createdAt)],
      limit: 3,
    })

    const recentHistory = z
      .array(
        z.object({
          id: z.number(),
          title: z.string(),
          createdAt: z.date(),
          report: z.literal('').or(z.string().url().optional()),
          totalPot: z.number(),
          auctions: auctionsSchema,
        })
      )
      .parse(recentHistoryData)

    const accessToken = await BattleNet.getAccessToken()

    return await Promise.all(
      recentHistory.map(
        async (
          { id, title, createdAt, report, totalPot, auctions },
          historyIndex
        ) => {
          return {
            id,
            title,
            createdAt,
            report,
            totalPot,
            items: await Promise.all(
              Object.values(auctions)
                .filter((auction) => auction.itemID && auction.price)
                .sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0))
                .map(async (auction, index) => {
                  const existingItem = await ctx.db.query.items.findFirst({
                    where: eq(items.id, auction.itemID),
                  })

                  if (existingItem) {
                    return {
                      id: auction.itemID,
                      name:
                        auction.itemID === 45978
                          ? '[Gold added manually]'
                          : auction.itemLink,
                      price: auction.price,
                      icon: existingItem.icon,
                    }
                  }

                  try {
                    await sleep(
                      (index % 3) * 1000 + historyIndex !== 0
                        ? Object.keys(auctions).length * 30
                        : 0
                    )
                    const itemMedia = await axios.get<WarcraftItemMedia>(
                      `https://eu.api.blizzard.com/data/wow/media/item/${auction.itemID}?namespace=static-eu&locale=en_GB`,
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                          'Content-Type': 'application/json',
                        },
                      }
                    )

                    await ctx.db.insert(items).values({
                      id: auction.itemID,
                      icon: itemMedia.data.assets[0]?.value ?? '',
                      mediaId: itemMedia.data.assets[0]?.file_data_id ?? 0,
                    })

                    return {
                      id: auction.itemID,
                      name:
                        auction.itemID === 45978
                          ? '[Gold added manually]'
                          : auction.itemLink,
                      price: auction.price,
                      icon: itemMedia.data.assets[0]?.value,
                    }
                  } catch (error) {
                    if (isAxiosError(error)) {
                      console.error(error.message)
                    }
                  }
                })
            ),
          }
        }
      )
    )
  }),

  getItemInfo: protectedProcedure
    .input(z.object({ itemId: z.number() }))
    .mutation(async ({ input }) => {
      const accessToken = await BATTLENET.getAccessToken()
      const itemMedia = await axios.get(
        `https://eu.api.blizzard.com/data/wow/media/item/${input.itemId}?namespace=static-eu&locale=en_GB`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      console.log(itemMedia)
      return itemMedia.data as unknown
    }),
})
