import { motion } from "framer-motion";

const stats = [
  { value: "10x", label: "Faster VLSI Development" },
  { value: "500+", label: "Designs & Scripts Generated" },
  { value: "99.2%", label: "Output Accuracy Rate" },
];

const StatsSection = () => {
  return (
    <section className="border-t border-border px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <p className="mb-12 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
          By the Numbers
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-xl border border-border bg-card p-8 text-center transition-all duration-300 hover:border-accent/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_hsl(var(--accent)/0.06)]"
            >
              <p className="bg-gradient-to-b from-foreground to-muted-foreground/60 bg-clip-text text-4xl font-black tracking-tight text-transparent transition-all duration-300 group-hover:from-accent group-hover:to-accent/60 sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
