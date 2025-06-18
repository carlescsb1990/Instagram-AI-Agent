import { Router } from "express";
import apiRoutes from "./api";
import healthRoutes from "./health";
import agentRoutes from "./agent";
import socialRoutes from "./social";

const router = Router();

// API versioning and organization
router.use("/api/v1", apiRoutes);
router.use("/health", healthRoutes);
router.use("/agent", agentRoutes);
router.use("/social", socialRoutes);

// Root endpoint with API documentation
router.get("/", (req, res) => {
  res.json({
    name: "Riona AI Agent",
    version: "1.0.0",
    description: "AI-powered automation tool for social media platforms",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      api: "/api/v1",
      agent: "/agent",
      social: "/social",
      documentation: {
        swagger: "/api/v1/docs",
        postman: "/api/v1/postman",
      },
    },
    features: [
      "AI-powered social media automation",
      "Multi-platform support (Instagram, Twitter, GitHub)",
      "Intelligent content generation",
      "Character-based AI personalities",
      "Real-time monitoring and analytics",
    ],
  });
});

export default router;
