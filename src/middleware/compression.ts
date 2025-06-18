import { Request, Response, NextFunction } from "express";
import zlib from "zlib";

export const compressionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const acceptEncoding = req.headers["accept-encoding"] || "";

  // Check if client accepts gzip
  if (acceptEncoding.includes("gzip")) {
    res.setHeader("Content-Encoding", "gzip");

    // Override res.json to compress responses
    const originalJson = res.json.bind(res);
    res.json = function (obj: any) {
      const jsonString = JSON.stringify(obj);
      const compressed = zlib.gzipSync(jsonString);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Length", compressed.length.toString());
      return res.send(compressed);
    };
  }

  next();
};

export default compressionMiddleware;
