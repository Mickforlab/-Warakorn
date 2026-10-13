import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  isAuthorizedAdmin,
  PRIMARY_ADMIN_EMAIL
} from '../lib/firebase';

export interface AuthState {
  currentUser: User | null;
  isLoadingAuth: boolean;
  isAdmin: boolean;
  authError: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  primaryAdminEmail: string;
}

export function useFirebaseAuth(): AuthState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
      if (user && !isAuthorizedAdmin(user)) {
        setAuthError(`คุณเข้าสู่ระบบด้วย ${user.email} (สิทธิ์ผู้ชม) โดยสิทธิ์โหมดแก้ไขจะเปิดให้เฉพาะบัญชีครูผู้รับการประเมิน (${PRIMARY_ADMIN_EMAIL}) ครับ`);
      } else {
        setAuthError(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setAuthError(null);
      const user = await loginWithGoogle();
      if (!isAuthorizedAdmin(user)) {
        setAuthError(`คุณเข้าสู่ระบบด้วย ${user.email} (สิทธิ์ผู้ชม) โดยสิทธิ์โหมดแก้ไขจะเปิดให้เฉพาะบัญชีครูผู้รับการประเมิน (${PRIMARY_ADMIN_EMAIL}) ครับ`);
      }
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error('Firebase Auth Login Error:', error);
        setAuthError(error?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google');
      }
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setAuthError(null);
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const clearError = () => setAuthError(null);

  return {
    currentUser,
    isLoadingAuth,
    isAdmin: isAuthorizedAdmin(currentUser),
    authError,
    login,
    logout,
    clearError,
    primaryAdminEmail: PRIMARY_ADMIN_EMAIL
  };
}
