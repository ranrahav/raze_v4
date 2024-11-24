import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-sm space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome to Raze</h1>
          <p className="text-gray-500">Sign in to continue</p>
        </div>
        <Button
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
