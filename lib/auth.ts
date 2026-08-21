const TOKEN_KEY = 'hrms_token';
const USER_KEY = 'hrms_user';
const EMPLOYEE_KEY = 'hrms_employee';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  last_login: string;
  date_joined: string;
}

export interface AuthEmployee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
  department: string;
  designation: string;
  is_active: boolean;
}

export interface AuthRole {
  id: number;
  name: string;
  role_type: string;
  level: number;
  is_primary: boolean;
  department_scope: string | null;
  team_scope: string | null;
}

export interface AuthPermission {
  id: number;
  name: string;
  code: string;
  category: string;
  level: number;
  description: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  employee: AuthEmployee;
  roles: AuthRole[];
  permissions: AuthPermission[];
  permission_count: number;
  error?: string;
}

// --- Storage helpers ---

export function saveAuth(token: string, user: AuthUser, employee: AuthEmployee): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EMPLOYEE_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

export function getStoredEmployee(): AuthEmployee | null {
  const raw = localStorage.getItem(EMPLOYEE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthEmployee; } catch { return null; }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// --- API calls ---

const HRMS_BASE_URL = import.meta.env.VITE_HRMS_BASE_URL ?? '';

export async function loginWithHRMS(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${HRMS_BASE_URL}/api/rbac/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data: LoginResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error ?? 'Login failed. Please check your credentials.');
  }

  return data;
}

export async function logoutFromHRMS(token: string): Promise<void> {
  try {
    await fetch(`${HRMS_BASE_URL}/api/rbac/logout/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
    });
  } finally {
    // Always clear local state regardless of server response
    clearAuth();
  }
}
