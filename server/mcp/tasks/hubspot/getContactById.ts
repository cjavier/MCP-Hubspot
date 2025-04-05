import { getHubspotContact } from "../../hubspotApi";
import { storage } from "../../../storage";

export async function getContactByIdTask(params: { contactId: string }) {
  const { contactId } = params;
  
  if (!contactId) {
    throw new Error("Contact ID is required");
  }
  
  // Get HubSpot API configuration
  const config = await storage.getHubspotConfig();
  
  if (!config || !config.token) {
    throw new Error("HubSpot API token not configured");
  }
  
  // Call the HubSpot API
  try {
    const contact = await getHubspotContact(contactId, config.token);
    return contact;
  } catch (error) {
    // Pass through any errors from the API call
    throw error;
  }
}
