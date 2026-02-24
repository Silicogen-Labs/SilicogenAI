import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SilicogenLogo from "@/components/SilicogenLogo";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setVisible(y < 10 || y < lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NavPageLink = ({ label, to }: { label: string; to: string }) => (
    <button
      onClick={() => navigate(to)}
      className="text-[13px] font-medium uppercase tracking-[0.05em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      {label}
    </button>
  );

  const NavPageLinkMobile = ({ label, to }: { label: string; to: string }) => (
    <button
      onClick={() => {
        setMobileOpen(false);
        navigate(to);
      }}
      className="text-left text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </button>
  );

  return (
    <nav
      className={`fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
        visible ? "top-4 opacity-100" : "-top-20 opacity-0"
      } ${
        scrolled
          ? "border border-border bg-background/80 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      } h-14 w-[95%] max-w-5xl rounded-full px-6`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <SilicogenLogo size={32} showText={false} />
        </a>

        {/* Center links — desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#pricing"
            className="text-[13px] font-medium uppercase tracking-[0.05em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Pricing
          </a>
          <NavPageLink label="Docs" to="/docs" />
          <NavPageLink label="Blog" to="/blog" />
          <NavPageLink label="About" to="/about" />
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button className="h-10 rounded-full px-7 text-[12px] font-bold uppercase tracking-wider transition-all duration-200 hover:shadow-[0_8px_24px_hsl(var(--accent)/0.15)]">
            Book a Demo
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            <a
              href="#pricing"
              className="text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
            <NavPageLinkMobile label="Docs" to="/docs" />
            <NavPageLinkMobile label="Blog" to="/blog" />
            <NavPageLinkMobile label="About" to="/about" />
            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4">
              <Button className="w-full rounded-full text-xs font-bold uppercase tracking-wider">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
