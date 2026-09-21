import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { PillButton } from "../ui/PillButton";

/**
 * Contact form powered by EmailJS — sends email directly from the browser
 * without needing a backend API route.
 *
 * ▶ EDIT ME: Replace the three constants below with your real EmailJS
 *   credentials from https://dashboard.emailjs.com
 *
 * Payload shape sent to the EmailJS template:
 *   { from_name, from_email, subject, message }
 * Plus a hidden `company` honeypot — if it's non-empty, treat the submission
 * as spam and silently drop it.
 */

// ▶ EDIT ME: Replace these with your real EmailJS credentials.
// Get them from https://dashboard.emailjs.com
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

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
  "w-full rounded-xl border border-white/15 bg-slate-900/70 px-4 py-3 font-body " +
  "text-white placeholder-slate-400/60 shadow-inner transition-colors " +
  "focus:border-zyk-accent focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-zyk-accent/40";

const labelBase =
  "mb-1.5 block font-display text-xs uppercase tracking-widest text-slate-300 font-semibold";

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
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          subject: form.subject.trim() || "Portfolio Contact",
          message: form.message.trim(),
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
      setError(
        "Something went wrong sending your message. Please try again, or email me directly.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-zyk-bg-end/95 p-8 text-center text-zyk-heading shadow-lg">
        <p className="font-display text-2xl">Message sent! 🎉</p>
        <p className="mt-2 font-body text-zyk-heading/70">
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
        <div className="mt-4">
          <p className="font-body text-sm text-red-400">{error}</p>
          <a
            href="mailto:zyk.creatives@gmail.com"
            className="mt-1 inline-block font-display text-xs text-zyk-accent underline-offset-4 hover:underline"
          >
            Or email me directly →
          </a>
        </div>
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

