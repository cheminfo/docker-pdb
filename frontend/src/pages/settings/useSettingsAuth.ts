import { useCallback, useEffect, useState } from 'react';

import {
  changePassword as apiChangePassword,
  checkAuth,
  login as apiLogin,
  logout as apiLogout,
} from './authApi.ts';

interface SettingsAuthState {
  /** null while the initial /auth/me check is in flight. */
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
}

export function useSettingsAuth(): SettingsAuthState {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth()
      .then(setIsAuthenticated)
      .catch(() => setIsAuthenticated(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    await apiLogin(username, password);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setIsAuthenticated(false);
  }, []);

  const changePassword = useCallback(async (current: string, next: string) => {
    await apiChangePassword(current, next);
  }, []);

  return { isAuthenticated, login, logout, changePassword };
}
