import { PenLine, Sparkles, Zap, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SilicogenLogo from "@/components/SilicogenLogo";
import SubNavbar from "@/components/landing/SubNavbar";
import { motion } from "framer-motion";

const topics = [
  { label: "AI & RTL", color: "accent" },
  { label: "Deep Dives", color: "accent-secondary" },
  { label: "Product", color: "accent" },
  { label: "Research", color: "accent-secondary" },
];

const floatingIcons = [
  { Icon: PenLine, x: "8%", y: "25%", delay: 0, size: 20 },
  { Icon: Sparkles, x: "88%", y: "18%", delay: 0.6, size: 22 },
  { Icon: Zap, x: "80%", y: "72%", delay: 1.2, size: 18 },
  { Icon: Layers, x: "12%", y: "68%", delay: 0.9, size: 20 },
];

const Blog = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Dramatic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--accent-secondary)/0.04)] blur-[150px] dark:bg-[hsl(var(--accent-secondary)/0.03)]" />
        <div className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-accent/[0.03] blur-[120px] dark:bg-accent/[0.02]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent-secondary)/0.3)] to-transparent dark:via-[hsl(var(--accent-secondary)/0.2)]" />
        {/* Diagonal lines */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, hsl(var(--accent-secondary)) 0, hsl(var(--accent-secondary)) 1px, transparent 1px, transparent 60px)",
          }}
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, x, y, delay, size }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-[hsl(var(--accent-secondary)/0.1)]"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + delay, duration: 0.8, type: "spring" }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon size={size} />
          </motion.div>
        </motion.div>
      ))}

      <SubNavbar />

      {/* Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent-secondary)/0.2)] bg-[hsl(var(--accent-secondary)/0.05)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--accent-secondary))]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--accent-secondary))] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--accent-secondary))]" />
              </span>
              Launching Soon
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mb-6 text-5xl font-black tracking-tight sm:text-7xl"
          >
            <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
              Blog
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="mx-auto mb-4 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Engineering deep dives, AI breakthroughs in silicon design, and
              the future of hardware — straight from the Silicogen team.
            </p>
            <p className="mb-10 text-sm text-muted-foreground/50">
              First posts dropping soon. Stay close.
            </p>
          </motion.div>

          {/* Topic pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mb-12 flex flex-wrap items-center justify-center gap-3"
          >
            {topics.map((topic, i) => (
              <motion.span
                key={topic.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.4 }}
                className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                  topic.color === "accent"
                    ? "border-accent/15 bg-accent/5 text-accent/60"
                    : "border-[hsl(var(--accent-secondary)/0.15)] bg-[hsl(var(--accent-secondary)/0.05)] text-[hsl(var(--accent-secondary)/0.6)]"
                }`}
              >
                {topic.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Placeholder article cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mx-auto mb-12 grid max-w-lg gap-3"
          >
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-border bg-card/50 px-5 py-4 shadow-sm backdrop-blur-sm dark:border-border/50 dark:bg-card/30 dark:shadow-none"
              >
                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-secondary" />
                <div className="flex-1 space-y-2 text-left">
                  <div
                    className="h-3 rounded bg-secondary"
                    style={{ width: `${70 - i * 15}%` }}
                  />
                  <div
                    className="h-2 rounded bg-secondary/50"
                    style={{ width: `${90 - i * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
          <SilicogenLogo size={16} showText={false} />
          <span className="text-xs text-muted-foreground/40">
            © 2026 Silicogen Inc.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
