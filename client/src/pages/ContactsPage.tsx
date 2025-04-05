import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ContactsPage() {
  const [contactId, setContactId] = useState("");
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContact = async () => {
    if (!contactId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a contact ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/hubspot/contact", { contactId });
      const data = await response.json();
      setContactData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contact");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch contact",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Contact Management</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Get Contact by ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-id">HubSpot Contact ID</Label>
                <div className="flex gap-2">
                  <Input 
                    id="contact-id" 
                    placeholder="Enter Contact ID" 
                    value={contactId}
                    onChange={(e) => setContactId(e.target.value)}
                  />
                  <Button onClick={fetchContact} disabled={loading}>
                    {loading ? "Loading..." : "Fetch"}
                  </Button>
                </div>
              </div>
              
              {contactData && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                      {JSON.stringify(contactData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
