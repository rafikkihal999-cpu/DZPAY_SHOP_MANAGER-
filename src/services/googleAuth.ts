import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Scopes required for Gmail integration and user profile
export const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
// Force prompt to ensure consent and fresh tokens when requested
provider.setCustomParameters({
  prompt: 'select_account',
});

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;
// In-memory cache for the access token (NEVER stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;

/**
 * Initialize auth state listener. Call this on app load.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If user is logged in via Firebase session but token expired or refreshed,
        // we keep the Firebase user session while notifying state
        if (onAuthSuccess && cachedAccessToken) {
          onAuthSuccess(user, cachedAccessToken);
        } else if (onAuthFailure) {
          onAuthFailure();
        }
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Perform Google Sign-In with popup.
 * Must be triggered by user interaction (button click).
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('لم يتم استلام مفتاح الوصول من Google Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string } | undefined;
    const errorCode = err?.code || '';
    const errorMessage = String(err?.message || error || '');

    // Gracefully handle user cancellation (closing the popup or dismissing it)
    if (
      errorCode === 'auth/popup-closed-by-user' ||
      errorCode === 'auth/cancelled-popup-request' ||
      errorMessage.includes('popup-closed-by-user') ||
      errorMessage.includes('cancelled-popup-request')
    ) {
      // Normal user dismissal; not an application failure
      return null;
    }

    // Handle browser popup blocker inside iframes or strict browser settings
    if (errorCode === 'auth/popup-blocked' || errorMessage.includes('popup-blocked')) {
      console.warn('Google sign-in popup was blocked by the browser.');
      throw new Error(
        'تم حجب النافذة المنبثقة بواسطة المتصفح. يرجى السماح بالنوافذ المنبثقة (Popups) أو فتح التطبيق في تبويب مستقل.'
      );
    }

    console.warn('Google Sign-in notice:', errorMessage);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current in-memory OAuth access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Manually update cached access token if renewed
 */
export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Sign out from Google & Firebase
 */
export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
