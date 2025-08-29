module.exports = {
  apps: [
    {
      name: "riona-ai-agent",
      script: "build/index.js",
      instances: 1,
      exec_mode: "fork",

      // Environment
      env: {
        NODE_ENV: "development",
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Logs
      log_file: "logs/combined.log",
      out_file: "logs/out.log",
      error_file: "logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Advanced features
      watch: false,
      ignore_watch: ["node_modules", "logs", "*.log"],

      // Auto restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",

      // Memory and CPU
      max_memory_restart: "1G",
      kill_timeout: 5000,
      listen_timeout: 3000,

      // Health monitoring
      health_check_delay: 5000,
      health_check_grace_period: 3000,

      // Source map support
      source_map_support: true,

      // Instance variables
      instance_var: "INSTANCE_ID",

      // Advanced PM2 features
      pmx: true,
      automation: false,
      treekill: true,

      // Pre/Post hooks
      pre_build: "npm run build",
      post_build: 'echo "Build completed"',

      // Deployment config (for remote deployment)
      deploy: {
        production: {
          user: "deploy",
          host: ["your-server.com"],
          ref: "origin/main",
          repo: "git@github.com:riona-ai/agent.git",
          path: "/var/www/riona-ai-agent",
          "post-deploy":
            "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
        },
      },
    },
  ],
};
