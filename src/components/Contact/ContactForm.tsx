import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { PillButton } from "../ui/PillButton";

/**
 * Developer-themed Contact Form powered by EmailJS (@emailjs/browser).
 *
 * Dispatches two emails upon submission:
 *  1. Notification to the portfolio owner with visitor details & reply_to header.
 *  2. Automated confirmation receipt to the visitor's email address.
 *
 * Styled for the dark dev-portfolio theme with JetBrains Mono monospace accents,
 * terminal telemetry status cards, anti-spam honeypot, and spring-physics animations.
 */

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string; // Honeypot — invisible to real users
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 font-body text-slate-100 " +
  "placeholder-slate-500 shadow-inner transition-all duration-200 " +
  "focus:border-zyk-accent focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-zyk-accent/40";

const labelBase =
  "mb-1.5 flex items-center gap-1.5 font-display text-xs uppercase tracking-wider text-slate-300 font-semibold";

const PURPOSE_OPTIONS = [
  {
    value: "Freelance / Project Collaboration",
    label: "Freelance / Project Collaboration",
  },
  {
    value: "Job Opportunity / Full-time Role",
    label: "Job Opportunity / Full-time Role",
  },
  {
    value: "Design / Creative Commission",
    label: "Design / Creative Commission",
  },
  {
    value: "General Inquiry / Saying Hi",
    label: "General Inquiry / Saying Hi",
  },
  { value: "Other", label: "Other" },
];

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
  }>({
    name: "",
    email: "",
  });

  // Track time form was mounted to block instant automated bot submissions (<1.5s)
  const mountTimeRef = useRef<number>(Date.now());

  const setField =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      if (status === "error") {
        setError(null);
        setStatus("idle");
      }
    };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter a valid email address.";
    if (!EMAIL_RE.test(form.email.trim()))
      return "Please enter a valid email format.";
    if (!form.subject) return "Please choose a purpose for your transmission.";
    if (form.message.trim().length < 10)
      return "Please write at least 10 characters in your message payload.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    // Honeypot tripped or instant automated submit (<1.5s) -> silently pretend success
    const elapsedMs = Date.now() - mountTimeRef.current;
    if (form.company || elapsedMs < 1500) {
      setSubmittedData({ name: form.name || "visitor", email: form.email });
      setStatus("success");
      setForm(EMPTY_FORM);
      return;
    }

    const validationError = validate();
    if (validationError) {
      setStatus("error");
      setError(validationError);
      setErrorCount((c) => c + 1);
      return;
    }

    setStatus("submitting");
    setError(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const notificationTemplateId =
      import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFICATION_ID ||
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const confirmationTemplateId = import.meta.env
      .VITE_EMAILJS_TEMPLATE_CONFIRMATION_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !notificationTemplateId || !publicKey) {
      setStatus("error");
      setError(
        "EmailJS credentials are not configured yet. Please verify VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_NOTIFICATION_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.",
      );
      setErrorCount((c) => c + 1);
      return;
    }

    try {
      const templateParams = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
        reply_to: form.email.trim(),
        // Also support from_name / from_email if mapped in template
        from_name: form.name.trim(),
        from_email: form.email.trim(),
      };

      // 1. Dispatch primary notification to portfolio owner
      await emailjs.send(serviceId, notificationTemplateId, templateParams, {
        publicKey,
      });

      // 2. Dispatch automated confirmation receipt to visitor if template is present
      if (confirmationTemplateId) {
        try {
          await emailjs.send(
            serviceId,
            confirmationTemplateId,
            {
              to_name: form.name.trim(),
              to_email: form.email.trim(),
              subject: form.subject,
              message: form.message.trim(),
            },
            { publicKey },
          );
        } catch (confirmError) {
          console.warn(
            "Auto-confirmation email dispatch failed:",
            confirmError,
          );
        }
      }

      setSubmittedData({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      setStatus("success");
      setForm(EMPTY_FORM);
      mountTimeRef.current = Date.now();
    } catch (err: unknown) {
      console.error("EmailJS submission failure:", err);
      setStatus("error");
      setError(
        "Transmission error. Failed to dispatch message packet. Please check network connection and try again.",
      );
      setErrorCount((c) => c + 1);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setError(null);
    mountTimeRef.current = Date.now();
  };

  return (
    <div className="relative mx-auto max-w-lg">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          /* ================================================================
             SENT / TRANSMISSION SUCCESSFUL STATE (CYBER / DEV VIBE)
             ================================================================ */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-8 text-left text-slate-100 shadow-[0_0_50px_-15px_rgba(34,211,238,0.25)] backdrop-blur-xl md:p-10"
          >
            {/* Terminal Telemetry Header */}
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-display text-xs tracking-wider text-zyk-secondary">
                // TRANSMISSION_SUCCESSFUL [200 OK]
              </span>
            </div>

            {/* Glowing Neon Cyber Checkmark */}
            <div className="relative mx-auto my-6 flex h-20 w-20 items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: [1, 1.5, 1.2], opacity: [0.6, 0.15, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-cyan-400/20"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 16,
                  delay: 0.1,
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-950 text-zyk-secondary shadow-lg shadow-cyan-500/20"
              >
                <svg
                  className="h-8 w-8 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M4 12l5 5L20 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.25,
                      ease: "easeOut",
                    }}
                  />
                </svg>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h3 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                Payload Delivered! 🚀
              </h3>
              <p className="mt-2 text-sm text-slate-400 font-body">
                Thanks for reaching out,{" "}
                <span className="font-semibold text-slate-200">
                  {submittedData.name}
                </span>
                .
              </p>
            </motion.div>

            {/* Terminal Status Output */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 rounded-xl border border-white/5 bg-slate-950/80 p-4 font-display text-xs leading-relaxed text-slate-300"
            >
              <div className="flex items-center gap-2 text-zyk-accent">
                <span className="text-emerald-400">✓</span>
                <span>Message routed to Ezekiel Villadolid</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-slate-400">
                <span className="text-cyan-400">✓</span>
                <span>
                  Receipt dispatched to{" "}
                  <span className="text-slate-200">{submittedData.email}</span>
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-slate-500">
                <span>&gt;</span>
                <span>Expect response within 24–48 hours</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex justify-center"
            >
              <PillButton
                variant="secondary"
                type="button"
                onClick={handleReset}
                className="text-sm font-semibold"
              >
                // Send another transmission
              </PillButton>
            </motion.div>
          </motion.div>
        ) : (
          /* ================================================================
             DEFAULT & FAILED STATE FORM (DEV-DARK THEME)
             ================================================================ */
          <motion.form
            key="contact-form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-left shadow-2xl backdrop-blur-md md:p-8"
          >
            {/* Animate shake and error banner on failure */}
            <AnimatePresence>
              {status === "error" && error && (
                <motion.div
                  key={`error-${errorCount}`}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: [0, -10, 10, -7, 7, -3, 3, 0],
                  }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{
                    x: { duration: 0.45, ease: "easeInOut" },
                    opacity: { duration: 0.2 },
                  }}
                  className="mb-6 rounded-2xl border border-red-500/40 bg-red-950/30 p-4 text-left shadow-md backdrop-blur-md"
                >
                  <div className="flex items-center gap-2 font-display text-xs uppercase tracking-wider text-red-400">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span>// TRANSMISSION_FAILED [ERROR]</span>
                  </div>
                  <p className="mt-1 font-body text-xs text-red-200/90 leading-relaxed">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={labelBase}>
                  <span>Name</span>
                  <span className="text-zyk-accent">// required</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="e.g. Alex Chen"
                  className={fieldBase}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={labelBase}>
                  <span>Email</span>
                  <span className="text-zyk-accent">// required</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="alex@domain.dev"
                  className={fieldBase}
                />
              </div>
            </div>

            {/* Purpose / Subject Dropdown */}
            <div className="mt-4">
              <label htmlFor="contact-subject" className={labelBase}>
                <span>Purpose</span>
                <span className="text-zyk-accent">// select</span>
              </label>
              <div className="relative">
                <select
                  id="contact-subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={setField("subject")}
                  className={`${fieldBase} appearance-none cursor-pointer pr-10`}
                >
                  <option
                    value=""
                    disabled
                    className="bg-slate-900 text-slate-400"
                  >
                    Select transmission purpose…
                  </option>
                  {PURPOSE_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-slate-900 text-slate-100 py-1"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="mt-4">
              <label htmlFor="contact-message" className={labelBase}>
                <span>Payload / Message</span>
                <span className="text-zyk-accent">// min 10 chars</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={setField("message")}
                placeholder="Describe your project requirements, collaboration idea, or opportunity…"
                className={`${fieldBase} resize-y`}
              />
            </div>

            {/* Anti-spam honeypot (offscreen, hidden from screen readers) */}
            <div
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
            >
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={setField("company")}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              <PillButton
                variant="primary"
                type="submit"
                disabled={status === "submitting"}
                className="min-w-[200px]"
              >
                {status === "submitting" ? (
                  <span className="inline-flex items-center gap-2 font-display text-sm">
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    [ Transmitting... ]
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 font-display text-sm">
                    <span>Transmit Message</span>
                    <svg
                      className="h-4 w-4 text-cyan-300 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </PillButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
