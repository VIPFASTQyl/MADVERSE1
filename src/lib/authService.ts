// Frontend authentication service - communicates with backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const authService = {
  // Sign up
  async signup(fullName: string, email: string, phone: string, password: string, confirmPassword: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          confirmPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sign up failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Verify email
  async verifyEmail(token: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Verification failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Login
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get current user (verify token)
  async getCurrentUser(token: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get user');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Store token locally
  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // Clear token
  clearToken() {
    localStorage.removeItem('auth_token');
  },

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
};
