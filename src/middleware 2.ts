import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/", "/auth/signin", "/api/auth"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }

  const session = await auth()
  if (!session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
