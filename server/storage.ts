import { 
  User, 
  InsertUser, 
  HubspotConfig, 
  InsertHubspotConfig, 
  McpRequestLog, 
  InsertMcpRequestLog 
} from "@shared/schema";

// Extend the storage interface with new methods
export interface IStorage {
  // User methods (from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // HubSpot methods
  getHubspotConfig(): Promise<HubspotConfig | undefined>;
  setHubspotConfig(config: { token: string }): Promise<HubspotConfig>;

  // MCP logs methods
  logMcpRequest(log: InsertMcpRequestLog): Promise<McpRequestLog>;
  getLatestMcpLogs(limit: number): Promise<McpRequestLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private hubspotConfigs: Map<number, HubspotConfig>;
  private mcpLogs: Map<number, McpRequestLog>;
  userCurrentId: number;
  configCurrentId: number;
  logCurrentId: number;

  constructor() {
    this.users = new Map();
    this.hubspotConfigs = new Map();
    this.mcpLogs = new Map();
    this.userCurrentId = 1;
    this.configCurrentId = 1;
    this.logCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // HubSpot methods
  async getHubspotConfig(): Promise<HubspotConfig | undefined> {
    // Return the most recent config if any exists
    const configs = Array.from(this.hubspotConfigs.values());
    return configs.length > 0 
      ? configs.sort((a, b) => {
          return b.id - a.id;
        })[0] 
      : undefined;
  }

  async setHubspotConfig(insertConfig: { token: string }): Promise<HubspotConfig> {
    const id = this.configCurrentId++;
    const now = new Date();
    const config: HubspotConfig = { 
      ...insertConfig, 
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.hubspotConfigs.set(id, config);
    return config;
  }

  // MCP logs methods
  async logMcpRequest(insertLog: InsertMcpRequestLog): Promise<McpRequestLog> {
    const id = this.logCurrentId++;
    const now = new Date();
    const log: McpRequestLog = {
      ...insertLog,
      id,
      createdAt: now,
    };
    this.mcpLogs.set(id, log);
    return log;
  }

  async getLatestMcpLogs(limit: number): Promise<McpRequestLog[]> {
    return Array.from(this.mcpLogs.values())
      .sort((a, b) => {
        // Sort by creation date, most recent first
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(0, limit);
  }
}

// Set the server start time globally
declare global {
  var SERVER_START_TIME: Date;
}

global.SERVER_START_TIME = new Date();

export const storage = new MemStorage();
