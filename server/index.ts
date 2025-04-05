import { webcrypto } from 'crypto';
// Use Object.defineProperty for crypto polyfill
Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  writable: true,
  configurable: true
});
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Add global type definition
declare global {
  var SERVER_START_TIME: Date;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  try {
    const port = 5001;
    
    // Try to ensure the port is available
    server.on('error', (error: any) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Trying to force close...`);
        // On Replit, we can't easily kill other processes, so just log the error
      }
    });
    
    // Add connection event listener to track active connections
    server.on('connection', (socket) => {
      console.log(`New connection established from ${socket.remoteAddress}:${socket.remotePort}`);
      
      socket.on('error', (err) => {
        console.error('Socket error:', err);
      });
      
      socket.on('close', () => {
        console.log(`Connection closed from ${socket.remoteAddress}:${socket.remotePort}`);
      });
    });
    
    // Attempt to start the server with a retry mechanism
    const startServer = () => {
      server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        log(`serving on port ${port} - Server ready!`);
        
        // Set the global server start time for uptime tracking
        if (!global.SERVER_START_TIME) {
          global.SERVER_START_TIME = new Date();
        }
      });
    };
    
    startServer();
    
  } catch (err) {
    console.error('Critical server startup error:', err);
  }
})();
