import { Router, Request, Response } from "express";
import { initAgent, chooseCharacter } from "../Agent";
import fs from "fs";
import path from "path";
import logger from "../config/logger";

const router = Router();

// Agent status and information
router.get("/status", (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
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
      },
    });
  } catch (error) {
    logger.error("Error getting agent status:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to get agent status",
    });
  }
});

// Get all available characters
router.get("/characters", (req: Request, res: Response) => {
  try {
    const charactersDir = path.join(
      process.cwd(),
      "src",
      "Agent",
      "characters",
    );
    const files = fs.readdirSync(charactersDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const characters = jsonFiles.map((file) => {
      try {
        const filePath = path.join(charactersDir, file);
        const data = fs.readFileSync(filePath, "utf8");
        const character = JSON.parse(data);

        return {
          id: file.replace(".json", ""),
          filename: file,
          name: character.name || "Unknown",
          clients: character.clients || [],
          bio: character.bio ? character.bio.slice(0, 2) : [], // First 2 bio entries
          topics: character.topics ? character.topics.slice(0, 5) : [], // First 5 topics
          style: character.style || {},
        };
      } catch (parseError) {
        logger.error(`Error parsing character file ${file}:`, parseError);
        return {
          id: file.replace(".json", ""),
          filename: file,
          name: "Error loading character",
          error: "Failed to parse JSON",
        };
      }
    });

    res.json({
      success: true,
      data: characters,
      count: characters.length,
    });
  } catch (error) {
    logger.error("Error loading characters:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to load characters",
    });
  }
});

// Get specific character details
router.get("/characters/:id", (req: Request, res: Response) => {
  try {
    const characterId = req.params.id;
    const charactersDir = path.join(
      process.cwd(),
      "src",
      "Agent",
      "characters",
    );

    // Support both with and without .json extension
    const filename = characterId.endsWith(".json")
      ? characterId
      : `${characterId}.json`;
    const filePath = path.join(charactersDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "Not Found",
        message: `Character '${characterId}' not found`,
      });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const character = JSON.parse(data);

    res.json({
      success: true,
      data: {
        id: characterId,
        filename,
        ...character,
        loadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error(`Error loading character ${req.params.id}:`, error);
    if (error instanceof SyntaxError) {
      res.status(400).json({
        error: "Bad Request",
        message: "Invalid character file format",
      });
    } else {
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load character",
      });
    }
  }
});

// Agent configuration
router.get("/config", (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        environment: process.env.NODE_ENV || "development",
        database: {
          enabled: !!process.env.MONGODB_URI,
          status: process.env.MONGODB_URI ? "configured" : "disabled",
        },
        ai: {
          provider: "Google Gemini",
          model: "gemini-2.0-flash",
          apiKeysConfigured: process.env.GEMINI_API_KEY_1 ? "yes" : "no",
        },
        automation: {
          intervalSeconds: 30,
          platforms: ["instagram", "twitter", "github"],
        },
        features: {
          interactiveMode: process.stdin.isTTY,
          headlessBrowser: process.env.NODE_ENV === "development",
          cookieStorage: true,
          contentGeneration: true,
        },
      },
    });
  } catch (error) {
    logger.error("Error getting agent config:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to get agent configuration",
    });
  }
});

// Agent logs (last N entries)
router.get("/logs", (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const level = (req.query.level as string) || "info";

    // This would require implementing a log storage mechanism
    // For now, return a placeholder response
    res.json({
      success: true,
      data: {
        logs: [
          {
            timestamp: new Date().toISOString(),
            level: "info",
            message: "Agent system initialized successfully",
            meta: { component: "agent-system" },
          },
          {
            timestamp: new Date(Date.now() - 30000).toISOString(),
            level: "info",
            message: "Instagram agent iteration finished",
            meta: { component: "instagram-client" },
          },
        ],
        pagination: {
          limit,
          total: 2,
          hasMore: false,
        },
        filters: {
          level,
          component: req.query.component || "all",
        },
      },
      message: "Note: Log storage not fully implemented. Showing sample logs.",
    });
  } catch (error) {
    logger.error("Error getting agent logs:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to get agent logs",
    });
  }
});

export default router;
