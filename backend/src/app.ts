import express,  {type Application, type Request, type Response } from "express"
import { prisma } from "./config/db.js"
import logger from './config/logger.js'
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import eventRouter from "./routes/event.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app:Application = express()

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(
  morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  })
);

// Routes
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1", bookingRouter);

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        success: true,
        message: "Server is running"
    })
})
    
app.get("/health", async (req:Request,res:Response)=>{
    try {
        await prisma.$queryRaw`SELECT 1`
        res.status(200).json({ success: true, db: "up" })
    } catch {
        res.status(503).json({ success: false, db: "down" })
    }
})

app.use(notFound);
app.use(errorHandler);

export default app
