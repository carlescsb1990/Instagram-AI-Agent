const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Basic API endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

app.get("/api/social", (req, res) => {
  res.json({
    success: true,
    data: {
      totalAccounts: 1,
      activeAutomations: 1,
      platforms: {
        instagram: {
          status: "active",
          configured: true,
          accounts: 1,
        },
      },
      lastExecution: new Date().toISOString(),
    },
  });
});

app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "1",
        name: "Usuario Principal",
        email: "usuario@riona.ai",
        role: "admin",
        subscription: { plan: "premium", accountsLimit: 50 },
        instagramAccounts: [],
        createdAt: new Date(),
      },
    ],
  });
});

app.get("/api/accounts", (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

app.post("/api/accounts", (req, res) => {
  const { username, password, settings } = req.body;

  const newAccount = {
    _id: Date.now().toString(),
    username,
    platform: "instagram",
    isActive: true,
    status: "active",
    created: new Date().toISOString(),
    settings: settings || {
      autoLike: true,
      autoComment: true,
      autoFollow: false,
      maxLikesPerHour: 30,
      targetHashtags: ["technology", "ai"],
    },
    stats: {
      followers: Math.floor(Math.random() * 5000) + 1000,
      following: Math.floor(Math.random() * 2000) + 500,
      engagement: (Math.random() * 5 + 3).toFixed(1),
    },
  };

  res.status(201).json({
    success: true,
    data: newAccount,
    message: "Instagram account added successfully",
  });
});

app.post("/api/social/instagram/automation", (req, res) => {
  const { accountId, username, settings } = req.body;

  // Simulate automation results
  const simulatedResults = {
    accountId: accountId || username,
    executionId: Date.now().toString(),
    startTime: new Date().toISOString(),
    actions: {
      likes: Math.floor(Math.random() * 20) + 10,
      comments: Math.floor(Math.random() * 8) + 3,
      follows: Math.floor(Math.random() * 5) + 1,
    },
    status: "completed",
    duration: Math.floor(Math.random() * 300) + 60,
    errors: 0,
    warnings: [],
    logs: [
      "✅ Browser initialized",
      "✅ Successfully logged into Instagram",
      `🔍 Searching hashtag: #${settings?.targetHashtags?.[0] || "technology"}`,
      "✅ Automation completed successfully",
    ],
  };

  res.json({
    success: true,
    data: simulatedResults,
    message: `Automation completed: ${simulatedResults.actions.likes} likes, ${simulatedResults.actions.comments} comments`,
  });
});

app.post("/api/generate", (req, res) => {
  const { type, context, character } = req.body;

  const mockComments = {
    "arcane-edge": `🚀 Increíble innovación en ${context}! Este avance podría revolucionar completamente la industria. La convergencia de tecnologías emergentes está creando oportunidades sin precedentes.`,
    elon: `El futuro es ahora. ${context} cambiará todo lo que conocemos. Mars next! 🔴 La humanidad está destinada a ser una especie multiplanetaria.`,
    general: `¡Excelente contenido sobre ${context}! Me encanta cómo la tecnología continúa evolucionando. Definitivamente seguiré de cerca estos desarrollos. 👏`,
  };

  const content = mockComments[character] || mockComments["general"];

  res.json({
    success: true,
    data: {
      content: content,
      type: type || "comment",
      timestamp: new Date().toISOString(),
    },
  });
});

// Serve the main app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Riona AI Agent server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});
