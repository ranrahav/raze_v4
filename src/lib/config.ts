export const config = {
  nextauth: {
    url: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    secret: process.env.NEXTAUTH_SECRET,
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
} as const
