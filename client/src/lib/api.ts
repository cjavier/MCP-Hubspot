import { apiRequest } from "./queryClient";

export async function testHubspotContact(contactId: string) {
  try {
    const response = await apiRequest("POST", "/api/hubspot/contact", { contactId });
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateHubspotConfig(token: string) {
  try {
    const response = await apiRequest("POST", "/api/hubspot/config", { token });
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getServerStatus() {
  try {
    const response = await apiRequest("GET", "/api/server/status", undefined);
    return await response.json();
  } catch (error) {
    throw error;
  }
}
