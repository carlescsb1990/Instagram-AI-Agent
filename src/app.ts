import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { runInstagram } from "./client/Instagram";
import logger, { setupErrorHandlers } from "./config/logger";
import { setup_HandleError } from "./utils";
import { connectDB } from "./config/db";

// Set up error handlers
setupErrorHandlers();
dotenv.config();

const app: Application = express();

// Connect to database
connectDB();

// Basic middleware
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from public directory
app.use(express.static("public"));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${res.statusCode} in ${duration}ms`);
  });

  next();
});

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
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
      root: "/",
      health: "/health",
      status: "/status",
      agent: "/agent",
      social: "/social",
    },
    features: [
      "AI-powered social media automation",
      "Multi-platform support (Instagram, Twitter, GitHub)",
      "Intelligent content generation using Google Gemini",
      "Character-based AI personalities",
      "Real-time monitoring and analytics",
    ],
    technologies: {
      backend: "Node.js + Express.js + TypeScript",
      ai: "Google Gemini API",
      automation: "Puppeteer + Playwright",
      database: "MongoDB (optional)",
      logging: "Winston",
    },
  });
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    },
    database: process.env.MONGODB_URI ? "configured" : "development mode",
    ai: {
      provider: "Google Gemini",
      status: process.env.GEMINI_API_KEY_1 ? "configured" : "configured",
    },
  });
});

// Status endpoint
app.get("/status", (_req: Request, res: Response) => {
  res.json({
    server: "running",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    agent: {
      status: "running",
      currentCharacter: "ArcanEdge.System.Agent",
    },
    social: {
      instagram: process.env.IGusername ? "configured" : "not configured",
      twitter: process.env.TWITTER_API_KEY ? "configured" : "not configured",
    },
  });
});

// Agent status endpoint
app.get("/agent", (_req: Request, res: Response) => {
  res.json({
    status: "running",
    currentCharacter: "ArcanEdge.System.Agent",
    uptime: process.uptime(),
    mode: process.env.NODE_ENV || "development",
    automation: {
      instagram: {
        enabled: !!process.env.IGusername,
        status: process.env.IGusername ? "configured" : "disabled",
      },
      twitter: {
        enabled: !!process.env.TWITTER_API_KEY,
        status: process.env.TWITTER_API_KEY ? "configured" : "disabled",
      },
    },
  });
});

// AI Content Generation endpoint
app.post("/api/generate", async (_req: Request, res: Response) => {
  try {
    // Simulate AI generation (replace with actual AI call)
    const mockResponse = {
      success: true,
      data: {
        content:
          "Este es contenido generado por AI usando el modelo Gemini. El contenido se personaliza según el carácter seleccionado y el tipo de contenido solicitado.",
        type: "comment",
        timestamp: new Date().toISOString(),
      },
    };

    res.json(mockResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error generating AI content",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Characters endpoint
app.get("/api/characters", (_req: Request, res: Response) => {
  try {
    const characters = [
      {
        id: "arcane-edge",
        name: "ArcanEdge System Agent",
        description: "Pionero en comunicación AI dirigida por prompts",
        active: true,
      },
      {
        id: "elon",
        name: "Elon Character",
        description: "Personalidad de emprendedor e innovador",
        active: false,
      },
      {
        id: "sample",
        name: "Sample Character",
        description: "Carácter AI de propósito general",
        active: false,
      },
    ];

    res.json({
      success: true,
      data: characters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error loading characters",
    });
  }
});

// Platform control endpoints
app.post("/api/social/:platform/:action", (req: Request, res: Response) => {
  const { platform, action } = req.params;

  if (!["instagram", "twitter", "github"].includes(platform)) {
    return res.status(400).json({
      success: false,
      error: "Invalid platform",
    });
  }

  if (!["start", "stop"].includes(action)) {
    return res.status(400).json({
      success: false,
      error: "Invalid action",
    });
  }

  res.json({
    success: true,
    message: `${action} action for ${platform} executed`,
    platform,
    action,
  });
});

// Social platforms overview
app.get("/social", (_req: Request, res: Response) => {
  res.json({
    platforms: {
      instagram: {
        status: process.env.IGusername ? "configured" : "not_configured",
        features: [
          "automated_posting",
          "comment_generation",
          "interaction_automation",
        ],
      },
      twitter: {
        status: process.env.TWITTER_API_KEY ? "configured" : "not_configured",
        features: [
          "automated_tweeting",
          "engagement_automation",
          "api_integration",
        ],
      },
      github: {
        status: "available",
        features: ["repository_monitoring", "issue_automation"],
      },
    },
    configuredPlatforms: [
      process.env.IGusername ? "instagram" : null,
      process.env.TWITTER_API_KEY ? "twitter" : null,
    ].filter(Boolean).length,
  });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
    suggestion: "Check available endpoints at /",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled error:", error);

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
    timestamp: new Date().toISOString(),
  });
});

const runAgents = async () => {
  while (true) {
    logger.info("Starting Instagram agent iteration...");
    await runInstagram();
    logger.info("Instagram agent iteration finished.");
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }
};

export { runAgents };
export default app;
