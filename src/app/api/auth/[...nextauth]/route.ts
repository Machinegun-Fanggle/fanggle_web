//app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from "next-auth/providers/kakao"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: "이메일",
                    type: "text",
                    placeholder: "이메일 주소 입력 요망",
                },
                password: { label: "비밀번호", type: "password" },
            },

            async authorize(credentials, req) {
                const res = await fetch(
                    `${process.env.NEXTAUTH_URL}/api/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password,
                        }),
                    }
                )
                const user = await res.json()

                console.log(res)

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
        }),

        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            //console.log(user)
            //console.log(token)
            return { ...token, ...user }
        },

        async session({ session, token }) {
            session.user = token as any
            console.log(session)

            return session
        },
    },

    pages: {
        signIn: "/signin",
    },
})

export { handler as GET, handler as POST }
