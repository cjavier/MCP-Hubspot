import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createHubspotContact, testHubspotContact } from "@/lib/api";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const contactFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobtitle: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactsPage() {
  const [contactId, setContactId] = useState("");
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createdContact, setCreatedContact] = useState<any>(null);
  const { toast } = useToast();

  // Get Contact form
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
      const data = await testHubspotContact(contactId);
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
  
  // Create Contact form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      phone: "",
      company: "",
      jobtitle: "",
    },
  });
  
  const onSubmit = async (values: ContactFormValues) => {
    setCreateLoading(true);
    setCreatedContact(null);
    
    try {
      const data = await createHubspotContact(values);
      setCreatedContact(data);
      toast({
        title: "Success!",
        description: "Contact created successfully",
      });
      form.reset();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create contact",
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Contact Management</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <Tabs defaultValue="get-contact" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="get-contact">Get Contact</TabsTrigger>
            <TabsTrigger value="create-contact">Create Contact</TabsTrigger>
          </TabsList>
          
          {/* Tab: Get Contact by ID */}
          <TabsContent value="get-contact">
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
          </TabsContent>
          
          {/* Tab: Create Contact */}
          <TabsContent value="create-contact">
            <Card>
              <CardHeader>
                <CardTitle>Create New Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="jobtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Marketing Manager" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" disabled={createLoading} className="w-full md:w-auto">
                      {createLoading ? "Creating..." : "Create Contact"}
                    </Button>
                  </form>
                </Form>
                
                {createdContact && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Created Contact</h3>
                    <div className="bg-green-50 rounded-md p-4">
                      <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                        {JSON.stringify(createdContact, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
