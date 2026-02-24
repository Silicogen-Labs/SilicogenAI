const logos = [
"NVIDIA", "Qualcomm", "Synopsys", "Cadence", "Intel",
"AMD", "TSMC", "Broadcom", "ARM", "Samsung",
"MediaTek", "Marvell"];


const LogoCarousel = () => {
  return (
    <section className="border-y border-border py-16">
      <p className="mb-10 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
        Trusted by Engineers From 
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-scroll-left flex w-max items-center gap-16">
          {[...logos, ...logos].map((name, i) =>
          <span
            key={i}
            className="whitespace-nowrap text-base font-semibold tracking-wide text-muted-foreground/30 transition-colors duration-300 hover:text-muted-foreground/70">

              {name}
            </span>
          )}
        </div>
      </div>
    </section>);

};

export default LogoCarousel;