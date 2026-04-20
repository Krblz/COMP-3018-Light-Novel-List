import express, { Express } from "express";
import setupSwagger from "../config/swagger";
import { apiLimiter } from "../config/rateLimiter";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./api/v1/routes/authRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import novelRoutes from "./api/v1/routes/novelRoutes";

// Initialize Express application
const app: Express = express();

// Define a route
app.use(express.json());
app.use(apiLimiter);
app.use("/api/v1", authRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", novelRoutes);

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

export default app;

setupSwagger(app);