import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/client.js"

const adapter = new PrismaPg(process.env["DATABASE_URL"] ?? "")

if(adapter === undefined) {
  throw new Error("Prisma adapter is undefined. Please check your DATABASE_URL environment variable.")
}



export const prisma = new PrismaClient({ adapter })
