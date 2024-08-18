import axios from "axios";
import keytar from "keytar";

// Types
export interface AuthUser {
  id: string;
  name: string;
  image: string;
  authAvatar: string;
}
interface Token {
  provider: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
interface AuthSession {
  id: string;
  userId: string;
  token: Token;
  created_at: Date;
  expiresAt: Date;
}
interface SessionResponse {
  data: { user: AuthUser; session: AuthSession };
  dt: Date;
}

// Constants
import { API_URL } from "@Config/constants";

// User
let user: AuthUser | null = null;
let session: AuthSession | null = null;

/**
 * Checks user session with token, if no token provided, defaults to last saved token
 * @param token New authentication token
 */
export async function checkSession(token?: string): Promise<AuthUser | null> {
  try {
    const authToken =
      token ?? (await keytar.getPassword("Qiqi's Notebook", "auth_token"));
    if (!authToken) return null;

    const resp = await axios.get(
      `${API_URL}/auth/app/session?token=${authToken}`
    );
    if (resp.status === 200) {
      const response: SessionResponse = resp.data;

      // Save credentials
      session = response.data.session;
      await keytar.setPassword("Qiqi's Notebook", "auth_token", session.id);

      // Store user
      user = response.data.user;
      return user;
    } else {
      await keytar.deletePassword("Qiqi's Notebook", "auth_token");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getUser() {
  return user;
}

export async function logout() {
  if (!session) return false;
  try {
    const resp = await axios.post(
      `${API_URL}/auth/app/logout?token=${session.id}`
    );
    if (resp.status === 200) {
      user = null;
      session = null;

      // Remove credentials
      await keytar.deletePassword("Qiqi's Notebook", "auth_token");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
