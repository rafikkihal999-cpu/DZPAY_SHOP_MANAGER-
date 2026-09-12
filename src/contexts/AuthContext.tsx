import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getAccessToken,
} from '../services/googleAuth';

export interface GoogleAccountInfo {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  activeBranch: string;
  currency: string;
  wilaya: string;
  // Google / Gmail Auth
  googleUser: GoogleAccountInfo | null;
  isGoogleAuthenticated: boolean;
  isLoggingInWithGoogle: boolean;
  googleAuthError: string | null;
  accessToken: string | null;
  loginWithGoogle: () => Promise<boolean>;
  updateBranch: (branch: string) => void;
  logout: () => Promise<void>;
  // Cloud sync status
  lastCloudSync: string | null;
  setLastCloudSync: (timestamp: string | null) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_admin_01',
  name: 'رفيق كيحل',
  firstName: 'رفيق',
  lastName: 'كيحل',
  email: 'rafikkihal999@gmail.com',
  phone: '0550 12 34 56',
  role: 'super_admin',
  roleArabic: 'المدير العام / المسؤول',
  branchName: 'الفرع الرئيسي - قسنطينة',
  wilaya: 'قسنطينة (25)',
  isActive: true,
  lastLogin: 'اليوم، 10:30 صباحاً',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [activeBranch, setActiveBranch] = useState<string>('الفرع الرئيسي - قسنطينة');
  const [googleUser, setGoogleUser] = useState<GoogleAccountInfo | null>(null);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState<boolean>(false);
  const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState<boolean>(false);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(() => {
    return localStorage.getItem('dzpay_last_cloud_sync') || null;
  });

  const currency = 'د.ج (DZD)';
  const wilaya = '25 - قسنطينة';

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = initAuth(
      (user, token) => {
        setAccessToken(token);
        setIsGoogleAuthenticated(true);
        const info: GoogleAccountInfo = {
          uid: user.uid,
          email: user.email || 'rafikkihal999@gmail.com',
          displayName: user.displayName || 'رفيق كيحل',
          photoURL: user.photoURL || undefined,
        };
        setGoogleUser(info);
        setCurrentUser((prev) => ({
          ...(prev || DEFAULT_USER),
          name: info.displayName,
          email: info.email,
          avatarUrl: info.photoURL || prev?.avatarUrl,
          lastLogin: 'الآن (عبر Google)',
        }));
      },
      () => {
        setIsGoogleAuthenticated(false);
        setGoogleUser(null);
        setAccessToken(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoggingInWithGoogle(true);
    setGoogleAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setAccessToken(result.accessToken);
        setIsGoogleAuthenticated(true);
        const info: GoogleAccountInfo = {
          uid: result.user.uid,
          email: result.user.email || 'rafikkihal999@gmail.com',
          displayName: result.user.displayName || 'رفيق كيحل',
          photoURL: result.user.photoURL || undefined,
        };
        setGoogleUser(info);
        setCurrentUser({
          id: result.user.uid,
          name: info.displayName,
          email: info.email,
          phone: '0550 12 34 56',
          role: 'super_admin',
          roleArabic: 'المدير العام / المسؤول (Google)',
          branchName: activeBranch,
          wilaya: wilaya,
          avatarUrl: info.photoURL,
          isActive: true,
          lastLogin: 'الآن (Google Sign-In)',
        });
        return true;
      }
      // Result is null when user dismisses or closes the popup window
      return false;
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string } | undefined;
      const errCode = errorObj?.code || '';
      const errMsg = String(errorObj?.message || err || '');

      // User closed popup or cancelled flow
      if (
        errCode === 'auth/popup-closed-by-user' ||
        errCode === 'auth/cancelled-popup-request' ||
        errMsg.includes('popup-closed-by-user') ||
        errMsg.includes('cancelled-popup-request')
      ) {
        setGoogleAuthError(null);
        return false;
      }

      console.warn('Google Sign In notice:', errMsg);
      const friendlyMsg = errMsg.includes('حجب النافذة')
        ? errMsg
        : 'تعذر إتمام تسجيل الدخول عبر Google. يمكنك إعادة المحاولة.';
      setGoogleAuthError(friendlyMsg);
      return false;
    } finally {
      setIsLoggingInWithGoogle(false);
    }
  };

  const updateBranch = (branch: string) => {
    setActiveBranch(branch);
  };

  const logout = async () => {
    try {
      await googleSignOut();
    } catch (err) {
      console.warn('Error during googleSignOut:', err);
    }
    setGoogleUser(null);
    setIsGoogleAuthenticated(false);
    setAccessToken(null);
    setCurrentUser(null);
  };

  const handleSetLastCloudSync = (timestamp: string | null) => {
    setLastCloudSync(timestamp);
    if (timestamp) {
      localStorage.setItem('dzpay_last_cloud_sync', timestamp);
    } else {
      localStorage.removeItem('dzpay_last_cloud_sync');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        activeBranch,
        currency,
        wilaya,
        googleUser,
        isGoogleAuthenticated,
        isLoggingInWithGoogle,
        googleAuthError,
        accessToken,
        loginWithGoogle,
        updateBranch,
        logout,
        lastCloudSync,
        setLastCloudSync: handleSetLastCloudSync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

