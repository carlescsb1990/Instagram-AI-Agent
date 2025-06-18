import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

interface RequestMetrics {
  totalRequests: number;
  errorRequests: number;
  averageResponseTime: number;
  requestsByEndpoint: { [key: string]: number };
  requestsByMethod: { [key: string]: number };
  statusCodes: { [key: string]: number };
}

// In-memory metrics store (in production, use Redis or similar)
let metrics: RequestMetrics = {
  totalRequests: 0,
  errorRequests: 0,
  averageResponseTime: 0,
  requestsByEndpoint: {},
  requestsByMethod: {},
  statusCodes: {},
};

let responseTimes: number[] = [];

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();

  // Track request
  metrics.totalRequests++;

  // Track by endpoint (normalize to avoid explosion)
  const endpoint = normalizeEndpoint(req.path);
  metrics.requestsByEndpoint[endpoint] =
    (metrics.requestsByEndpoint[endpoint] || 0) + 1;

  // Track by method
  metrics.requestsByMethod[req.method] =
    (metrics.requestsByMethod[req.method] || 0) + 1;

  // Track response
  res.on("finish", () => {
    const responseTime = Date.now() - startTime;

    // Track status codes
    const statusCode = res.statusCode.toString();
    metrics.statusCodes[statusCode] =
      (metrics.statusCodes[statusCode] || 0) + 1;

    // Track errors
    if (res.statusCode >= 400) {
      metrics.errorRequests++;
    }

    // Track response times (keep last 1000 for average calculation)
    responseTimes.push(responseTime);
    if (responseTimes.length > 1000) {
      responseTimes = responseTimes.slice(-1000);
    }

    // Calculate average response time
    metrics.averageResponseTime =
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    // Log slow requests
    if (responseTime > 1000) {
      logger.warn(
        `Slow request detected: ${req.method} ${req.path} took ${responseTime}ms`,
      );
    }
  });

  next();
};

export const rateLimitingMiddleware = (
  maxRequests: number = 100,
  windowMs: number = 60000,
) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || "unknown";
    const now = Date.now();

    const clientData = requests.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      // Reset or initialize
      requests.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (clientData.count >= maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${clientId}`);
      return res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
      });
    }

    clientData.count++;
    next();
  };
};

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = req.headers["x-request-id"] || generateRequestId();
  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};

export const getMetrics = (): RequestMetrics => {
  return { ...metrics };
};

export const resetMetrics = () => {
  metrics = {
    totalRequests: 0,
    errorRequests: 0,
    averageResponseTime: 0,
    requestsByEndpoint: {},
    requestsByMethod: {},
    statusCodes: {},
  };
  responseTimes = [];
};

function normalizeEndpoint(path: string): string {
  // Normalize paths with IDs to avoid metric explosion
  return path
    .replace(/\/\d+/g, "/:id")
    .replace(/\/[a-f0-9-]{36}/g, "/:uuid")
    .replace(/\/[a-f0-9]{24}/g, "/:objectId");
}

function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default {
  metricsMiddleware,
  rateLimitingMiddleware,
  requestIdMiddleware,
  getMetrics,
  resetMetrics,
};
