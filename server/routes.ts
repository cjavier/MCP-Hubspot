import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startMcpServer } from "./mcp";
import { getHubspotContact, createHubspotContact } from "./mcp/hubspotApi";

export async function registerRoutes(app: Express): Promise<Server> {
  // HubSpot API configuration routes
  app.get('/api/hubspot/config', async (req: Request, res: Response) => {
    try {
      const config = await storage.getHubspotConfig();
      res.json({
        tokenSet: !!config,
        connected: !!config,
      });
    } catch (error) {
      console.error("Error getting HubSpot config:", error);
      res.status(500).json({ error: "Failed to get HubSpot configuration" });
    }
  });

  app.post('/api/hubspot/config', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }
      
      // Simple validation - just checking that the token exists
      const config = await storage.setHubspotConfig({ token });
      res.json({ success: true });
    } catch (error) {
      console.error("Error setting HubSpot config:", error);
      res.status(500).json({ error: "Failed to update HubSpot configuration" });
    }
  });

  // Get HubSpot Contact endpoint
  app.post('/api/hubspot/contact', async (req: Request, res: Response) => {
    try {
      const { contactId } = req.body;
      
      if (!contactId) {
        return res.status(400).json({ error: "Contact ID is required" });
      }
      
      const config = await storage.getHubspotConfig();
      
      if (!config) {
        return res.status(400).json({ error: "HubSpot API token not configured" });
      }
      
      const contact = await getHubspotContact(contactId, config.token);
      res.json(contact);
    } catch (error) {
      console.error("Error fetching HubSpot contact:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch contact" 
      });
    }
  });
  
  // Create HubSpot Contact endpoint
  app.post('/api/hubspot/create-contact', async (req: Request, res: Response) => {
    try {
      const { email, firstname, lastname, phone, company, jobtitle, ...otherProps } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      const config = await storage.getHubspotConfig();
      
      if (!config) {
        return res.status(400).json({ error: "HubSpot API token not configured" });
      }
      
      // Prepare contact properties
      const contactProperties = {
        email,
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(phone && { phone }),
        ...(company && { company }),
        ...(jobtitle && { jobtitle }),
        ...otherProps
      };
      
      const contact = await createHubspotContact(contactProperties, config.token);
      res.json(contact);
    } catch (error) {
      console.error("Error creating HubSpot contact:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to create contact" 
      });
    }
  });

  // Server status endpoint
  app.get('/api/server/status', async (req: Request, res: Response) => {
    try {
      const startTime = global.SERVER_START_TIME || new Date();
      const currentTime = new Date();
      const uptime = formatUptime(currentTime.getTime() - startTime.getTime());
      
      const logs = await storage.getLatestMcpLogs(5);
      const totalRequests = logs.length;
      let lastRequest = "Never";
      if (logs.length > 0 && logs[0].createdAt) {
        lastRequest = formatTimeAgo(logs[0].createdAt);
      }
      
      res.json({
        status: "active",
        uptime,
        totalRequests,
        lastRequest,
        url: `http://${req.headers.host}`,
      });
    } catch (error) {
      console.error("Error getting server status:", error);
      res.status(500).json({ error: "Failed to get server status" });
    }
  });

  const httpServer = createServer(app);

  // Start the MCP server
  startMcpServer(httpServer);

  return httpServer;
}

// Helper functions
function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} days, ${hours % 24} hours`;
  } else if (hours > 0) {
    return `${hours} hours, ${minutes % 60} minutes`;
  } else if (minutes > 0) {
    return `${minutes} minutes, ${seconds % 60} seconds`;
  } else {
    return `${seconds} seconds`;
  }
}

function formatTimeAgo(date: Date | null): string {
  if (!date) return "Never";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  } else if (diffSeconds < 3600) {
    return `${Math.floor(diffSeconds / 60)} minutes ago`;
  } else if (diffSeconds < 86400) {
    return `${Math.floor(diffSeconds / 3600)} hours ago`;
  } else {
    return `${Math.floor(diffSeconds / 86400)} days ago`;
  }
}
