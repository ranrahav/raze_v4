export const env = {
  NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000',
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
}
