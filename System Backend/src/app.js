import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import fraudRoutes from "./routes/fraud.routes.js";
import auditRoutes from "./routes/audit.routes.js";

import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show request logs during local development.
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
    },
  },
});

app.use(globalLimiter);

// Stricter limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
    error: {
      code: "AUTH_RATE_LIMIT_EXCEEDED",
    },
  },
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// API routes
app.use("/auth", authLimiter, authRoutes);
app.use("/accounts", accountRoutes);
app.use("/transactions", transactionRoutes);
app.use("/fraud", fraudRoutes);
app.use("/audit-logs", auditRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export { app };