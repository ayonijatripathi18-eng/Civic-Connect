import { AuthorityUser } from '../types/authority';
import {
  MOCK_OFFICER_USER,
  MOCK_SUPER_ADMIN_USER,
  MOCK_FIELD_OFFICER_USER
} from '../data/authorityMockData';

/**
 * CIVIC-CONNECT Authority Authentication Service (Frontend Layer)
 * 
 * =========================================================================
 * CRITICAL SECURITY ARCHITECTURE NOTE:
 * =========================================================================
 * Frontend route protection is for user experience and administrative workflow
 * only. Actual authority authorization MUST be enforced by the backend/database.
 * 
 * In production:
 * 1. Authority Login submits credentials via: POST /api/authority/login
 * 2. Backend verifies identity against the authorized authority registry.
 * 3. Backend verifies active status and department/ward jurisdiction.
 * 4. Backend issues an HTTP-only secure JWT/session cookie.
 * 5. Every subsequent request (GET /api/authority/issues, etc.) is validated
 *    at the database boundary.
 * 
 * Never trust email, role, or department supplied purely by client state.
 * =========================================================================
 */

export interface AuthorityAuthResponse {
  success: boolean;
  user?: AuthorityUser;
  token?: string;
  errorMessage?: string;
  isAccessDenied?: boolean;
}

const STORAGE_KEY = 'civic_authority_session';

export const authorityAuthService = {
  /**
   * Validates the frontend session and clears invalid or stale authority auth.
   */
  validateSession(): AuthorityUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data) as Partial<AuthorityUser>;
      const isValidUser =
        parsed &&
        typeof parsed === 'object' &&
        typeof parsed.authorityId === 'string' &&
        typeof parsed.email === 'string' &&
        typeof parsed.role === 'string' &&
        parsed.isActive !== false;

      if (!isValidUser) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return parsed as AuthorityUser;
    } catch (e) {
      console.warn('Could not read authority session', e);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  /**
   * Retrieves currently cached frontend session
   */
  getSession(): AuthorityUser | null {
    return this.validateSession();
  },

  /**
   * Indicates whether a valid authority session is currently available.
   */
  isAuthenticated(): boolean {
    return this.validateSession() !== null;
  },

  /**
   * Mock login endpoint simulating POST /api/authority/login
   * Validates against mock official accounts or returns Access Denied
   */
  async login(email: string, pass: string): Promise<AuthorityAuthResponse> {
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = (email || '').trim().toLowerCase();

    // Check pre-configured demo authority accounts for prototype evaluation
    if (cleanEmail === 'v.rathore@pwd.gov.in' || cleanEmail === 'authority@civicconnect.demo') {
      const user = MOCK_OFFICER_USER;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return {
        success: true,
        user,
        token: 'mock-jwt-auth-token-pwd-4402'
      };
    }

    if (cleanEmail === 'commissioner@municipalcorp.gov.in') {
      const user = MOCK_SUPER_ADMIN_USER;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return {
        success: true,
        user,
        token: 'mock-jwt-auth-token-commissioner-001'
      };
    }

    if (cleanEmail === 'r.shrivastava@pwd.gov.in') {
      const user = MOCK_FIELD_OFFICER_USER;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return {
        success: true,
        user,
        token: 'mock-jwt-auth-token-field-8821'
      };
    }

    // Explicit Access Denied simulation for non-allowlisted credentials
    return {
      success: false,
      isAccessDenied: true,
      errorMessage:
        'Authority access denied. This email address does not exist in the municipal authorized personnel registry.'
    };
  },

  /**
   * Terminates authority session
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Simulates GET /api/authority/me
   */
  async getCurrentUser(): Promise<AuthorityUser | null> {
    return this.getSession();
  }
};
