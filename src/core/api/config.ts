const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL is not set — add it to your .env file.');
}

export const API_BASE_URL = apiUrl;