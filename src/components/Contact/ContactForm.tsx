import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { PillButton } from "../ui/PillButton";

/**
 * Contact form powered by EmailJS client SDK (@emailjs/browser).
 *
 * Dispatches two emails upon submission:
 *  1. Notification to the portfolio owner (with visitor's Name, Email, Purpose, Message, and Reply-To).
 *  2. Automated confirmation receipt to the visitor's email address.
 *
 * Includes anti-spam honeypot + timing detection, plus Framer Motion animations for sent and failed states.
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
  "w-full rounded-xl border border-transparent bg-zyk-bg-end/95 px-4 py-3 font-body " +
  "text-zyk-heading placeholder-zyk-brown/40 shadow-sm transition-all duration-200 " +
  "focus:border-zyk-primary focus:outline-none focus:ring-2 focus:ring-zyk-primary/40";

const labelBase =
  "mb-1.5 block font-display text-xs uppercase tracking-widest text-zyk-bg-end/90";

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

  // Track time form was mounted to detect automated instant-submit bots (<1.5s)
  const mountTimeRef = useRef<number>(Date.now());

  const setField =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      // Clear error as user types to provide immediate reassurance
      if (status === "error") {
        setError(null);
        setStatus("idle");
      }
    };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email address.";
    if (!EMAIL_RE.test(form.email.trim()))
      return "Please enter a valid email address.";
    if (!form.subject) return "Please choose a purpose for your message.";
    if (form.message.trim().length < 10)
      return "Please write at least 10 characters in your message.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    // Honeypot tripped or instant submission (<1.5s) -> silently pretend success
    const elapsedMs = Date.now() - mountTimeRef.current;
    if (form.company || elapsedMs < 1500) {
      setSubmittedData({ name: form.name || "friend", email: form.email });
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
        "EmailJS credentials are not configured yet. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_NOTIFICATION_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.",
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
      };

      // 1. Send notification to site owner
      await emailjs.send(serviceId, notificationTemplateId, templateParams, {
        publicKey,
      });

      // 2. Dispatch auto-confirmation to visitor if template is configured
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
          console.warn("Auto-confirmation email notice failed:", confirmError);
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
      console.error("EmailJS submission error:", err);
      setStatus("error");
      setError(
        "Something went wrong while sending your message. Please check your connection and try again.",
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
             SENT / SUCCESS ANIMATION STATE
             ================================================================ */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            className="rounded-3xl border border-white/20 bg-zyk-bg-end/95 p-8 text-center text-zyk-heading shadow-2xl backdrop-blur-md md:p-10"
          >
            {/* Animated Checkmark with Pulsing Ring */}
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: [1, 1.45, 1.2], opacity: [0.6, 0.15, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-zyk-primary/30"
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
                className="flex h-16 w-16 items-center justify-center rounded-full bg-zyk-primary text-white shadow-lg shadow-zyk-primary/30"
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

            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-2xl font-bold tracking-tight text-zyk-heading md:text-3xl"
            >
              Message Sent! 🎉
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 font-body text-base leading-relaxed text-zyk-brown/85"
            >
              Thank you,{" "}
              <span className="font-semibold text-zyk-heading">
                {submittedData.name}
              </span>
              ! Your message has been safely delivered. An automated
              confirmation has also been dispatched to{" "}
              <span className="font-semibold text-zyk-heading">
                {submittedData.email}
              </span>
              .
            </motion.p>

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
                Send another message
              </PillButton>
            </motion.div>
          </motion.div>
        ) : (
          /* ================================================================
             DEFAULT & FAILED ANIMATION FORM STATE
             ================================================================ */
          <motion.form
            key="contact-form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-left"
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
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/15 p-4 text-left shadow-md backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.5, rotate: -25 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.div>
                  <div className="flex-1 font-body text-sm text-red-100">
                    <p className="font-semibold text-red-100">
                      Unable to send message
                    </p>
                    <p className="mt-0.5 text-xs text-red-200/90 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={labelBase}>
                  Name <span className="text-zyk-primary">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="Your name"
                  className={fieldBase}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={labelBase}>
                  Email <span className="text-zyk-primary">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="you@example.com"
                  className={fieldBase}
                />
              </div>
            </div>

            {/* Purpose / Subject Dropdown */}
            <div className="mt-4">
              <label htmlFor="contact-subject" className={labelBase}>
                Purpose <span className="text-zyk-primary">*</span>
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
                    className="bg-zyk-bg-end text-zyk-heading/60"
                  >
                    Select a purpose…
                  </option>
                  {PURPOSE_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-white text-zinc-900 py-1"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zyk-brown/60">
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
                Message <span className="text-zyk-primary">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={setField("message")}
                placeholder="Tell me a little about your project, idea, or questions…"
                className={`${fieldBase} resize-y`}
              />
            </div>

            {/* Spam Protection Honeypot: visually hidden & offscreen */}
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
                className="min-w-[170px]"
              >
                {status === "submitting" ? (
                  <span className="inline-flex items-center gap-2">
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
                    Sending…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    Send message
                    <svg
                      className="h-4 w-4 -rotate-45 transition-transform duration-200 group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
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
