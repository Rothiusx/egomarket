import { db } from '@/server/db'
import { verificationTokens } from '@/server/db/schema'
import crypto from 'crypto'

export async function encryptToken({
  encryptionKey,
  identifier,
  token,
  type,
  expires,
}: {
  encryptionKey: string
  identifier: string
  token: string
  type: string
  expires: Date
}) {
  const key = Buffer.from(encryptionKey, 'hex')
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  const encryptedToken =
    cipher.update(token, 'utf8', 'hex') + cipher.final('hex')

  await db.insert(verificationTokens).values({
    identifier,
    token: encryptedToken,
    iv: iv.toString('hex'),
    type,
    expires,
  })
}

export async function decryptToken({
  encryptionKey,
  identifier,
}: {
  encryptionKey: string
  identifier: string
}) {
  const verificationToken = await db.query.verificationTokens.findFirst({
    where: (verificationToken, { eq, and, gt }) =>
      and(
        eq(verificationToken.identifier, identifier),
        gt(verificationToken.expires, new Date())
      ),
  })

  if (verificationToken) {
    const key = Buffer.from(encryptionKey, 'hex')
    const iv = Buffer.from(verificationToken.iv, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    const decryptedToken =
      decipher.update(verificationToken.token, 'hex', 'utf8') +
      decipher.final('utf8')

    return {
      token: decryptedToken,
      type: verificationToken.type,
      expires: verificationToken.expires.getTime(),
    }
  }
}
