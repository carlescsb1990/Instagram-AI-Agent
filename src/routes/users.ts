import { Router, Request, Response } from "express";
import logger from "../config/logger";

const router = Router();

// Mock data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    subscription: { plan: "enterprise", accountsLimit: 999 },
    instagramAccounts: 2,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Demo User",
    email: "demo@example.com",
    role: "user",
    subscription: { plan: "basic", accountsLimit: 5 },
    instagramAccounts: 1,
    createdAt: new Date("2024-01-20"),
  },
];

const mockAccounts = [
  {
    id: "1",
    username: "demo_account_1",
    userId: "1",
    isActive: true,
    stats: { followers: 1250, following: 890, posts: 45, engagement: 3.2 },
    settings: { autoLike: true, autoComment: true, autoFollow: false },
    lastActivity: new Date(),
  },
  {
    id: "2",
    username: "demo_account_2",
    userId: "2",
    isActive: false,
    stats: { followers: 850, following: 420, posts: 23, engagement: 2.8 },
    settings: { autoLike: true, autoComment: false, autoFollow: false },
    lastActivity: new Date(Date.now() - 3600000),
  },
];

// Get all users
router.get("/", (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockUsers,
      count: mockUsers.length,
    });
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
});

// Get user by ID
router.get("/:userId", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
});

// Create new user
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, email, role = "user" } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      subscription: { plan: "free", accountsLimit: 1 },
      instagramAccounts: 0,
      createdAt: new Date(),
    };

    mockUsers.push(newUser);

    return res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    logger.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create user",
    });
  }
});

// Get user's Instagram accounts
router.get("/:userId/instagram", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userAccounts = mockAccounts.filter((acc) => acc.userId === userId);

    return res.json({
      success: true,
      data: userAccounts,
      count: userAccounts.length,
    });
  } catch (error) {
    logger.error("Error fetching user accounts:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch accounts",
    });
  }
});

// Add Instagram account
router.post("/:userId/instagram", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, password, settings } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    const newAccount = {
      id: Date.now().toString(),
      username,
      userId,
      isActive: false,
      stats: { followers: 0, following: 0, posts: 0, engagement: 0 },
      settings: settings || {
        autoLike: true,
        autoComment: true,
        autoFollow: false,
      },
      lastActivity: new Date(),
    };

    mockAccounts.push(newAccount);

    return res.status(201).json({
      success: true,
      data: newAccount,
    });
  } catch (error) {
    logger.error("Error adding Instagram account:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to add Instagram account",
    });
  }
});

// Start automation for account
router.post(
  "/:userId/instagram/:username/start",
  (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const account = mockAccounts.find((acc) => acc.username === username);

      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Account not found",
        });
      }

      account.isActive = true;

      return res.json({
        success: true,
        message: `Automation started for ${username}`,
      });
    } catch (error) {
      logger.error("Error starting automation:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to start automation",
      });
    }
  },
);

// Stop automation for account
router.post(
  "/:userId/instagram/:username/stop",
  (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const account = mockAccounts.find((acc) => acc.username === username);

      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Account not found",
        });
      }

      account.isActive = false;

      return res.json({
        success: true,
        message: `Automation stopped for ${username}`,
      });
    } catch (error) {
      logger.error("Error stopping automation:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to stop automation",
      });
    }
  },
);

export default router;
