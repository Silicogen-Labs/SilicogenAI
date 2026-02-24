import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock } from "lucide-react";
import SubNavbar from "@/components/landing/SubNavbar";
import SilicogenLogo from "@/components/SilicogenLogo";
import { Button } from "@/components/ui/button";

const BookDemo = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedTime = time.trim();

    if (!trimmedName || !trimmedEmail || !trimmedTime) return;

    setStatus("submitting");

    try {
      const payload = new URLSearchParams({
        "form-name": "book-demo",
        name: trimmedName,
        email: trimmedEmail,
        time: trimmedTime,
        message: message.trim(),
        subject: "New book demo request (%{siteName})",
      });

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });

      if (!response.ok) throw new Error("Demo request failed");

      setStatus("success");
      setName("");
      setEmail("");
      setTime("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SubNavbar />

      <main className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 25% 20%, hsl(var(--accent) / 0.05) 0%, transparent 75%), radial-gradient(ellipse 55% 35% at 85% 80%, hsl(var(--accent-secondary) / 0.04) 0%, transparent 75%)",
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-6"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Book a Demo</p>
            <h1 className="max-w-xl text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight">
              Tell us what you need. We will set up a tailored demo.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Share your details and preferred time slot. Our team will reach out at{" "}
              <span className="text-foreground">silicogenlabs@gmail.com</span> with confirmation.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
              <CalendarClock className="h-3.5 w-3.5" />
              Response in 24 hours
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-2xl border border-border bg-card/70 p-6 shadow-[0_10px_35px_hsl(var(--accent)/0.08)] backdrop-blur-sm sm:p-8"
          >
            <form
              name="book-demo"
              method="POST"
              action="/"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <input type="hidden" name="form-name" value="book-demo" />
              <input type="hidden" name="bot-field" />
              <input type="hidden" name="subject" value="New book demo request (%{siteName})" />

              <div className="space-y-2">
                <label htmlFor="book-demo-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Name
                </label>
                <input
                  id="book-demo-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (status === "success" || status === "error") setStatus("idle");
                  }}
                  placeholder="Your full name"
                  className="h-12 w-full rounded-xl border border-border/70 bg-background/70 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="book-demo-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <input
                  id="book-demo-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "success" || status === "error") setStatus("idle");
                  }}
                  placeholder="you@company.com"
                  className="h-12 w-full rounded-xl border border-border/70 bg-background/70 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="book-demo-time" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Preferred Time
                </label>
                <input
                  id="book-demo-time"
                  name="time"
                  type="datetime-local"
                  required
                  value={time}
                  onChange={(event) => {
                    setTime(event.target.value);
                    if (status === "success" || status === "error") setStatus("idle");
                  }}
                  className="h-12 w-full rounded-xl border border-border/70 bg-background/70 px-4 text-sm text-foreground transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="book-demo-message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Message (Optional)
                </label>
                <textarea
                  id="book-demo-message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    if (status === "success" || status === "error") setStatus("idle");
                  }}
                  placeholder="Share your use case, team size, or anything we should prepare."
                  className="w-full rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
              </div>

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="h-12 w-full rounded-full text-[12px] font-bold uppercase tracking-wider shadow-[0_8px_22px_hsl(var(--accent)/0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_hsl(var(--accent)/0.25)]"
              >
                Request Demo
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground" aria-live="polite">
                {status === "success" && "Thanks. Your demo request has been submitted."}
                {status === "error" && "Could not submit right now. Please try again."}
                {status === "submitting" && "Submitting..."}
              </p>
            </form>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2">
          <SilicogenLogo size={18} showText={false} />
          <span className="text-xs text-muted-foreground/50">© 2026 Silicogen Inc.</span>
        </div>
      </footer>
    </div>
  );
};

export default BookDemo;
