export function getAuthError(code: string | null) {
  let message = undefined
  switch (code) {
    case 'OAuthSignin':
      message = 'Error in constructing an authorization URL'
      break
    case 'OAuthCallback':
      message = 'Error in handling the response from an OAuth provider'
      break
    case 'OAuthCreateAccount':
      message = 'Could not create user account'
      break
    case 'OAuthAccountNotLinked':
      message = 'Email address is already linked to another account'
      break
    case 'Callback':
      message = 'Callback route error'
      break
    default:
      message = 'Oops! Something went wrong!'
  }
  return {
    code,
    message,
  }
}
