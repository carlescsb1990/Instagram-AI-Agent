import { Router, Request, Response } from "express";
import { User, IUser, IInstagramAccount } from "../models/User";
import logger from "../config/logger";
import { InstagramService } from "../services/InstagramService";

const router = Router();

// Get all users
router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-instagramAccounts.password");
    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
});

// Create new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, role = "user" } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    const user = new User({
      name,
      email,
      role,
      instagramAccounts: [],
      subscription: {
        plan: "free",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        accountsLimit: 1,
      },
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.instagramAccounts;

    res.status(201).json({
      success: true,
      data: userResponse,
    });

    logger.info(`Created new user: ${email}`);
  } catch (error) {
    logger.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create user",
    });
  }
});

// Get user by ID
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
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
    logger.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
});

// Update user
router.put("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      select: "-instagramAccounts.password",
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
    });

    logger.info(`Updated user: ${userId}`);
  } catch (error) {
    logger.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user",
    });
  }
});

// Delete user
router.delete("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

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

    logger.info(`Deleted user: ${userId}`);
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
});

// Add Instagram account to user
router.post("/:userId/instagram", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, password, settings } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check account limit
    if (user.instagramAccounts.length >= user.subscription.accountsLimit) {
      return res.status(403).json({
        success: false,
        error: "Account limit reached for current subscription",
      });
    }

    // Check if account already exists
    const existingAccount = user.instagramAccounts.find(
      (acc) => acc.username === username,
    );
    if (existingAccount) {
      return res.status(409).json({
        success: false,
        error: "Instagram account already exists",
      });
    }

    const newAccount: IInstagramAccount = {
      username,
      password,
      isActive: true,
      stats: {
        followers: 0,
        following: 0,
        posts: 0,
        engagement: 0,
      },
      settings: {
        autoLike: settings?.autoLike ?? true,
        autoComment: settings?.autoComment ?? true,
        autoFollow: settings?.autoFollow ?? false,
        autoDM: settings?.autoDM ?? false,
        maxLikesPerHour: settings?.maxLikesPerHour ?? 60,
        maxCommentsPerHour: settings?.maxCommentsPerHour ?? 30,
        maxFollowsPerHour: settings?.maxFollowsPerHour ?? 20,
        targetHashtags: settings?.targetHashtags ?? [],
        blacklistedUsers: settings?.blacklistedUsers ?? [],
      },
    };

    user.instagramAccounts.push(newAccount);
    await user.save();

    // Test login
    try {
      const igService = new InstagramService(newAccount);
      await igService.initialize();
      const loginSuccess = await igService.login();

      if (loginSuccess) {
        const stats = await igService.getAccountStats();
        newAccount.stats = { ...newAccount.stats, ...stats };
        await user.save();
      }

      await igService.cleanup();
    } catch (loginError) {
      logger.warn(
        `Failed to verify Instagram account ${username}:`,
        loginError,
      );
    }

    res.status(201).json({
      success: true,
      message: "Instagram account added successfully",
      data: {
        username: newAccount.username,
        isActive: newAccount.isActive,
        stats: newAccount.stats,
        settings: newAccount.settings,
      },
    });

    logger.info(`Added Instagram account ${username} to user ${userId}`);
  } catch (error) {
    logger.error("Error adding Instagram account:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add Instagram account",
    });
  }
});

// Update Instagram account settings
router.put(
  "/:userId/instagram/:username",
  async (req: Request, res: Response) => {
    try {
      const { userId, username } = req.params;
      const updates = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.find(
        (acc) => acc.username === username,
      );
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      // Update account settings
      Object.assign(account, updates);
      await user.save();

      res.json({
        success: true,
        message: "Instagram account updated successfully",
        data: {
          username: account.username,
          isActive: account.isActive,
          stats: account.stats,
          settings: account.settings,
        },
      });

      logger.info(`Updated Instagram account ${username} for user ${userId}`);
    } catch (error) {
      logger.error("Error updating Instagram account:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update Instagram account",
      });
    }
  },
);

// Remove Instagram account
router.delete(
  "/:userId/instagram/:username",
  async (req: Request, res: Response) => {
    try {
      const { userId, username } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const accountIndex = user.instagramAccounts.findIndex(
        (acc) => acc.username === username,
      );
      if (accountIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      user.instagramAccounts.splice(accountIndex, 1);
      await user.save();

      res.json({
        success: true,
        message: "Instagram account removed successfully",
      });

      logger.info(`Removed Instagram account ${username} from user ${userId}`);
    } catch (error) {
      logger.error("Error removing Instagram account:", error);
      res.status(500).json({
        success: false,
        error: "Failed to remove Instagram account",
      });
    }
  },
);

// Start automation for specific account
router.post(
  "/:userId/instagram/:username/start",
  async (req: Request, res: Response) => {
    try {
      const { userId, username } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.find(
        (acc) => acc.username === username,
      );
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      // Start automation in background
      const igService = new InstagramService(account);

      // Don't await - run in background
      (async () => {
        try {
          await igService.initialize();
          const loginSuccess = await igService.login();

          if (loginSuccess) {
            await igService.runAutomation();
          }

          await igService.cleanup();
        } catch (error) {
          logger.error(`Automation error for ${username}:`, error);
        }
      })();

      account.isActive = true;
      await user.save();

      res.json({
        success: true,
        message: `Automation started for ${username}`,
      });

      logger.info(`Started automation for Instagram account ${username}`);
    } catch (error) {
      logger.error("Error starting automation:", error);
      res.status(500).json({
        success: false,
        error: "Failed to start automation",
      });
    }
  },
);

// Stop automation for specific account
router.post(
  "/:userId/instagram/:username/stop",
  async (req: Request, res: Response) => {
    try {
      const { userId, username } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.find(
        (acc) => acc.username === username,
      );
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      account.isActive = false;
      await user.save();

      res.json({
        success: true,
        message: `Automation stopped for ${username}`,
      });

      logger.info(`Stopped automation for Instagram account ${username}`);
    } catch (error) {
      logger.error("Error stopping automation:", error);
      res.status(500).json({
        success: false,
        error: "Failed to stop automation",
      });
    }
  },
);

// Get account stats
router.get(
  "/:userId/instagram/:username/stats",
  async (req: Request, res: Response) => {
    try {
      const { userId, username } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.find(
        (acc) => acc.username === username,
      );
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      // Get fresh stats
      try {
        const igService = new InstagramService(account);
        await igService.initialize();
        const loginSuccess = await igService.login();

        if (loginSuccess) {
          const freshStats = await igService.getAccountStats();
          account.stats = { ...account.stats, ...freshStats };
          await user.save();
        }

        await igService.cleanup();
      } catch (error) {
        logger.warn(`Failed to get fresh stats for ${username}:`, error);
      }

      res.json({
        success: true,
        data: {
          username: account.username,
          stats: account.stats,
          lastActivity: account.lastActivity,
          isActive: account.isActive,
        },
      });
    } catch (error) {
      logger.error("Error getting account stats:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get account stats",
      });
    }
  },
);

export default router;
