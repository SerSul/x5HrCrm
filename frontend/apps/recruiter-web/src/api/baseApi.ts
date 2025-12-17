import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_USE_REAL_API === 'true'
    ? "http://localhost:8080/api"
    : "http://localhost:3000",
  withCredentials: true,
});

// Global 401 interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on 401 (session expired/invalid)
      const { useAuthStore } = await import('../storage/authStorage');
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

export default api;