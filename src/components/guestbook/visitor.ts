import { guestbookSubmissionSchema } from "./guestbookSchema";

const VISITOR_KEY = "guestbook-visitor-id";

export function getVisitorId() {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing && guestbookSubmissionSchema.shape.visitorId.safeParse(existing).success) return existing;
  if (existing) console.warn("Replacing an invalid guestbook browser identifier");
  const created = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, created);
  return created;
}

export async function submitNetlifyForm(fields: Record<string, string>) {
  const body = new URLSearchParams(fields);
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Netlify form submission failed with ${response.status}`);
  }
}