import { Router, Request, Response } from "express";
import { getMetrics, resetMetrics } from "../middleware/monitoring";
import logger from "../config/logger";

const router = Router();

// Get system metrics
router.get("/", (req: Request, res: Response) => {
  try {
    const metrics = getMetrics();
    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      data: {
        system: {
          uptime: process.uptime(),
          memory: {
            rss: memoryUsage.rss,
            heapTotal: memoryUsage.heapTotal,
            heapUsed: memoryUsage.heapUsed,
            external: memoryUsage.external,
            usage: {
              rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
              heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
              heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
            },
          },
          cpu: process.cpuUsage(),
          platform: process.platform,
          nodeVersion: process.version,
        },
        api: {
          totalRequests: metrics.totalRequests,
          errorRequests: metrics.errorRequests,
          successRate:
            metrics.totalRequests > 0
              ? (
                  ((metrics.totalRequests - metrics.errorRequests) /
                    metrics.totalRequests) *
                  100
                ).toFixed(2) + "%"
              : "100%",
          averageResponseTime: Math.round(metrics.averageResponseTime) + "ms",
          requestsByMethod: metrics.requestsByMethod,
          requestsByEndpoint: metrics.requestsByEndpoint,
          statusCodes: metrics.statusCodes,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Error getting metrics:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to get system metrics",
    });
  }
});

// Reset metrics (useful for testing)
router.post("/reset", (req: Request, res: Response) => {
  try {
    resetMetrics();
    logger.info("System metrics reset");

    res.json({
      success: true,
      message: "Metrics reset successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error resetting metrics:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to reset metrics",
    });
  }
});

// Prometheus-style metrics (for monitoring systems)
router.get("/prometheus", (req: Request, res: Response) => {
  try {
    const metrics = getMetrics();
    const memoryUsage = process.memoryUsage();

    const prometheusMetrics = `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${metrics.totalRequests}

# HELP http_request_errors_total Total number of HTTP error requests
# TYPE http_request_errors_total counter
http_request_errors_total ${metrics.errorRequests}

# HELP http_request_duration_average Average HTTP request duration in milliseconds
# TYPE http_request_duration_average gauge
http_request_duration_average ${metrics.averageResponseTime}

# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${process.uptime()}

# HELP process_memory_rss_bytes Process memory RSS in bytes
# TYPE process_memory_rss_bytes gauge
process_memory_rss_bytes ${memoryUsage.rss}

# HELP process_memory_heap_used_bytes Process memory heap used in bytes
# TYPE process_memory_heap_used_bytes gauge
process_memory_heap_used_bytes ${memoryUsage.heapUsed}

# HELP process_memory_heap_total_bytes Process memory heap total in bytes
# TYPE process_memory_heap_total_bytes gauge
process_memory_heap_total_bytes ${memoryUsage.heapTotal}
`.trim();

    res.set("Content-Type", "text/plain");
    res.send(prometheusMetrics);
  } catch (error) {
    logger.error("Error generating Prometheus metrics:", error);
    res.status(500).send("# Error generating metrics");
  }
});

export default router;
