import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const CtaSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail) return;

    setStatus("submitting");

    try {
      const payload = new URLSearchParams({
        "form-name": "waitlist",
        email: normalizedEmail,
        subject: "New waitlist signup (%{siteName})",
      });

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });

      if (!response.ok) throw new Error("Waitlist submission failed");

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="waitlist"
      className="relative scroll-mt-24 overflow-hidden border-t border-border px-6 py-28 sm:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, hsl(var(--accent) / 0.06) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Stop writing boilerplate.
          <br />
          <span className="text-muted-foreground">Start shipping silicon.</span>
        </h2>

        <form
          name="waitlist"
          method="POST"
          action="/"
          netlify-honeypot="bot-field"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex w-full max-w-lg flex-col items-center gap-3 sm:flex-row"
        >
          <input type="hidden" name="form-name" value="waitlist" />
          <input type="hidden" name="bot-field" />
          <input type="hidden" name="subject" value="New waitlist signup (%{siteName})" />

          <div className="relative w-full flex-1">
            <input
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
              className="h-14 w-full rounded-2xl border border-border/60 bg-card/80 px-5 pr-36 text-sm text-foreground placeholder:text-muted-foreground/40 backdrop-blur-sm transition-all duration-300 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_30px_hsl(var(--accent)/0.08)] sm:pr-40"
            />
            <Button
              disabled={status === "submitting"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-10 shrink-0 rounded-xl px-5 text-[11px] font-bold uppercase tracking-wider shadow-md transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 sm:px-6 sm:text-[12px]"
            >
              Join Waitlist
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
        <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
          {status === "success" && "Thanks. You are on the waitlist."}
          {status === "error" && "Could not submit right now. Please try again."}
          {status === "submitting" && "Submitting..."}
        </p>

      </motion.div>
    </section>
  );
};

export default CtaSection;
