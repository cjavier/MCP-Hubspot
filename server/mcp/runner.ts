import { getContactByIdTask } from "./tasks/hubspot/getContactById";
import { createContactTask } from "./tasks/hubspot/createContact";

// TaskManifest interface based on MCP specification
interface TaskParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface TaskManifest {
  name: string;
  description: string;
  parameters: TaskParam[];
}

// Task execution function type
type TaskFunction = (params: any) => Promise<any>;

// Task registry
class TaskRunner {
  private tasks: Map<string, { manifest: TaskManifest; fn: TaskFunction }>;

  constructor() {
    this.tasks = new Map();
  }

  // Register a new task
  register(manifest: TaskManifest, fn: TaskFunction) {
    this.tasks.set(manifest.name, { manifest, fn });
    console.error(`Registered task: ${manifest.name}`);
  }

  // Get all task manifests
  describe(): TaskManifest[] {
    return Array.from(this.tasks.values()).map(task => task.manifest);
  }

  // Execute a task
  async perform(taskName: string, params: any): Promise<any> {
    const task = this.tasks.get(taskName);
    
    if (!task) {
      throw new Error(`Task not found: ${taskName}`);
    }
    
    // Validate required parameters
    const missingParams = task.manifest.parameters
      .filter(param => param.required && (params[param.name] === undefined || params[param.name] === null))
      .map(param => param.name);
    
    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
    }
    
    // Execute the task function
    return await task.fn(params);
  }
}

// Create and export the runner instance
export const runner = new TaskRunner();

// Register tasks
runner.register(
  {
    name: "hubspot:getContactById",
    description: "Retrieves a HubSpot contact by ID",
    parameters: [
      {
        name: "contactId",
        type: "string",
        description: "The HubSpot ID of the contact to retrieve",
        required: true,
      },
    ],
  },
  getContactByIdTask
);

// Register create contact task
runner.register(
  {
    name: "hubspot:createContact",
    description: "Creates a new contact in HubSpot",
    parameters: [
      {
        name: "email",
        type: "string",
        description: "Email address of the contact (required)",
        required: true,
      },
      {
        name: "firstname",
        type: "string",
        description: "First name of the contact",
        required: false,
      },
      {
        name: "lastname",
        type: "string",
        description: "Last name of the contact",
        required: false,
      },
      {
        name: "phone",
        type: "string",
        description: "Phone number of the contact",
        required: false,
      },
      {
        name: "company",
        type: "string",
        description: "Company name of the contact",
        required: false,
      },
      {
        name: "jobtitle",
        type: "string",
        description: "Job title of the contact",
        required: false,
      }
    ],
  },
  createContactTask
);
