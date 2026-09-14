import { vi } from "vitest";

export function stubEnvironment(overrides: Record<string, string | undefined> = {}) {
  const values: Record<string, string | undefined> = {
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test-server-key-with-enough-length",
    GUESTBOOK_IP_SALT: "a-long-random-test-secret-value",
    ...overrides,
  };
  vi.stubGlobal("Netlify", { env: { get: (key: string) => values[key] } });
}
