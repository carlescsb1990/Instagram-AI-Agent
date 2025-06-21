import express, { Request, Response } from "express";
import logger from "../config/logger";

const router = express.Router();

// Mock data for development
const mockUsers = [
  {
    _id: "1",
    name: "Admin User",
    email: "admin@riona.ai",
    role: "admin",
    subscription: { plan: "enterprise", accountsLimit: 999 },
    instagramAccounts: [],
    createdAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    name: "Demo User",
    email: "demo@riona.ai",
    role: "user",
    subscription: { plan: "basic", accountsLimit: 5 },
    instagramAccounts: [],
    createdAt: new Date("2024-01-20"),
  },
];

// Get all users
router.get("/", (req: Request, res: Response) => {
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
      error: "Error fetching users",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create new user
router.post("/", (req: Request, res: Response) => {
  try {
    const { name, email, role, subscription } = req.body;

    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      role: role || "user",
      subscription: subscription || {
        plan: "free",
        accountsLimit: 1,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      instagramAccounts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.push(newUser);

    logger.info(`User created: ${newUser.name} (${newUser.email})`);

    res.status(201).json({
      success: true,
      data: newUser,
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
router.get("/:id", (req: Request, res: Response) => {
  try {
    const user = mockUsers.find((u) => u._id === req.params.id);
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
router.put("/:id", (req: Request, res: Response) => {
  try {
    const userIndex = mockUsers.findIndex((u) => u._id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...req.body,
      updatedAt: new Date(),
    };

    logger.info(
      `User updated: ${mockUsers[userIndex].name} (${mockUsers[userIndex].email})`,
    );

    res.json({
      success: true,
      data: mockUsers[userIndex],
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
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const userIndex = mockUsers.findIndex((u) => u._id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const deletedUser = mockUsers.splice(userIndex, 1)[0];
    logger.info(`User deleted: ${deletedUser.name} (${deletedUser.email})`);

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

export default router;
