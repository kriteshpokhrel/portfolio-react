import { createHmac } from "node:crypto";
import { z } from "zod";

const environmentSchema = z.object({
  SUPABASE_URL: z.url({ protocol: /^https$/ }).transform((url) => url.replace(/\/$/, "")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  GUESTBOOK_IP_SALT: z.string().min(24),
});

function getEnvironment() {
  return environmentSchema.parse({
    SUPABASE_URL: Netlify.env.get("SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    GUESTBOOK_IP_SALT: Netlify.env.get("GUESTBOOK_IP_SALT"),
  });
}

export function hashVisitor(visitorId: string) {
  const { GUESTBOOK_IP_SALT } = getEnvironment();
  return createHmac("sha256", GUESTBOOK_IP_SALT)
    .update(visitorId)
    .digest("hex");
}

export async function callSupabaseRpc<T>(
  name: string,
  parameters: Record<string, unknown>
): Promise<T> {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getEnvironment();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      ...(SUPABASE_SERVICE_ROLE_KEY.startsWith("sb_secret_")
        ? {}
        : { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parameters),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Supabase RPC ${name} failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export function encodeCursor(createdAt: string, id: string) {
  return Buffer.from(JSON.stringify([createdAt, id])).toString("base64url");
}

export function decodeCursor(cursor: string | null) {
  if (!cursor) return null;

  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
    return z.tuple([z.string().datetime({ offset: true }), z.string().uuid()]).parse(parsed);
  } catch {
    return null;
  }
}