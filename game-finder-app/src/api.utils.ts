// Utility function to handle HTTP errors
export const handleError = async (response: Response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response;
};

// Base URL for API calls
export const BASE_API_URL = "/api";