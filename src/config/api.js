/**
 * Application API configuration.
 *
 * In development, defaults to 'http://127.0.0.1:8000'.
 * In production (Render / Vercel), set VITE_API_BASE_URL to your deployed backend URL:
 * e.g., https://ai-study-assistant-backend.onrender.com
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

// Normalize URL (strip trailing slashes)
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '')

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  DOCUMENTS: `${API_BASE_URL}/api/documents`,
  CHAT: `${API_BASE_URL}/api/chat`,
}
