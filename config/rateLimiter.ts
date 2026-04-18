import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minute window
    max: 100,                   // max 100 requests per window per IP
    standardHeaders: true,      // returns rate limit info in RateLimit-* headers
    legacyHeaders: false,       // disables X-RateLimit-* headers
    message: {
        error: "Too many requests. Please try again later."
    }
});