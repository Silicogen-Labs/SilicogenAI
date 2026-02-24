import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SilicogenLogo from "@/components/SilicogenLogo";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { label: "Home", to: "/" },
  { label: "Docs", to: "/docs" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
  { label: "Book Demo", to: "/book-demo" },
];

const SubNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[95%] max-w-4xl -translate-x-1/2">
      <div className="flex h-14 items-center justify-between rounded-full border border-border/50 bg-background/80 px-6 shadow-lg backdrop-blur-xl">
        <a href="/" className="flex items-center">
          <SilicogenLogo size={28} showText={false} />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className={`text-[13px] font-medium uppercase tracking-[0.05em] transition-colors duration-200 ${
                pathname === link.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            className="text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mt-2 rounded-2xl border border-border/50 bg-background/95 shadow-lg backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 p-3">
            {links.map((link) => (
              <button
                key={link.to}
                onClick={() => {
                  setMobileOpen(false);
                  navigate(link.to);
                }}
                className={`rounded-lg px-4 py-3 text-left text-sm font-medium uppercase tracking-wider transition-colors ${
                  pathname === link.to
                    ? "bg-accent/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default SubNavbar;
