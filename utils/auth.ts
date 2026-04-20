import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'terapiya_auth';

export interface AuthSession {
  phone: string;
  name: string;
  loggedInAt: number;
}

/** Save session after login */
export async function saveSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

/** Get saved session (returns null if not logged in) */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

/** Clear session on logout */
export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}
