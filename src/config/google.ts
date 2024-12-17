export const googleConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  scopes: ['email', 'profile'],
  redirectUri: window.location.origin
} as const;