import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// HubSpot Config Schema
export const hubspotConfig = pgTable("hubspot_config", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHubspotConfigSchema = createInsertSchema(hubspotConfig).pick({
  token: true,
});

export type InsertHubspotConfig = z.infer<typeof insertHubspotConfigSchema>;
export type HubspotConfig = typeof hubspotConfig.$inferSelect;

// MCP Request Logs Schema
export const mcpRequestLogs = pgTable("mcp_request_logs", {
  id: serial("id").primaryKey(),
  taskName: text("task_name").notNull(),
  params: text("params").notNull(),
  result: text("result"),
  error: text("error"),
  successful: boolean("successful").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMcpRequestLogSchema = createInsertSchema(mcpRequestLogs).pick({
  taskName: true,
  params: true,
  result: true,
  error: true,
  successful: true,
});

export type InsertMcpRequestLog = z.infer<typeof insertMcpRequestLogSchema>;
export type McpRequestLog = typeof mcpRequestLogs.$inferSelect;
