import axios from "axios";

// Define contact response interface
interface HubSpotContactResponse {
  id: string;
  properties: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Retrieves a contact from HubSpot by ID
 * 
 * @param contactId The HubSpot contact ID
 * @param token The HubSpot Private App token
 * @returns Contact data from HubSpot
 */
export async function getHubspotContact(contactId: string, token: string): Promise<HubSpotContactResponse> {
  try {
    // Make the API request to HubSpot
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          properties: ['email', 'firstname', 'lastname', 'phone', 'company', 'jobtitle', 'createdate', 'lastmodifieddate']
        }
      }
    );
    
    // Extract the contact data
    const contact = response.data;
    
    // Format the response to match our interface
    return {
      id: contact.id,
      properties: contact.properties,
      createdAt: contact.properties.createdate,
      updatedAt: contact.properties.lastmodifieddate
    };
  } catch (error) {
    // Handle errors and provide meaningful messages
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const responseData = error.response?.data;
      
      if (statusCode === 401 || statusCode === 403) {
        throw new Error("Authentication error: Invalid HubSpot token or insufficient permissions");
      } else if (statusCode === 404) {
        throw new Error(`Contact with ID ${contactId} not found`);
      } else if (statusCode === 429) {
        throw new Error("Rate limit exceeded for HubSpot API");
      } else {
        throw new Error(
          `HubSpot API error (${statusCode}): ${
            responseData?.message || error.message || "Unknown error"
          }`
        );
      }
    }
    
    // Re-throw any other errors
    throw error;
  }
}
