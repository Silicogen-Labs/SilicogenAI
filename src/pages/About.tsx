import { useNavigate } from "react-router-dom";
import SilicogenLogo from "@/components/SilicogenLogo";
import SubNavbar from "@/components/landing/SubNavbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SubNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.04)_0%,transparent_50%)]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-accent"
          >
            Silicogen Labs
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight"
          >
            Silicogen Labs is a research lab — software first, but driving
            innovation into every field we touch.
          </motion.h1>
        </div>
      </section>

      {/* Story — two column, Linear-style */}
      <section className="border-t border-border px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-[140px_1fr] sm:gap-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent"
          >
            Our story
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg leading-[1.7] text-muted-foreground sm:text-xl">
              Most EDA software was architected before deep learning existed.
              Engineers still manually write thousands of lines of Verilog,
              hand-craft UVM testbenches, and wrestle with TCL scripts from
              the early 2000s. The tools work — but they haven't kept up.
            </p>
            <p className="text-lg leading-[1.7] text-muted-foreground sm:text-xl">
              Silicogen Labs started with a question:{" "}
              <span className="text-foreground">
                what if LLMs could reason about hardware the way they reason
                about software?
              </span>{" "}
              Not surface-level code generation, but understanding timing
              constraints, synthesis targets, and hierarchical design.
            </p>
            <p className="text-lg leading-[1.7] text-muted-foreground sm:text-xl">
              We're a small team of engineers who've worked across ASIC design,
              FPGA prototyping, and ML infrastructure. We built Silicogen
              because we were tired of waiting for the tools to catch up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission — single focused block */}
      <section className="border-t border-border px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-[140px_1fr] sm:gap-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent"
          >
            Mission
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-2xl font-medium leading-[1.5] text-foreground sm:text-3xl">
              Make professional-grade chip design accessible to every engineer
              and every team — not just the ones who can afford seven-figure
              EDA licenses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How we work — asymmetric, not a grid */}
      <section className="border-t border-border px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-[140px_1fr] sm:gap-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent"
          >
            How we work
          </motion.p>

          <div className="space-y-12">
            {[
              {
                title: "Correctness over speed",
                body: "There's no patch Tuesday for a taped-out chip. Everything we ship is validated against real synthesis and verification flows before it reaches users.",
              },
              {
                title: "Privacy as a hard constraint",
                body: "Silicogen doesn't see your source code. We don't collect your designs, your netlists, or your testbenches. Your IP stays on your infrastructure.",
              },
              {
                title: "Small team, high leverage",
                body: "We're deliberately small. No middle management, no product committees. Engineers talk to engineers. We ship weekly.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-4xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">
              Want to try Silicogen?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We're onboarding early teams now — reach out at{" "}
              <a
                href="mailto:silicogenlabs@gmail.com"
                className="text-accent transition-colors hover:text-foreground"
              >
                silicogenlabs@gmail.com
              </a>
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="h-11 shrink-0 rounded-full px-7 text-[12px] font-bold uppercase tracking-wider"
          >
            Explore Silicogen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <SilicogenLogo size={18} showText={false} />
            <span className="text-xs text-muted-foreground/50">
              © 2026 Silicogen Inc.
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-xs text-muted-foreground/50 transition-colors hover:text-foreground"
          >
            Home
          </button>
        </div>
      </footer>
    </div>
  );
};

export default About;
