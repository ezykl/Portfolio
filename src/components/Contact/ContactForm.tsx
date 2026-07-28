import React, { useState } from "react";
import { PillButton } from "../ui/PillButton";

/**
 * Contact form for an SMTP-backed email send. The frontend collects the fields
 * and POSTs JSON to CONTACT_ENDPOINT; wire that endpoint up to your SMTP mailer
 * (e.g. an API route using nodemailer) — it should read the same field names.
 *
 * Payload shape:
 *   { name: string; email: string; subject: string; message: string }
 * Plus a hidden `company` honeypot — if it's non-empty, treat the submission as
 * spam and silently drop it server-side.
 */

// Change to wherever your mail-sending endpoint lives.
const CONTACT_ENDPOINT = "/api/contact";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string; // honeypot — real users never fill this
}

const EMPTY: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  "w-full rounded-xl border border-transparent bg-zyk-bg-end/95 px-4 py-3 font-body " +
  "text-zyk-heading placeholder-zyk-brown/40 shadow-sm transition-colors " +
  "focus:border-zyk-primary focus:outline-none focus:ring-2 focus:ring-zyk-primary/40";

const labelBase =
  "mb-1.5 block font-display text-xs uppercase tracking-widest text-zyk-bg-end/90";

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please add your name.";
    if (!EMAIL_RE.test(form.email)) return "Please enter a valid email.";
    if (form.message.trim().length < 10)
      return "Please write a little more in your message.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    // Honeypot tripped → pretend success, send nothing.
    if (form.company) {
      setStatus("success");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
      setError("Something went wrong sending your message. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-zyk-bg-end/95 p-8 text-center text-zyk-heading shadow-lg">
        <p className="font-display text-2xl">Message sent! 🎉</p>
        <p className="mt-2 font-body text-zyk-brown/80">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 font-display text-sm text-zyk-accent underline-offset-4 hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-lg text-left"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelBase}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Your name"
            className={fieldBase}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelBase}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            className={fieldBase}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-subject" className={labelBase}>
          Subject <span className="normal-case opacity-60">(optional)</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={set("subject")}
          placeholder="What's this about?"
          className={fieldBase}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className={labelBase}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell me a little about what you have in mind…"
          className={`${fieldBase} resize-y`}
        />
      </div>

      {/* Honeypot: visually hidden, off-screen, not tabbable. Bots fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={set("company")}
        />
      </div>

      {status === "error" && error && (
        <p className="mt-4 font-body text-sm text-zyk-secondary">{error}</p>
      )}

      <div className="mt-6 flex justify-center">
        <PillButton
          variant="primary"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </PillButton>
      </div>
    </form>
  );
};
