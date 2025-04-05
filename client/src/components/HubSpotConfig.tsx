import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function HubSpotConfig() {
  const [apiToken, setApiToken] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  interface ConfigData {
    tokenSet?: boolean;
    connected?: boolean;
  }
  
  const { data: configData, isLoading } = useQuery<ConfigData>({
    queryKey: ['/api/hubspot/config'],
    initialData: { tokenSet: false, connected: false }
  });
  
  const updateConfig = useMutation({
    mutationFn: async (token: string) => {
      return apiRequest('POST', '/api/hubspot/config', { token });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "HubSpot API token updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hubspot/config'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update token",
        variant: "destructive",
      });
    }
  });
  
  const handleUpdateToken = () => {
    if (!apiToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API token",
        variant: "destructive",
      });
      return;
    }
    
    updateConfig.mutate(apiToken);
    setApiToken("");
  };
  
  const isConnected = configData?.connected;
  
  return (
    <Card>
      <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">HubSpot API Configuration</h2>
          <p className="mt-1 text-sm text-gray-500">Configure your HubSpot API Private App token</p>
        </div>
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isConnected 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isConnected ? "Connected" : "Not Connected"}
        </span>
      </CardHeader>
      
      <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="api-token">Private App Token</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input 
                type="password" 
                id="api-token" 
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder={configData?.tokenSet ? "••••••••••••••••••••••••••••••••••" : "Enter your token"}
                className="flex-1"
              />
              <Button 
                onClick={handleUpdateToken}
                className="ml-3"
                disabled={updateConfig.isPending}
              >
                {updateConfig.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter your HubSpot Private App token. See 
              <a 
                href="https://developers.hubspot.com/docs/api/private-apps" 
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-medium text-primary underline underline-offset-4"
              >
                documentation
              </a> 
              for details on creating a Private App.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
