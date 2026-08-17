"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import {
  submitContact,
  validate,
  type ContactPayload,
  type FieldErrors,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "sent" | "handoff" | "error";

const EMPTY: ContactPayload = { name: "", email: "", message: "" };
const MESSAGE_MAX = 1200;

export function ContactForm() {
  const uid = useId().replace(/:/g, "");
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");

  const update = (field: keyof ContactPayload) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus("error");
      setNotice("Please correct the highlighted fields.");
      const firstField = Object.keys(found)[0];
      document.getElementById(`${firstField}-${uid}`)?.focus();
      return;
    }

    setStatus("submitting");
    setNotice("");

    const result = await submitContact({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });

    if (result.status === "sent") {
      setStatus("sent");
      setNotice("Message received. I'll reply within two working days.");
      setValues(EMPTY);
    } else if (result.status === "handoff") {
      setStatus("handoff");
      setNotice("Your mail client is opening with the message ready to send.");
    } else {
      setStatus("error");
      setNotice(result.message);
    }
  }

  const busy = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <Field
        id={`name-${uid}`}
        label="Name"
        index="01"
        value={values.name}
        onChange={update("name")}
        error={errors.name}
        autoComplete="name"
        placeholder="Your name"
        disabled={busy}
      />

      <Field
        id={`email-${uid}`}
        label="Email"
        index="02"
        type="email"
        inputMode="email"
        value={values.email}
        onChange={update("email")}
        error={errors.email}
        autoComplete="email"
        placeholder="you@company.com"
        disabled={busy}
      />

      <Field
        id={`message-${uid}`}
        label="Project"
        index="03"
        multiline
        value={values.message}
        onChange={update("message")}
        error={errors.message}
        placeholder="What are you building, and what does success look like?"
        maxLength={MESSAGE_MAX}
        counter={`${values.message.length}/${MESSAGE_MAX}`}
        disabled={busy}
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-4 pt-1">
        <button
          type="submit"
          disabled={busy}
          data-cursor="SEND"
          className="group/send relative inline-flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-sm bg-ink px-8 text-[0.9375rem] font-medium text-paper-raised transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] disabled:cursor-wait disabled:opacity-70"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-[220%] skew-x-[-18deg] bg-white/16 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/send:translate-x-[420%] motion-reduce:hidden"
          />
          <span className="relative flex items-center gap-2.5">
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : status === "sent" ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Send className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" aria-hidden="true" />
            )}
            {busy ? "Sending" : status === "sent" ? "Sent" : "Send message"}
          </span>
        </button>

        <p className="type-meta max-w-[28ch] text-ink-40">
          No newsletters, no lists — the message goes straight to my inbox.
        </p>
      </div>

      {/* Live region: one place for every form-level outcome */}
      <div aria-live="polite" role="status" className="min-h-[1.5rem]">
        <AnimatePresence mode="wait">
          {notice && (
            <motion.p
              key={notice}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "type-body text-[0.875rem]",
                status === "error" ? "text-ember" : "text-ink-80",
              )}
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ field */

function Field({
  id,
  label,
  index,
  value,
  onChange,
  error,
  multiline,
  counter,
  disabled,
  ...props
}: {
  id: string;
  label: string;
  index: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  multiline?: boolean;
  counter?: string;
  disabled?: boolean;
  type?: string;
  inputMode?: "email" | "text";
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const errorId = `${id}-error`;

  const shared = {
    id,
    value,
    disabled,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
    /* The default outline is replaced, not removed. A 2px inset underline in
       the accent plus a faint field tint is a real WCAG 2.4.11 indicator —
       6.3:1 against paper and spanning the full control — and it matches the
       underline geometry of the form instead of drawing a box around it. */
    className:
      "w-full bg-transparent px-1 py-3 text-[1.0625rem] tracking-[-0.015em] text-ink transition-colors duration-300 placeholder:text-ink-40 focus-visible:bg-signal/[0.045] focus-visible:shadow-[inset_0_-2px_0_0_var(--color-signal)] focus-visible:outline-none disabled:opacity-60",
    ...props,
  };

  return (
    <div className="relative">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="type-label flex items-center gap-3 text-ink-40">
          <span className="tabular-nums text-ink-40">{index}</span>
          {label}
        </label>
        {counter && <span className="type-meta text-[0.6875rem] text-ink-40">{counter}</span>}
      </div>

      {multiline ? (
        <textarea rows={4} {...shared} className={`${shared.className} resize-none`} />
      ) : (
        <input {...shared} />
      )}

      {/* Baseline rule that fills from the left on focus */}
      <div aria-hidden="true" className="relative h-px w-full bg-hairline-strong">
        <span
          className={cn(
            "absolute inset-y-0 left-0 w-full origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            focused ? "scale-x-100" : "scale-x-0",
            error ? "bg-ember" : "bg-ink",
          )}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="type-meta mt-2 text-ember"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
