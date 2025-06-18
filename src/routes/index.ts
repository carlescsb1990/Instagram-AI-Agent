import { Router } from "express";
import apiRoutes from "./api";
import healthRoutes from "./health";
import agentRoutes from "./agent";
import socialRoutes from "./social";
import metricsRoutes from "./metrics";
import {
  metricsMiddleware,
  rateLimitingMiddleware,
  requestIdMiddleware,
} from "../middleware/monitoring";

const router = Router();

// Apply monitoring middleware
router.use(requestIdMiddleware);
router.use(metricsMiddleware);

// Apply rate limiting (100 requests per minute in development)
if (process.env.NODE_ENV !== "development") {
  router.use(rateLimitingMiddleware(100, 60000));
}

// API versioning and organization
router.use("/api/v1", apiRoutes);
router.use("/health", healthRoutes);
router.use("/agent", agentRoutes);
router.use("/social", socialRoutes);
router.use("/metrics", metricsRoutes);

// Root endpoint with API documentation
router.get("/", (req, res) => {
  res.json({
    name: "Riona AI Agent",
    version: "1.0.0",
    description: "AI-powered automation tool for social media platforms",
    status: "running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
    },
    endpoints: {
      health: {
        basic: "/health",
        detailed: "/health/detailed",
        ready: "/health/ready",
        live: "/health/live",
      },
      api: {
        base: "/api/v1",
        generate: "/api/v1/ai/generate",
        characters: "/api/v1/ai/characters",
        stats: "/api/v1/stats",
      },
      agent: {
        status: "/agent/status",
        characters: "/agent/characters",
        config: "/agent/config",
        logs: "/agent/logs",
      },
      social: {
        overview: "/social",
        instagram: "/social/instagram",
        twitter: "/social/twitter",
        github: "/social/github",
      },
      monitoring: {
        metrics: "/metrics",
        prometheus: "/metrics/prometheus",
      },
      documentation: {
        swagger: "/api/v1/docs",
        github: "https://github.com/your-repo/riona-ai-agent",
      },
    },
    features: [
      "AI-powered social media automation",
      "Multi-platform support (Instagram, Twitter, GitHub)",
      "Intelligent content generation using Google Gemini",
      "Character-based AI personalities",
      "Real-time monitoring and analytics",
      "RESTful API with comprehensive endpoints",
      "Health checks and metrics collection",
      "Rate limiting and security features",
    ],
    technologies: {
      backend: "Node.js + Express.js + TypeScript",
      ai: "Google Gemini API",
      automation: "Puppeteer + Playwright",
      database: "MongoDB (optional)",
      logging: "Winston",
      security: "Helmet + CORS",
    },
    quickStart: {
      healthCheck: "GET /health",
      generateContent: "POST /api/v1/ai/generate",
      viewCharacters: "GET /agent/characters",
      socialStatus: "GET /social",
    },
  });
});

export default router;
