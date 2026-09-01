const TOKEN_KEY = 'hrms_token';
const USER_KEY = 'hrms_user';
const EMPLOYEE_KEY = 'hrms_employee';
const PERMISSIONS_KEY = 'hrms_permissions';

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

export function savePermissions(permissions: AuthPermission[]): void {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EMPLOYEE_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);
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

export function getStoredPermissions(): AuthPermission[] | null {
  const raw = localStorage.getItem(PERMISSIONS_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthPermission[]; } catch { return null; }
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

// --- Intranet App CRUD ---

export interface IntranetApp {
  id: number;
  name: string;
  icon: string | null;
  url: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface IntranetAppPayload {
  name: string;
  url: string;
  icon?: string | null;
  description?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

const INTRANET_BASE_URL = import.meta.env.VITE_INTRANET_BASE_URL ?? 'http://localhost:8000';

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Token ${token}`;
  }
  return { ...headers, ...extra };
}

export async function fetchIntranetApps(): Promise<IntranetApp[]> {
  const res = await fetch(`${INTRANET_BASE_URL}/intranet-app/`, { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`);
  }
  return res.json();
}

export async function createIntranetApp(payload: IntranetAppPayload): Promise<IntranetApp> {
  const res = await fetch(`${INTRANET_BASE_URL}/intranet-app/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleAppResponse(res, 'create');
}

export async function updateIntranetApp(id: number, payload: IntranetAppPayload): Promise<IntranetApp> {
  const res = await fetch(`${INTRANET_BASE_URL}/intranet-app-s/${id}/`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleAppResponse(res, 'update');
}

export async function deleteIntranetApp(id: number): Promise<void> {
  const res = await fetch(`${INTRANET_BASE_URL}/intranet-app-s/${id}/`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 403) {
    throw new Error('You do not have permission to perform this action.');
  }
  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete application (${res.status})`);
  }
}

async function handleAppResponse(res: Response, action: 'create' | 'update'): Promise<IntranetApp> {
  if (res.status === 403) {
    throw new Error('You do not have permission to perform this action.');
  }
  if (!res.ok) {
    let message = `Failed to ${action} application (${res.status})`;
    try {
      const body = await res.json();
      if (body && typeof body === 'object') {
        const first = Object.values(body)[0];
        if (Array.isArray(first) && first.length) message = String(first[0]);
        else if (typeof first === 'string') message = first;
      }
    } catch {
      // ignore parse errors; fall back to generic message
    }
    throw new Error(message);
  }
  return res.json();
}

// --- SSO Token Generation ---

export interface SSOTokenResponse {
  token: string;
  redirect_url: string;
  expires_at: string;
}

export async function generateSSOToken(appId: number): Promise<SSOTokenResponse> {
  const res = await fetch(`${HRMS_BASE_URL}/api/rbac/sso/generate/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ app_id: appId }),
  });
  if (!res.ok) {
    let detail = `Failed to generate SSO token (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch { /* ignore */ }
    throw new Error(detail);
  }
  return res.json();
}
