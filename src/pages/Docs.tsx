import { BookOpen, Terminal, Code2, Cpu, FileText, Braces, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SilicogenLogo from "@/components/SilicogenLogo";
import SubNavbar from "@/components/landing/SubNavbar";
import { motion } from "framer-motion";

const floatingIcons = [
  { Icon: Terminal, x: "10%", y: "20%", delay: 0, size: 20 },
  { Icon: Code2, x: "85%", y: "15%", delay: 0.5, size: 24 },
  { Icon: Cpu, x: "75%", y: "75%", delay: 1, size: 18 },
  { Icon: BookOpen, x: "15%", y: "70%", delay: 1.5, size: 22 },
];

const Docs = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Dramatic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[150px] dark:bg-accent/[0.03]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent dark:via-accent/20" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, x, y, delay, size }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-accent/10"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + delay, duration: 0.8, type: "spring" }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
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
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              In Development
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mb-6 text-5xl font-black tracking-tight sm:text-7xl"
          >
            <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
              Docs
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="mx-auto mb-4 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Comprehensive API references, integration guides, and deep-dive
              tutorials — built for engineers who ship silicon.
            </p>
            <p className="mb-12 text-sm text-muted-foreground/50">
              We're writing every page with the same precision we put into our models.
            </p>
          </motion.div>

          {/* Doc category cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mx-auto grid max-w-lg gap-4 sm:grid-cols-2"
          >
            {[
              { icon: Braces, label: "API Reference", status: "Draft" },
              { icon: FileText, label: "Getting Started", status: "Soon" },
              { icon: Layers, label: "Architecture", status: "Soon" },
              { icon: Terminal, label: "CLI Guide", status: "Soon" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-accent/20 hover:bg-card/80 dark:border-border/50 dark:bg-card/30 dark:shadow-none dark:hover:bg-card/50"
              >
                <div className="rounded-lg border border-border bg-muted/30 p-2">
                  <item.icon size={18} className="text-accent/60" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground/80">{item.label}</p>
                </div>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent/50">
                  {item.status}
                </span>
              </motion.div>
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

export default Docs;
