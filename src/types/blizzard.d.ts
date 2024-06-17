interface BlizzardAccessToken {
  access_token: string
  token_type: 'bearer'
  expires_in: number
  sub: string
}

interface WarcraftItemMedia {
  _links: {
    self: {
      href: string
    }
  }
  assets: {
    key: string
    value: string
    file_data_id: number
  }[]
  id: number
}
