import { links } from "@/content/profile";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactResult =
  | { status: "sent" }
  | { status: "handoff" }
  | { status: "error"; message: string };

/**
 * Where the contact form delivers.
 *
 * Set `NEXT_PUBLIC_CONTACT_ENDPOINT` to a Formspree / Resend / Route Handler
 * URL that accepts `{ name, email, message }` as JSON and the form will POST
 * to it. Until one is configured the form hands the message off to the
 * visitor's mail client instead of pretending to have sent it — the site
 * never reports a success that did not happen.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

export function buildMailto({ name, email, message }: ContactPayload) {
  const subject = encodeURIComponent(`Project enquiry — ${name}`);
  const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
  return `mailto:${links.email}?subject=${subject}&body=${body}`;
}

export async function submitContact(payload: ContactPayload): Promise<ContactResult> {
  if (!ENDPOINT) {
    if (typeof window !== "undefined") {
      window.location.href = buildMailto(payload);
    }
    return { status: "handoff" };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { status: "error", message: "That did not go through. Try email instead." };
    }

    return { status: "sent" };
  } catch {
    return { status: "error", message: "Network problem. Try email instead." };
  }
}

/* ------------------------------------------------------------- validation */

export type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(payload: ContactPayload): FieldErrors {
  const errors: FieldErrors = {};

  if (payload.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }
  if (!EMAIL.test(payload.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (payload.message.trim().length < 20) {
    errors.message = "A little more detail helps — 20 characters minimum.";
  }

  return errors;
}
