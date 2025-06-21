import express, { Request, Response } from "express";
import { User, IUser, IInstagramAccount } from "../models/User";
import { InstagramService } from "../services/InstagramService";
import logger from "../config/logger";

const router = express.Router();

// Get all users
router.get("/", async (req: Request, res: Response) => {
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
      error: "Error fetching users",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, role, subscription, settings } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    const user = new User({
      name,
      email,
      role: role || "user",
      subscription: subscription || {
        plan: "free",
        accountsLimit: 1,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      settings: settings || {
        aiCharacter: "ArcanEdge.System.Agent",
        defaultHashtags: [],
        contentStyle: "professional",
        language: "es",
      },
    });

    await user.save();

    logger.info(`User created: ${user.name} (${user.email})`);

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    logger.error("Error creating user:", error);
    res.status(400).json({
      success: false,
      error: "Error creating user",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get user by ID
router.get("/:id", async (req: Request, res: Response) => {
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
    logger.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching user",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update user
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).select("-instagramAccounts.password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    logger.info(`User updated: ${user.name} (${user.email})`);

    res.json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    logger.error("Error updating user:", error);
    res.status(400).json({
      success: false,
      error: "Error updating user",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete user
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    logger.info(`User deleted: ${user.name} (${user.email})`);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting user",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Instagram Accounts Management

// Add Instagram account to user
router.post("/:userId/accounts", async (req: Request, res: Response) => {
  try {
    const { username, password, settings } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check account limit
    if (user.instagramAccounts.length >= user.subscription.accountsLimit) {
      return res.status(400).json({
        success: false,
        error: "Account limit reached for this subscription",
        currentAccounts: user.instagramAccounts.length,
        limit: user.subscription.accountsLimit,
      });
    }

    // Check if account already exists
    const existingAccount = user.instagramAccounts.find(
      (acc) => acc.username === username,
    );
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        error: "Instagram account already exists for this user",
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
        autoLike: settings?.autoLike || true,
        autoComment: settings?.autoComment || true,
        autoFollow: settings?.autoFollow || false,
        autoDM: settings?.autoDM || false,
        maxLikesPerHour: settings?.maxLikesPerHour || 60,
        maxCommentsPerHour: settings?.maxCommentsPerHour || 30,
        maxFollowsPerHour: settings?.maxFollowsPerHour || 20,
        targetHashtags: settings?.targetHashtags || [],
        blacklistedUsers: settings?.blacklistedUsers || [],
      },
    };

    user.instagramAccounts.push(newAccount);
    user.updatedAt = new Date();
    await user.save();

    logger.info(`Instagram account added: ${username} for user ${user.name}`);

    res.status(201).json({
      success: true,
      data: newAccount,
      message: "Instagram account added successfully",
    });
  } catch (error) {
    logger.error("Error adding Instagram account:", error);
    res.status(400).json({
      success: false,
      error: "Error adding Instagram account",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get all Instagram accounts across all users
router.get("/accounts/all", async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("name email instagramAccounts");
    const allAccounts: any[] = [];

    users.forEach((user) => {
      user.instagramAccounts.forEach((account) => {
        allAccounts.push({
          ...account.toObject(),
          userName: user.name,
          userEmail: user.email,
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
    logger.error("Error fetching all accounts:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching accounts",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get user's Instagram accounts
router.get("/:userId/accounts", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "instagramAccounts",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove passwords from response
    const accountsWithoutPasswords = user.instagramAccounts.map((account) => {
      const accountObj = account.toObject();
      delete accountObj.password;
      return accountObj;
    });

    res.json({
      success: true,
      data: accountsWithoutPasswords,
      count: accountsWithoutPasswords.length,
    });
  } catch (error) {
    logger.error("Error fetching user accounts:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching user accounts",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update Instagram account
router.put(
  "/:userId/accounts/:accountId",
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.id(req.params.accountId);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      // Update account fields
      Object.keys(req.body).forEach((key) => {
        if (key === "settings" && typeof req.body[key] === "object") {
          account.settings = { ...account.settings, ...req.body[key] };
        } else if (key !== "_id") {
          (account as any)[key] = req.body[key];
        }
      });

      user.updatedAt = new Date();
      await user.save();

      logger.info(`Instagram account updated: ${account.username}`);

      res.json({
        success: true,
        data: account,
        message: "Instagram account updated successfully",
      });
    } catch (error) {
      logger.error("Error updating Instagram account:", error);
      res.status(400).json({
        success: false,
        error: "Error updating Instagram account",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Delete Instagram account
router.delete(
  "/:userId/accounts/:accountId",
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.id(req.params.accountId);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      const username = account.username;
      user.instagramAccounts.pull(req.params.accountId);
      user.updatedAt = new Date();
      await user.save();

      logger.info(`Instagram account deleted: ${username}`);

      res.json({
        success: true,
        message: "Instagram account deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting Instagram account:", error);
      res.status(500).json({
        success: false,
        error: "Error deleting Instagram account",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Account Actions

// Test Instagram account login
router.post(
  "/:userId/accounts/:accountId/test",
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.id(req.params.accountId);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      logger.info(`Testing Instagram login for: ${account.username}`);

      const service = new InstagramService(account);
      await service.initialize();
      const loginSuccess = await service.login();

      if (loginSuccess) {
        // Update last activity
        account.lastActivity = new Date();
        await user.save();

        await service.cleanup();

        res.json({
          success: true,
          message: "Instagram login test successful",
          account: account.username,
        });
      } else {
        await service.cleanup();

        res.status(400).json({
          success: false,
          error: "Instagram login test failed",
          message: "Invalid credentials or account restrictions",
        });
      }
    } catch (error) {
      logger.error("Error testing Instagram account:", error);
      res.status(500).json({
        success: false,
        error: "Error testing Instagram account",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Get account statistics
router.get(
  "/:userId/accounts/:accountId/stats",
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.id(req.params.accountId);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      logger.info(`Fetching stats for: ${account.username}`);

      const service = new InstagramService(account);
      await service.initialize();
      await service.login();

      const stats = await service.getAccountStats();

      // Update stored stats
      account.stats = { ...account.stats, ...stats };
      account.lastActivity = new Date();
      await user.save();

      await service.cleanup();

      res.json({
        success: true,
        data: stats,
        account: account.username,
      });
    } catch (error) {
      logger.error("Error fetching account stats:", error);
      res.status(500).json({
        success: false,
        error: "Error fetching account stats",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Run automation for specific account
router.post(
  "/:userId/accounts/:accountId/automation",
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const account = user.instagramAccounts.id(req.params.accountId);
      if (!account) {
        return res.status(404).json({
          success: false,
          error: "Instagram account not found",
        });
      }

      if (!account.isActive) {
        return res.status(400).json({
          success: false,
          error: "Account is not active",
        });
      }

      logger.info(`Running automation for: ${account.username}`);

      const service = new InstagramService(account);
      await service.initialize();
      await service.login();

      await service.runAutomation();

      // Update last activity
      account.lastActivity = new Date();
      await user.save();

      await service.cleanup();

      res.json({
        success: true,
        message: "Automation completed successfully",
        account: account.username,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error running automation:", error);
      res.status(500).json({
        success: false,
        error: "Error running automation",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Bulk operations

// Activate/deactivate multiple accounts
router.post("/accounts/bulk-toggle", async (req: Request, res: Response) => {
  try {
    const { accountIds, isActive } = req.body;

    if (!Array.isArray(accountIds)) {
      return res.status(400).json({
        success: false,
        error: "accountIds must be an array",
      });
    }

    const users = await User.find({
      "instagramAccounts._id": { $in: accountIds },
    });
    let updatedCount = 0;

    for (const user of users) {
      let hasChanges = false;
      user.instagramAccounts.forEach((account) => {
        if (accountIds.includes(account._id.toString())) {
          account.isActive = isActive;
          hasChanges = true;
          updatedCount++;
        }
      });

      if (hasChanges) {
        user.updatedAt = new Date();
        await user.save();
      }
    }

    logger.info(
      `Bulk ${isActive ? "activated" : "deactivated"} ${updatedCount} accounts`,
    );

    res.json({
      success: true,
      message: `${updatedCount} accounts ${isActive ? "activated" : "deactivated"}`,
      updatedCount,
    });
  } catch (error) {
    logger.error("Error in bulk toggle:", error);
    res.status(500).json({
      success: false,
      error: "Error in bulk operation",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get user analytics
router.get("/:userId/analytics", async (req: Request, res: Response) => {
  try {
    const { timeRange = "24h" } = req.query;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Calculate analytics for user's accounts
    const analytics = {
      timeRange,
      totalAccounts: user.instagramAccounts.length,
      activeAccounts: user.instagramAccounts.filter((acc) => acc.isActive)
        .length,
      totalFollowers: user.instagramAccounts.reduce(
        (sum, acc) => sum + acc.stats.followers,
        0,
      ),
      totalPosts: user.instagramAccounts.reduce(
        (sum, acc) => sum + acc.stats.posts,
        0,
      ),
      averageEngagement:
        user.instagramAccounts.length > 0
          ? user.instagramAccounts.reduce(
              (sum, acc) => sum + acc.stats.engagement,
              0,
            ) / user.instagramAccounts.length
          : 0,
      accounts: user.instagramAccounts.map((account) => ({
        username: account.username,
        isActive: account.isActive,
        stats: account.stats,
        lastActivity: account.lastActivity,
      })),
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error("Error fetching user analytics:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching analytics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
