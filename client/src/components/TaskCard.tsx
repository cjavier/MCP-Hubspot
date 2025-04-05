import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface TaskCardProps {
  name: string;
  description: string;
  isActive: boolean;
  parameters: Parameter[];
  responseSchema: Record<string, any>;
}

export default function TaskCard({ 
  name, 
  description, 
  isActive, 
  parameters, 
  responseSchema 
}: TaskCardProps) {
  const [contactId, setContactId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    if (!contactId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Contact ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setShowResults(true);
    
    try {
      const response = await apiRequest("POST", "/api/hubspot/contact", { contactId });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "An error occurred" });
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to test task",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="px-4 py-4 sm:px-6 flex items-center justify-between">
        <div>
          <h3 className="text-md font-medium text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}>
          {isActive ? "Active" : "Inactive"}
        </span>
      </CardHeader>
      
      <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Parameters</h4>
        
        {/* Parameter Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parameters.map((param) => (
                <tr key={param.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {param.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {param.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {param.required ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {param.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <h4 className="text-sm font-medium text-gray-700 mt-6 mb-2">Response Schema</h4>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <pre className="text-xs text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(responseSchema, null, 2)}
          </pre>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Test Task</h4>
          
          <div className="mt-1 flex items-start space-x-4">
            <div className="flex-1">
              <label htmlFor="contact-id" className="sr-only">Contact ID</label>
              <Input 
                type="text" 
                id="contact-id" 
                placeholder="Enter Contact ID" 
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleTest}
              disabled={isLoading}
              className="px-4 py-2"
            >
              {isLoading ? "Testing..." : "Test"}
            </Button>
          </div>
          
          {showResults && (
            <div className="mt-4 bg-gray-50 rounded-md p-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Result</h5>
              <pre className="bg-white p-3 rounded border border-gray-200 text-xs overflow-x-auto max-h-80">
                {isLoading ? "Loading..." : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
