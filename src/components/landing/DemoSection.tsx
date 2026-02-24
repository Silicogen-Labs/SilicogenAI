import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Monitor, Terminal, Maximize2, X } from "lucide-react";

const DemoSection = () => {
  const [activeTab, setActiveTab] = useState<"cli" | "web">("cli");
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const videoSrc = "https://www.youtube-nocookie.com/embed/JExvMDzboLo?autoplay=1&rel=0&modestbranding=1&controls=0&showinfo=0&iv_load_policy=3&disablekb=0&fs=0&color=white&playsinline=1&vq=hd1080";

  const videoEmbed = (
    <div className="relative h-full w-full overflow-hidden">
      <iframe
        src={videoSrc}
        title="Silicogen CLI Demo"
        className="absolute inset-0 h-[calc(100%+120px)] w-full -top-[60px]"
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
      />
      {/* Overlay to block YouTube click interactions (title, share, etc.) — only top area */}
      <div className="absolute inset-x-0 top-0 h-16 z-10" />
    </div>
  );

  return (
    <>
      <section className="border-t border-border px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              See it in action
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Watch Silicogen generate production-ready RTL from natural language.
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="mx-auto mb-8 flex max-w-4xl items-center justify-center gap-2">
            <button
              onClick={() => { setActiveTab("cli"); setPlaying(false); }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "cli"
                  ? "bg-accent text-accent-foreground shadow-[0_0_20px_hsl(var(--accent)/0.2)]"
                  : "border border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-foreground"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              CLI
            </button>
            <button
              onClick={() => setActiveTab("web")}
              className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/40 cursor-default"
            >
              <Monitor className="h-3.5 w-3.5" />
              Web App
              <span className="ml-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Soon
              </span>
            </button>
          </div>

          {/* CLI View */}
          <AnimatePresence mode="wait">
            {activeTab === "cli" && (
              <motion.div
                key="cli"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-card glow-accent"
              >
                {/* Terminal header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
                    <span className="ml-3 font-mono text-[11px] text-muted-foreground/40">
                      silicogen — demo
                    </span>
                  </div>
                  {playing && (
                    <button
                      onClick={() => setFullscreen(true)}
                      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Maximize2 className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Video area */}
                <div className="relative aspect-video w-full bg-background">
                  {!playing ? (
                    <button
                      onClick={() => setPlaying(true)}
                      className="group absolute inset-0 flex flex-col items-center justify-center gap-5 transition-all"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-sm transition-all group-hover:scale-105 group-hover:border-muted-foreground/30">
                        <Play className="ml-0.5 h-6 w-6 text-muted-foreground" fill="currentColor" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground/80">Watch the demo</p>
                        <p className="mt-1 font-mono text-[11px] text-muted-foreground/50">
                          Click to play · 2 min
                        </p>
                      </div>
                    </button>
                  ) : (
                    videoEmbed
                  )}
                </div>

                {/* Bottom status bar */}
                <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground/30">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                    {playing ? "Playing" : "Ready"}
                  </span>
                  <span>silicogen v0.1.0</span>
                  <span className="ml-auto">CLI Interface</span>
                </div>
              </motion.div>
            )}

            {/* Web View (Coming Soon) */}
            {activeTab === "web" && (
              <motion.div
                key="web"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-xl border border-border bg-card py-24"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/30">
                  <Monitor className="h-7 w-7 text-muted-foreground/30" />
                </div>
                <p className="text-lg font-semibold text-foreground">Web App Coming Soon</p>
                <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground/60">
                  A full browser-based experience is on its way. Stay tuned.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video w-full max-w-6xl overflow-hidden rounded-xl border border-border shadow-2xl">
              {videoEmbed}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DemoSection;
