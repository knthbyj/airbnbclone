import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV != 'production') globalThis.prisma = client
// next.js 13 hotreloading can cause a bunch of new PrismaClient to be initialised, 
// assign new client to a global prisma so unaffected by hot reload

export default client;