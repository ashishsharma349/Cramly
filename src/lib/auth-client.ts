import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "/api/auth", // the base url of your auth server
})

export const { signIn, signUp, useSession } = authClient;
