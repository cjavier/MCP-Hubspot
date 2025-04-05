import { createHubspotContact } from "../../hubspotApi";
import { storage } from "../../../storage";

interface CreateContactParams {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  jobtitle?: string;
  [key: string]: string | undefined;
}

export async function createContactTask(params: CreateContactParams) {
  const { email, ...otherProperties } = params;
  
  if (!email) {
    throw new Error("Email is required");
  }
  
  // Get HubSpot API configuration
  const config = await storage.getHubspotConfig();
  
  if (!config || !config.token) {
    throw new Error("HubSpot API token not configured");
  }
  
  // Call the HubSpot API to create the contact
  try {
    const contactProperties = {
      email,
      ...otherProperties
    };
    
    const contact = await createHubspotContact(contactProperties, config.token);
    return contact;
  } catch (error) {
    // Pass through any errors from the API call
    throw error;
  }
}