import express, { Express } from "express";
import setupSwagger from "../config/swagger";
import dotenv from "dotenv";

dotenv.config();

import novelRoutes from "./api/v1/routes/novelRoutes";

// Initialize Express application
const app: Express = express();

// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

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