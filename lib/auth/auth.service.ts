import { getChatGPTUser } from "@/app/chatgpt-auth";

export type AuthIdentity = { id: string; email: string; displayName: string };

export interface AuthProvider {
  currentUser(): Promise<AuthIdentity | null>;
}

export class SitesAuthProvider implements AuthProvider {
  async currentUser(): Promise<AuthIdentity | null> {
    const user = await getChatGPTUser();
    if (!user) return null;
    return { id: user.userId, email: user.email, displayName: user.displayName };
  }
}

export async function requireApiUser(): Promise<AuthIdentity> {
  const user = await new SitesAuthProvider().currentUser();
  if (user) return user;
  if (process.env.DEMO_MODE !== "false") return { id: "demo-user", email: "demo@closetly.style", displayName: "Demo User" };
  throw new Error("UNAUTHENTICATED");
}
