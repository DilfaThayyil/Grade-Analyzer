
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { prisma } from './prisma';


export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        MicrosoftEntraID({
            clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
            clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
            issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user }) {
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email! },
            });

            if (!existingUser) {
                await prisma.user.create({
                    data: {
                        name: user.name,
                        email: user.email!,
                        image: user.image,
                    },
                });
            }

            return true;
        },
        async session({ session }) {
            if (session.user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                    select: { id: true },
                });

                if (dbUser) {
                    (session.user as any).id = dbUser.id;
                }
            }
            return session;
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}/dashboard`;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
});