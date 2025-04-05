import { Server } from "http";
import { WebSocketServer } from "ws";
import { runner } from "./runner";
import { storage } from "../storage";

// Initialize the MCP server
export function startMcpServer(httpServer: Server) {
  // Create a WebSocket server instance
  const wss = new WebSocketServer({ server: httpServer });

  // Handle WebSocket connections
  wss.on("connection", (ws) => {
    console.log("MCP client connected");

    // Listen for messages from the client
    ws.on("message", async (message) => {
      let request;
      try {
        request = JSON.parse(message.toString());
        console.log("Received MCP request:", request);

        // Handle different types of requests
        if (request.type === "describe") {
          // Respond with task descriptions
          const taskManifests = runner.describe();
          const response = {
            type: "describe",
            taskManifests,
          };
          ws.send(JSON.stringify(response));
        } else if (request.type === "perform") {
          // Execute a task
          const { taskName, parameters } = request;
          try {
            // Log the request
            await storage.logMcpRequest({
              taskName,
              params: JSON.stringify(parameters),
              result: "",
              error: "",
              successful: false,
            });

            // Execute the task
            const result = await runner.perform(taskName, parameters);

            // Log the successful result
            await storage.logMcpRequest({
              taskName,
              params: JSON.stringify(parameters),
              result: JSON.stringify(result),
              error: "",
              successful: true,
            });

            // Send response back to client
            const response = {
              type: "perform",
              result,
            };
            ws.send(JSON.stringify(response));
          } catch (error) {
            // Log the error
            await storage.logMcpRequest({
              taskName,
              params: JSON.stringify(parameters),
              result: "",
              error: error instanceof Error ? error.message : "Unknown error",
              successful: false,
            });

            // Send error response
            const response = {
              type: "perform",
              error: {
                message: error instanceof Error ? error.message : "Unknown error occurred",
              },
            };
            ws.send(JSON.stringify(response));
          }
        }
      } catch (error) {
        console.error("Error processing MCP message:", error);
        const errorResponse = {
          type: "error",
          error: {
            message: error instanceof Error ? error.message : "Error processing request",
          },
        };
        ws.send(JSON.stringify(errorResponse));
      }
    });

    // Handle disconnections
    ws.on("close", () => {
      console.log("MCP client disconnected");
    });
  });

  console.log("MCP server started");
}
