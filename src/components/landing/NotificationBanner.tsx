import { useState } from "react";
import { X } from "lucide-react";

const NotificationBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 flex h-10 items-center justify-center border-b border-accent/30 px-6"
      style={{
        background:
          "linear-gradient(90deg, hsl(var(--accent) / 0.06) 0%, hsl(var(--accent-secondary) / 0.04) 100%)",
      }}
    >
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
          New
        </span>
        <span className="text-muted-foreground">
          Silicogen v2.0 — 3x faster synthesis & SystemVerilog support
        </span>
        <a
          href="#"
          className="hidden font-medium text-foreground transition-colors hover:text-accent sm:inline"
        >
          Learn More →
        </a>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default NotificationBanner;
