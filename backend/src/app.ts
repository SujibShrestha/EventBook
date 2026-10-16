import express,  {type Application } from "express"
import { prisma } from "./config/db.js"

const app:Application = express()


app.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        message: "Server is running"
    })
})

app.get("/health", async (req,res)=>{
    try {
        await prisma.$queryRaw`SELECT 1`
        res.status(200).json({ success: true, db: "up" })
    } catch {
        res.status(503).json({ success: false, db: "down" })
    }
})

export default app