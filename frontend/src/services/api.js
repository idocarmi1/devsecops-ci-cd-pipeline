const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getHealthStatus() {
  const response = await fetch(`${apiBaseUrl}/health`);
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return response.json();
}

export async function getPortfolioMessage() {
  const response = await fetch(`${apiBaseUrl}/message`);
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return response.json();
}

