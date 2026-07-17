import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? `${window.location.origin}/api/auth` : "http://localhost:3000/api/auth", // the base url of your auth server
})

export const { signIn, signUp, useSession } = authClient;
