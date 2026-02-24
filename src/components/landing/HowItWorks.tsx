import { motion } from "framer-motion";

const problems = [
  {
    problem: "Engineers spend days writing boilerplate RTL",
    solution: "Describe your module in plain English. Silicogen generates synthesizable Verilog, VHDL, or SystemVerilog — with proper parameterization, clock domains, and hierarchy.",
    detail: "FSMs, pipelines, AXI interfaces — not toy examples.",
  },
  {
    problem: "Verification is the bottleneck, not design",
    solution: "Silicogen auto-generates UVM testbenches, SVA assertions, and coverage plans from your RTL. Constrained-random stimulus included.",
    detail: "Catches bugs before synthesis, not after tape-out.",
  },
  {
    problem: "CAD scripts are tribal knowledge",
    solution: "Generate TCL, Python, and Perl scripts for synthesis, P&R, and timing closure. No more copy-pasting from decade-old wikis.",
    detail: "Works with your existing EDA tool flow.",
  },
];

const HowItWorks = () => {
  return (
    <section className="border-t border-border px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          The problem with chip design today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
        >
          Most EDA workflows haven't changed in 20 years. Silicogen fixes the parts that waste your time.
        </motion.p>

        <div className="mt-16 space-y-0">
          {problems.map((item, i) => (
            <motion.div
              key={item.problem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group border-t border-border py-10 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div className="grid gap-4 sm:grid-cols-[1fr_1.5fr] sm:gap-12">
                <div>
                  <p className="text-base font-bold text-foreground">
                    {item.problem}
                  </p>
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.solution}
                  </p>
                  <p className="mt-3 text-[13px] font-medium text-accent">
                    {item.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
