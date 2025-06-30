import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import os from "os";
import { setupSwagger } from "./config/swagger";
import AuthRoutes from "./modules/user/AuthController";
import MovieRoutes from "./modules/movie/MovieController";
import CategoryRoutes from "./modules/category/CategoryController";
import rateLimit from "express-rate-limit";
import { prisma } from "./prisma/client";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health geral
app.get("/health", async (_req, res) => {
  const mem = process.memoryUsage();
  const load = os.loadavg();
  const start = Date.now();

  // check DB
  let db: {
    status: "OK" | "FAIL";
    version?: string;
    responseTimeMs?: number;
    error?: string;
  } = { status: "FAIL" };

  try {
    const [row]: any = await prisma.$queryRaw`SELECT VERSION() as version`;
    db = {
      status: "OK",
      version: row.version,
      responseTimeMs: Date.now() - start,
    };
  } catch (err: any) {
    db.error = err.message;
  }

  return res.status(db.status === "OK" ? 200 : 500).json({
    status: db.status === "OK" ? "UP" : "DEGRADED",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // em segundos
    apiVersion: process.env.npm_package_version,
    memory: {
      rss: mem.rss,
      heapTotal: mem.heapTotal,
      heapUsed: mem.heapUsed,
      external: mem.external,
    },
    loadAverage: {
      "1m": load[0].toFixed(2),
      "5m": load[1].toFixed(2),
      "15m": load[2].toFixed(2),
    },
    db,
  });
});

// Health apenas do DB
app.get("/health/db", async (_req, res) => {
  const start = Date.now();
  try {
    const [row]: any = await prisma.$queryRaw`SELECT VERSION() as version`;
    return res.json({
      status: "OK",
      version: row.version,
      responseTimeMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      status: "FAIL",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true, // envia X-RateLimit-* headers
  legacyHeaders: false, // desativa X-RateLimit-*
  message: { error: "Too Many Requests" },
});

setupSwagger(app);

app.use(globalLimiter);
app.use(AuthRoutes);
app.use(MovieRoutes);
app.use(CategoryRoutes);

export default app;
