import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";
import { runInstagram } from "./client/Instagram";
import logger, { setupErrorHandlers } from "./config/logger";
import { setup_HandleError } from "./utils";
import { connectDB } from "./config/db";
import { runAgent } from "./Agent";
import { getInstagramCommentSchema } from "./Agent/schema";
import { InstagramService } from "./services/InstagramService";
import { User } from "./models/User";

// Set up error handlers
setupErrorHandlers();
dotenv.config();

const app: Application = express();

// Connect to database
connectDB();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        workerSrc: ["'none'"],
      },
    },
  }),
);

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? false : true,
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

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
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// API Info endpoint
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    name: "Riona AI Agent API",
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
      api: "/api",
      health: "/api/health",
      users: "/api/users",
      characters: "/api/characters",
      generate: "/api/generate",
      social: "/api/social",
      analytics: "/api/analytics",
    },
    features: [
      "AI-powered social media automation",
      "Multi-platform support (Instagram, Twitter, GitHub)",
      "Intelligent content generation using Google Gemini",
      "Character-based AI personalities",
      "Real-time monitoring and analytics",
      "Multi-user management system",
      "Instagram automation with anti-detection",
    ],
    technologies: {
      backend: "Node.js + Express.js + TypeScript",
      ai: "Google Gemini 2.0 Flash",
      automation: "Puppeteer + Playwright",
      database: "MongoDB (optional)",
      logging: "Winston",
      security: "Helmet + CORS + Rate Limiting",
    },
  });
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
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
      keys: Object.keys(process.env).filter((key) =>
        key.startsWith("GEMINI_API_KEY"),
      ).length,
      status: "configured",
    },
  });
});

// Users API
app.get("/api/users", async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-instagramAccounts.password");
    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching users",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const { name, email, role, subscription } = req.body;

    const user = new User({
      name,
      email,
      role: role || "user",
      subscription: subscription || {
        plan: "free",
        accountsLimit: 1,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error creating user",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-instagramAccounts.password",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching user",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error updating user",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting user",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Instagram Accounts API
app.post("/api/users/:userId/accounts", async (req: Request, res: Response) => {
  try {
    const { username, password, settings } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.instagramAccounts.length >= user.subscription.accountsLimit) {
      return res.status(400).json({
        success: false,
        error: "Account limit reached for this subscription",
      });
    }

    const newAccount = {
      username,
      password,
      isActive: true,
      stats: {
        followers: 0,
        following: 0,
        posts: 0,
        engagement: 0,
      },
      settings: settings || {
        autoLike: true,
        autoComment: true,
        autoFollow: false,
        autoDM: false,
        maxLikesPerHour: 60,
        maxCommentsPerHour: 30,
        maxFollowsPerHour: 20,
        targetHashtags: [],
        blacklistedUsers: [],
      },
    };

    user.instagramAccounts.push(newAccount);
    await user.save();

    res.status(201).json({
      success: true,
      data: newAccount,
      message: "Instagram account added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error adding Instagram account",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api/accounts", async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("name instagramAccounts");
    const allAccounts = [];

    users.forEach((user) => {
      user.instagramAccounts.forEach((account) => {
        allAccounts.push({
          ...account.toObject(),
          userName: user.name,
          userId: user._id,
          password: undefined, // Don't send passwords
        });
      });
    });

    res.json({
      success: true,
      data: allAccounts,
      count: allAccounts.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching accounts",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// AI Content Generation endpoint
app.post("/api/generate", async (req: Request, res: Response) => {
  try {
    const { type, context, character } = req.body;

    let prompt = "";
    switch (type) {
      case "comment":
        prompt = `Generate a natural, engaging Instagram comment for this post: "${context}". Make it authentic and relevant in Spanish.`;
        break;
      case "caption":
        prompt = `Generate an engaging Instagram caption for: "${context}". Include relevant hashtags.`;
        break;
      case "reply":
        prompt = `Generate a thoughtful reply to this comment: "${context}". Be helpful and engaging.`;
        break;
      default:
        prompt = `Generate content about: "${context}"`;
    }

    const schema = getInstagramCommentSchema();
    const result = await runAgent(schema, prompt, character);

    res.json({
      success: true,
      data: {
        content: result?.comment || result?.content || "Generated content",
        type,
        timestamp: new Date().toISOString(),
        character: character || "ArcanEdge.System.Agent",
      },
    });
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
        description:
          "Pionero en comunicación AI dirigida por prompts. Especializado en automatización social y generación de contenido contextual.",
        active: true,
        personality: "Profesional, innovador, técnico",
        language: "Español/Inglés",
      },
      {
        id: "elon",
        name: "Elon Character",
        description:
          "Personalidad de emprendedor e innovador. Enfoque en tecnología, startups y visión futurista.",
        active: false,
        personality: "Visionario, directo, disruptivo",
        language: "Inglés",
      },
      {
        id: "sample",
        name: "Sample Character",
        description:
          "Carácter AI de propósito general. Adaptable a diferentes contextos y audiencias.",
        active: false,
        personality: "Amigable, versátil, equilibrado",
        language: "Español",
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

// Social Platform Control
app.post(
  "/api/social/:platform/:action",
  async (req: Request, res: Response) => {
    try {
      const { platform, action } = req.params;
      const { accountId, ...params } = req.body;

      if (platform === "instagram") {
        const user = await User.findOne({ "instagramAccounts._id": accountId });
        if (!user) {
          return res.status(404).json({
            success: false,
            error: "Instagram account not found",
          });
        }

        const account = user.instagramAccounts.id(accountId);
        if (!account) {
          return res.status(404).json({
            success: false,
            error: "Account not found",
          });
        }

        const service = new InstagramService(account);
        await service.initialize();
        await service.login();

        let result;
        switch (action) {
          case "like":
            result = await service.likePostsByHashtag(
              params.hashtag,
              params.count || 10,
            );
            break;
          case "comment":
            result = await service.commentOnPosts(
              params.hashtag,
              params.count || 5,
            );
            break;
          case "follow":
            result = await service.followUsersByHashtag(
              params.hashtag,
              params.count || 10,
            );
            break;
          case "dm":
            result = await service.sendDirectMessage(
              params.username,
              params.message,
            );
            break;
          case "stats":
            result = await service.getAccountStats();
            break;
          case "automation":
            await service.runAutomation();
            result = { message: "Automation completed" };
            break;
          default:
            throw new Error("Invalid action");
        }

        await service.cleanup();

        res.json({
          success: true,
          data: result,
          message: `${action} executed successfully`,
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(400).json({
          success: false,
          error: "Platform not supported",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Error executing ${req.params.action}`,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Analytics endpoint
app.get("/api/analytics", async (req: Request, res: Response) => {
  try {
    const { timeRange = "24h", userId } = req.query;

    // Calculate date range
    let startDate = new Date();
    switch (timeRange) {
      case "24h":
        startDate.setHours(startDate.getHours() - 24);
        break;
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
    }

    // Get analytics data (mock for now)
    const analytics = {
      timeRange,
      startDate,
      endDate: new Date(),
      metrics: {
        totalLikes: Math.floor(Math.random() * 1000) + 500,
        totalComments: Math.floor(Math.random() * 300) + 100,
        totalFollows: Math.floor(Math.random() * 200) + 50,
        engagementRate: (Math.random() * 10 + 2).toFixed(2) + "%",
      },
      hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        follows: Math.floor(Math.random() * 10),
      })),
      hashtagPerformance: [
        { hashtag: "technology", engagement: 85, posts: 45 },
        { hashtag: "AI", engagement: 92, posts: 38 },
        { hashtag: "programming", engagement: 78, posts: 52 },
        { hashtag: "startup", engagement: 67, posts: 29 },
      ],
      accountPerformance: [],
    };

    // Get real account data if available
    const users = await User.find(userId ? { _id: userId } : {});
    users.forEach((user) => {
      user.instagramAccounts.forEach((account) => {
        analytics.accountPerformance.push({
          username: account.username,
          followers: account.stats.followers,
          engagement: account.stats.engagement,
          isActive: account.isActive,
          lastActivity: account.lastActivity,
        });
      });
    });

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching analytics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// System Configuration
app.get("/api/config", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      system: {
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
        version: "1.0.0",
      },
      ai: {
        provider: "Google Gemini",
        availableKeys: Object.keys(process.env).filter((key) =>
          key.startsWith("GEMINI_API_KEY"),
        ).length,
        defaultCharacter: "ArcanEdge.System.Agent",
      },
      automation: {
        enabled: true,
        platforms: ["instagram"],
        features: ["likes", "comments", "follows", "dms", "analytics"],
      },
    },
  });
});

// Backup endpoint
app.post("/api/backup", async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-instagramAccounts.password");
    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      data: {
        users: users,
        settings: {
          environment: process.env.NODE_ENV,
          features: ["instagram-automation", "ai-generation", "multi-user"],
        },
      },
    };

    res.json({
      success: true,
      data: backup,
      message: "Backup created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating backup",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Social platforms overview
app.get("/api/social", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      platforms: {
        instagram: {
          status: "active",
          features: [
            "automated_liking",
            "intelligent_commenting",
            "targeted_following",
            "direct_messaging",
            "story_interaction",
            "hashtag_targeting",
            "anti_detection",
          ],
          configured: true,
        },
        twitter: {
          status: "available",
          features: [
            "automated_tweeting",
            "engagement_automation",
            "api_integration",
          ],
          configured: !!process.env.TWITTER_API_KEY,
        },
        github: {
          status: "available",
          features: ["repository_monitoring", "issue_automation"],
          configured: false,
        },
      },
      totalAccounts: 0,
      activeAutomations: 0,
    },
  });
});

// 404 handler for API routes
app.use("/api/*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found",
    message: `Route ${req.originalUrl} not found`,
    suggestion: "Check available endpoints at /api",
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend for all other routes
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Global error handler
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled error:", error);

  res.status(500).json({
    success: false,
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
    try {
      logger.info("Starting Instagram agent iteration...");
      await runInstagram();
      logger.info("Instagram agent iteration finished.");
    } catch (error) {
      logger.error("Error in agent iteration:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }
};

export { runAgents };
export default app;
