import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";

const HeroSection = () => {
  const handleScrollToWaitlist = () => {
    const waitlistSection = document.getElementById("waitlist");
    if (!waitlistSection) return;

    waitlistSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center px-6 pt-28">
      {/* Background gradient orbs */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 60% 25%, hsl(var(--accent) / 0.05) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 20% 60%, hsl(var(--accent-secondary) / 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Logo wordmark — typewriter */}
        <div className="mb-10 flex items-center justify-center">
          <div className="flex items-center whitespace-nowrap">
            {"SILICOGEN".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                className={`text-5xl font-black uppercase tracking-[0.15em] sm:text-7xl lg:text-8xl ${
                  i >= 6 ? "text-accent" : "text-foreground"
                }`}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-5xl font-black leading-[1.08] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[72px]"
        >
          Design silicon{" "}
          <span className="text-accent">faster</span>
          <br className="hidden sm:block" />
          {" "}with AI
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-6 max-w-[600px] text-lg leading-[1.7] text-muted-foreground"
        >
          Silicogen generates production-ready RTL, testbenches, and EDA scripts
          from natural language. Built for hardware engineers.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            onClick={handleScrollToWaitlist}
            className="h-12 rounded-full px-8 text-[13px] font-bold uppercase tracking-wider shadow-[0_8px_24px_hsl(var(--accent)/0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_hsl(var(--accent)/0.25)]"
          >
            Join the Waitlist
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Terminal-style command */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mx-auto mt-10 inline-flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-3 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_20px_hsl(var(--accent)/0.06)]"
        >
          <Terminal className="h-4 w-4 text-accent" />
          <code className="font-mono text-sm text-muted-foreground">
            <span className="text-accent">$</span> silicogen
          </code>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
