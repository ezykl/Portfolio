import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { PillButton } from "../ui/PillButton";

/**
 * Developer-themed Contact Form powered by EmailJS (@emailjs/browser).
 *
 * Design language mirrors the terminal email template:
 *  - Dark #020617 / #0a0f1e backgrounds with radial indigo/cyan glows
 *  - macOS-style window chrome bar with traffic-light dots and filename tab
 *  - JetBrains Mono monospace labels and telemetry lines
 *  - JSON-style payload preview in the success state
 *  - Cyan (#38bdf8) / indigo (#6366f1) / green (#4ade80) accent palette
 *
 * Dispatches two emails upon submission:
 *  1. Notification to portfolio owner (with reply_to set to visitor's email).
 *  2. Auto-confirmation receipt to the visitor.
 *
 * Anti-spam: invisible honeypot field + bot timing check (<1.5s).
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

// Dev-centric, terminal-flavoured purpose options
const PURPOSE_OPTIONS = [
  { value: "build_together", label: "🛠️  Build something together" },
  { value: "job_contract", label: "💼  Job / Contract opportunity" },
  { value: "opensource", label: "🤝  Open source collaboration" },
  { value: "code_review", label: "🔍  Code review / technical feedback" },
  { value: "saying_hi", label: "👋  Just saying hi" },
];

const fieldBase =
  "w-full rounded-lg border border-white/10 bg-[#0a0f1e] px-4 py-3 font-body " +
  "text-slate-100 placeholder-slate-600 shadow-inner transition-all duration-200 " +
  "focus:border-sky-400/60 focus:bg-[#060c1a] focus:outline-none focus:ring-2 focus:ring-sky-400/20";

// Label: monospace + comment style
const labelBase =
  "mb-1.5 flex items-center gap-2 font-display text-[11px] uppercase tracking-widest text-slate-400";

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({ name: "", email: "", subject: "", message: "" });

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
    if (!form.name.trim()) return "name is required";
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim()))
      return "valid email is required";
    if (!form.subject) return "please select a purpose";
    if (form.message.trim().length < 10)
      return "message must be at least 10 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const elapsedMs = Date.now() - mountTimeRef.current;
    if (form.company || elapsedMs < 1500) {
      setSubmittedData({
        name: form.name || "visitor",
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
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
        "EmailJS credentials missing — check VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_NOTIFICATION_ID, VITE_EMAILJS_PUBLIC_KEY in .env",
      );
      setErrorCount((c) => c + 1);
      return;
    }

    const purposeLabel =
      PURPOSE_OPTIONS.find((o) => o.value === form.subject)?.label.replace(
        /^.{2}\s+/,
        "",
      ) ?? form.subject;

    try {
      await emailjs.send(
        serviceId,
        notificationTemplateId,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: purposeLabel,
          message: form.message.trim(),
          reply_to: form.email.trim(),
          from_name: form.name.trim(),
          from_email: form.email.trim(),
        },
        { publicKey },
      );

      if (confirmationTemplateId) {
        try {
          await emailjs.send(
            serviceId,
            confirmationTemplateId,
            {
              to_name: form.name.trim(),
              to_email: form.email.trim(),
              subject: purposeLabel,
              message: form.message.trim(),
            },
            { publicKey },
          );
        } catch (err) {
          console.warn("Auto-confirmation failed:", err);
        }
      }

      setSubmittedData({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: purposeLabel,
        message: form.message.trim(),
      });
      setStatus("success");
      setForm(EMPTY_FORM);
      mountTimeRef.current = Date.now();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setError("Failed to dispatch — check network connection and try again.");
      setErrorCount((c) => c + 1);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setError(null);
    mountTimeRef.current = Date.now();
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <AnimatePresence mode="wait">
        {/* ============================================================
            SUCCESS — mirrors the terminal email template aesthetic
            ============================================================ */}
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
          >
            {/* Prompt line above card */}
            <div className="mb-2.5 font-display text-[11px] tracking-wide text-slate-500">
              ~/portfolio/contact-form <span className="text-sky-400">%</span>{" "}
              ./notify --received
            </div>

            {/* Terminal card */}
            <div
              className="overflow-hidden rounded-xl border border-white/10 text-left"
              style={{
                background: "rgba(15,23,42,0.90)",
                boxShadow:
                  "0 0 0 1px rgba(56,189,248,0.18), 0 0 40px rgba(56,189,248,0.07), 0 25px 60px rgba(0,0,0,0.55)",
              }}
            >
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#0a0f1e] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-display text-[11px] tracking-wider text-slate-500">
                  received.tsx
                </span>
                <span className="w-14" />
              </div>

              {/* Gradient header */}
              <div
                className="border-b border-white/[0.07] px-8 py-7 text-center"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(99,102,241,0.28) 0%, rgba(10,15,30,0.96) 55%, rgba(34,211,238,0.20) 100%)",
                }}
              >
                {/* Animated checkmark badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 18,
                    delay: 0.1,
                  }}
                  className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: [1, 1.6, 1.3], opacity: [0.4, 0.1, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-full bg-emerald-400/25"
                  />
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(74,222,128,0.15), rgba(10,15,30,0.9))",
                      boxShadow: "0 0 20px rgba(74,222,128,0.2)",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="font-body text-xl font-bold tracking-tight text-slate-50"
                >
                  Got your message{" "}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mb-0.5 inline-block"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="#4ade80"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-1.5 font-body text-sm text-slate-500"
                >
                  Thanks for stopping by my portfolio
                </motion.p>
              </div>

              {/* Body */}
              <div className="px-7 py-6">
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4 font-body text-[15px] font-semibold text-slate-200"
                >
                  Hi <span className="text-sky-300">{submittedData.name}</span>,
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-5 font-body text-sm leading-relaxed text-slate-400"
                >
                  I&apos;ve logged your request and will review it within 24–48
                  hours.
                </motion.p>

                {/* JSON payload block */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-5 rounded-lg border border-white/[0.08] bg-[#0a0f1e] p-4 font-display text-[12.5px] leading-loose"
                  style={{ boxShadow: "inset 0 1px 4px rgba(0,0,0,0.5)" }}
                >
                  <span className="text-slate-500">const</span>{" "}
                  <span className="text-sky-300">inquiry</span>{" "}
                  <span className="text-slate-500">=</span>{" "}
                  <span className="text-slate-500">{"{"}</span>
                  <br />
                  &nbsp;&nbsp;
                  <span className="text-sky-300">to</span>
                  <span className="text-slate-500">:</span>{" "}
                  <span className="text-emerald-400">
                    &quot;{submittedData.name}&quot;
                  </span>
                  <span className="text-slate-500">,</span>
                  <br />
                  &nbsp;&nbsp;
                  <span className="text-sky-300">subject</span>
                  <span className="text-slate-500">:</span>{" "}
                  <span className="text-emerald-400">
                    &quot;{submittedData.subject}&quot;
                  </span>
                  <span className="text-slate-500">,</span>
                  <br />
                  &nbsp;&nbsp;
                  <span className="text-sky-300">status</span>
                  <span className="text-slate-500">:</span>{" "}
                  <span className="text-yellow-400">&quot;received&quot;</span>
                  <br />
                  <span className="text-slate-500">{"}"}</span>
                </motion.div>

                {/* Message block with line numbers */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mb-6 overflow-hidden rounded-r-xl border border-white/[0.08] border-l-sky-400"
                  style={{
                    background: "rgba(2,6,23,0.75)",
                    borderLeftWidth: "2px",
                  }}
                >
                  <div className="px-4 pt-3 font-display text-[10px] font-bold uppercase tracking-widest text-sky-400">
                    // message.txt
                  </div>
                  <div className="flex gap-3 px-4 pb-4 pt-2">
                    <span className="select-none pt-0.5 font-display text-xs text-slate-600">
                      1
                    </span>
                    <p className="font-body text-sm leading-relaxed text-slate-300">
                      {submittedData.message}
                      <span className="animate-pulse text-sky-400">▌</span>
                    </p>
                  </div>
                </motion.div>

                {/* Terminal status lines */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 space-y-1 font-display text-[11.5px] text-slate-500"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✔</span>
                    <span>
                      message routed to{" "}
                      <span className="text-slate-300">Ezekiel Villadolid</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sky-400">✔</span>
                    <span>
                      receipt dispatched to{" "}
                      <span className="text-slate-300">
                        {submittedData.email}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">&gt;</span>
                    <span>expect response within 24–48 hours</span>
                  </div>
                </motion.div>

                {/* Reset CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="flex justify-center"
                >
                  <PillButton
                    variant="secondary"
                    type="button"
                    onClick={handleReset}
                    className="font-display text-xs tracking-wider"
                  >
                    // send another transmission
                  </PillButton>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.07] bg-[#0a0f1e] px-7 py-3">
                <p className="font-body text-[10.5px] text-slate-500">
                  <span className="text-emerald-400">✔</span> sent to{" "}
                  <span className="text-slate-400">{submittedData.email}</span>{" "}
                  · auto-generated, no reply needed
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ============================================================
             FORM STATE — window chrome + glow card
             ============================================================ */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* Prompt line above the card */}
            <div className="mb-2.5 font-display text-[11px] tracking-wide text-slate-500">
              ~/portfolio/contact-form <span className="text-sky-400">%</span>{" "}
              ./send --new
            </div>

            <div
              className="overflow-hidden rounded-xl border border-white/10 text-left"
              style={{
                background: "rgba(15,23,42,0.85)",
                boxShadow:
                  "0 0 0 1px rgba(56,189,248,0.12), 0 0 50px rgba(99,102,241,0.08), 0 25px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#0a0f1e] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-display text-[11px] tracking-wider text-slate-500">
                  contact.tsx
                </span>
                <span className="w-14" />
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="px-6 py-6 md:px-8 md:py-7"
              >
                {/* Error banner — shake animation */}
                <AnimatePresence>
                  {status === "error" && error && (
                    <motion.div
                      key={`err-${errorCount}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        x: [0, -9, 9, -6, 6, -3, 3, 0],
                      }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{
                        x: { duration: 0.4, ease: "easeInOut" },
                        opacity: { duration: 0.2 },
                      }}
                      className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3"
                    >
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/80">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 14,
                          }}
                          className="block h-2 w-2 animate-pulse rounded-full bg-red-200"
                        />
                      </div>
                      <div>
                        <p className="font-display text-[10px] uppercase tracking-widest text-red-400">
                          // error — {error}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name + Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelBase}>
                      <span>name</span>
                      <span className="text-indigo-400/70">// string</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={setField("name")}
                      placeholder="Alex Chen"
                      className={fieldBase}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelBase}>
                      <span>email</span>
                      <span className="text-indigo-400/70">// string</span>
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

                {/* Purpose dropdown */}
                <div className="mt-4">
                  <label htmlFor="contact-subject" className={labelBase}>
                    <span>purpose</span>
                    <span className="text-indigo-400/70">// enum</span>
                  </label>
                  <div className="relative">
                    <select
                      id="contact-subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={setField("subject")}
                      className={`${fieldBase} cursor-pointer appearance-none pr-10`}
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#0a0f1e] text-slate-500"
                      >
                        Select purpose…
                      </option>
                      {PURPOSE_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-[#0a0f1e] py-1 text-slate-100"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
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

                {/* Message — code-block style */}
                <div className="mt-4">
                  <label htmlFor="contact-message" className={labelBase}>
                    <span>message</span>
                    <span className="text-indigo-400/70">// string</span>
                  </label>
                  {/* Code-file wrapper */}
                  <div
                    className="overflow-hidden rounded-lg border border-white/[0.08] border-l-sky-400/60 bg-[#020617]"
                    style={{ borderLeftWidth: "2px" }}
                  >
                    <div className="px-4 pt-2.5 font-display text-[10px] font-bold uppercase tracking-widest text-sky-400/80">
                      // message.txt
                    </div>
                    <div className="flex gap-3 px-4 pb-3 pt-1">
                      <span className="select-none pt-3 font-display text-[11px] leading-relaxed text-slate-600">
                        1
                      </span>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={setField("message")}
                        placeholder="Describe your project, idea, or opportunity…"
                        className={
                          "w-full resize-y bg-transparent py-2 font-body text-sm text-slate-200 " +
                          "placeholder-slate-600 focus:outline-none leading-relaxed"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Honeypot */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
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

                {/* Submit */}
                <div className="mt-6 flex justify-center">
                  <PillButton
                    variant="primary"
                    type="submit"
                    disabled={status === "submitting"}
                    className="min-w-[210px]"
                  >
                    {status === "submitting" ? (
                      <span className="inline-flex items-center gap-2 font-display text-xs tracking-wider">
                        <svg
                          className="h-4 w-4 animate-spin"
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
                        [ transmitting... ]
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 font-display text-xs tracking-wider">
                        Transmit Message
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
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    )}
                  </PillButton>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
