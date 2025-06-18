import { Router, Request, Response } from "express";
import { runAgent } from "../Agent";
import { getInstagramCommentSchema } from "../Agent/schema";
import logger from "../config/logger";

const router = Router();

// API Information
router.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Riona AI Agent API",
    version: "v1",
    description: "RESTful API for AI-powered social media automation",
    endpoints: {
      ai: {
        generate: "POST /ai/generate",
        characters: "GET /ai/characters",
      },
      social: {
        instagram: "GET /social/instagram/status",
        twitter: "GET /social/twitter/status",
      },
      training: {
        status: "GET /training/status",
        start: "POST /training/start",
      },
    },
    documentation: {
      swagger: "/api/v1/docs",
      github: "https://github.com/your-repo/riona-ai-agent",
    },
  });
});

// AI Generation endpoint
router.post("/ai/generate", async (req: Request, res: Response) => {
  try {
    const { prompt, type = "comment" } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Prompt is required",
        code: "MISSING_PROMPT",
      });
    }

    logger.info(
      `AI generation request: type=${type}, prompt length=${prompt.length}`,
    );

    let schema;
    switch (type) {
      case "comment":
        schema = getInstagramCommentSchema();
        break;
      default:
        return res.status(400).json({
          error: "Bad Request",
          message: "Invalid generation type. Supported types: comment",
          code: "INVALID_TYPE",
        });
    }

    const result = await runAgent(schema, prompt);

    return res.json({
      success: true,
      data: result,
      metadata: {
        type,
        promptLength: prompt.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("AI generation error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "AI generation failed",
      code: "AI_GENERATION_ERROR",
    });
  }
});

// Get available AI characters
router.get("/ai/characters", (req: Request, res: Response) => {
  try {
    const characters = [
      {
        id: "arcane-edge",
        name: "ArcanEdge System Agent",
        description: "Pioneer of prompt-driven AI communication",
        clients: ["Instagram", "Facebook", "LinkedIn"],
        specialties: [
          "prompt engineering",
          "digital transformation",
          "AI strategy",
        ],
      },
      {
        id: "elon",
        name: "Elon Character",
        description: "Entrepreneur and innovator personality",
        clients: ["Twitter", "Instagram"],
        specialties: ["technology", "innovation", "entrepreneurship"],
      },
      {
        id: "sample",
        name: "Sample Character",
        description: "General purpose AI character",
        clients: ["Instagram", "Twitter"],
        specialties: ["general conversation", "content creation"],
      },
    ];

    res.json({
      success: true,
      data: characters,
      count: characters.length,
    });
  } catch (error) {
    logger.error("Error fetching characters:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch characters",
      code: "CHARACTERS_FETCH_ERROR",
    });
  }
});

// API Statistics
router.get("/stats", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      requests: {
        total: 0, // TODO: Implement request counter middleware
        errors: 0,
        averageResponseTime: 0,
      },
      ai: {
        totalGenerations: 0, // TODO: Implement counter
        successRate: 100,
        availableModels: ["gemini-2.0-flash"],
      },
    },
  });
});

// API Documentation placeholder
router.get("/docs", (req: Request, res: Response) => {
  res.json({
    message: "API Documentation",
    swagger: "Not implemented yet",
    postman: "Collection available on request",
    github: "https://github.com/your-repo/riona-ai-agent",
  });
});

export default router;
