export const AUTH_TOKEN_KEY = 'adminToken';
export const AUTH_EMAIL_KEY = 'adminEmail';

export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
};

export const setAdminToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const removeAdminToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const getAdminEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_EMAIL_KEY);
  }
  return null;
};

export const setAdminEmail = (email: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_EMAIL_KEY, email);
  }
};

export const removeAdminEmail = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_EMAIL_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAdminToken();
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    removeAdminToken();
    removeAdminEmail();
    window.location.href = '/login';
  }
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
