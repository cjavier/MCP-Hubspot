import HubSpotConfig from "@/components/HubSpotConfig";
import TaskCard from "@/components/TaskCard";
import ServerStatus from "@/components/ServerStatus";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: serverStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/server/status'],
  });
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">MCP Server Configuration</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <HubSpotConfig />
        
        {/* Task Configuration Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Available MCP Tasks</h2>
          
          <TaskCard 
            name="hubspot:getContactById"
            description="Retrieves a HubSpot contact by ID"
            isActive={true}
            parameters={[
              {
                name: "contactId",
                type: "string",
                required: true,
                description: "The HubSpot ID of the contact to retrieve"
              }
            ]}
            responseSchema={{
              id: "string",
              properties: {
                email: "string",
                firstname: "string",
                lastname: "string",
                phone: "string",
                // Other contact properties
              },
              createdAt: "datetime",
              updatedAt: "datetime"
            }}
          />
          
          <Button variant="outline" className="mt-2">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Add New Task
          </Button>
        </div>
        
        <ServerStatus status={serverStatus} isLoading={statusLoading} />
      </div>
    </div>
  );
}
