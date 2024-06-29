import { env } from '@/env'
import { decryptToken, encryptToken } from '@/tokens/handler'
import axios from 'axios'

const encryptionKey = env.BATTLENET_ENCRYPTION_KEY
const identifier = env.BATTLENET_TOKEN_IDENTIFIER

export const BattleNet = {
  getAccessToken,
}

let accessTokenCache: { token: string; expires: number } | undefined

async function getAccessToken() {
  if (accessTokenCache && accessTokenCache.expires > Date.now()) {
    return accessTokenCache.token
  }

  const verificationToken = await decryptToken({
    encryptionKey,
    identifier,
  })

  if (verificationToken && verificationToken.expires > Date.now()) {
    accessTokenCache = {
      token: verificationToken.token,
      expires: verificationToken.expires,
    }
    return accessTokenCache.token
  }

  await refreshAccessToken()
  return accessTokenCache?.token
}

async function refreshAccessToken() {
  try {
    const formData = new FormData()
    formData.append('grant_type', 'client_credentials')
    const response = await axios.post<BlizzardAccessToken>(
      'https://oauth.battle.net/token',
      formData,
      {
        auth: {
          username: env.AUTH_BATTLENET_ID,
          password: env.AUTH_BATTLENET_SECRET,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    const { access_token, token_type, expires_in } = response.data
    const expires = Date.now() + expires_in * 1000

    await encryptToken({
      encryptionKey,
      identifier,
      token: access_token,
      type: token_type,
      expires: new Date(Date.now() + expires_in * 1000),
    })

    accessTokenCache = { token: access_token, expires }
  } catch (error) {
    console.error('Error refreshing access token!', error)
  }
}
