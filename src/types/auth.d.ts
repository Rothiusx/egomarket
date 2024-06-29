type UserRole = 'USER' | 'ADMIN'

type authErrorCode =
  | 'OAuthSignin'
  | 'OAuthCallback'
  | 'OAuthCreateAccount'
  | 'OAuthAccountNotLinked'
  | 'Callback'
  | 'Default'
