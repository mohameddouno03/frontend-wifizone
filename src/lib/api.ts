const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dounoh0.pythonanywhere.com/api";

export const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = localStorage.getItem("auth_token");
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Erreur ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};