import SilicogenLogo from "@/components/SilicogenLogo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Documentation", href: "/docs" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/Silicogen-Labs", external: true },
      { label: "Twitter / X", href: "https://x.com/SilicogenLabs", external: true },
      { label: "YouTube", href: "https://www.youtube.com/@silicogenLABS", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-10">
          {/* Brand column */}
          <div>
            <SilicogenLogo size={28} showText={false} />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground/60">
              AI-powered chip design tools for the next generation of silicon.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="mb-10 text-center">
            <div className="flex justify-center">
              <SilicogenLogo size={28} showText={false} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground/60">
              AI-powered chip design for next-gen silicon.
            </p>
          </div>

          {/* 3-column link grid */}
          <div className="grid grid-cols-3 gap-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 md:mt-16 md:flex-row md:justify-between">
          <p className="text-xs text-muted-foreground/60">
            © 2026 Silicogen Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground/50">
            <a href="https://github.com/Silicogen-Labs" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">GitHub</a>
            <a href="https://x.com/SilicogenLabs" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">X</a>
            <a href="https://www.youtube.com/@silicogenLABS" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
