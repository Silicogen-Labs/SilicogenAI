import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ShieldCheck, Cpu, Terminal, FlaskConical, ChevronRight } from "lucide-react";

const capabilities = [
  {
    id: "rtl",
    initials: "RT",
    name: "RTL Design & Coding",
    category: "Core Engine",
    description:
      "Generate synthesizable Verilog, VHDL, and SystemVerilog — FSMs, pipelines, and hierarchical modules from natural language.",
    icon: Code,
    features: ["Verilog / VHDL / SystemVerilog", "FSMs & Pipelines", "Hierarchical Modules", "Parameterized IPs"],
    codeSnippet: `module counter #(parameter WIDTH=8) (\n  input  logic clk, rst_n,\n  output logic [WIDTH-1:0] count\n);\n  always_ff @(posedge clk)\n    count <= !rst_n ? '0 : count + 1;\nendmodule`,
  },
  {
    id: "dv",
    initials: "DV",
    name: "Design Verification",
    category: "Verification Suite",
    description:
      "Automated UVM testbenches, assertions, coverage plans, and constrained-random stimulus generation.",
    icon: ShieldCheck,
    features: ["UVM Testbenches", "SVA Assertions", "Coverage Plans", "Constrained-Random"],
    codeSnippet: `class alu_test extends uvm_test;\n  alu_env env;\n  function void build_phase(...);\n    env = alu_env::type_id::create(...);\n  endfunction\n  task run_phase(...);\n    alu_sequence seq = new();\n    seq.start(env.agent.sqr);\n  endtask\nendclass`,
  },
  {
    id: "soc",
    initials: "SC",
    name: "SoC Integration",
    category: "System-on-Chip",
    description:
      "Bus fabric generation, IP stitching, address map configuration, and system-level interconnect automation.",
    icon: Cpu,
    features: ["AXI/AHB Fabric", "IP Stitching", "Address Maps", "Interconnect Gen"],
    codeSnippet: `axi_interconnect #(\n  .N_MASTERS(3),\n  .N_SLAVES(4),\n  .ADDR_WIDTH(32)\n) u_fabric (\n  .aclk    (sys_clk),\n  .aresetn (sys_rst_n),\n  .m_axi   (master_ports),\n  .s_axi   (slave_ports)\n);`,
  },
  {
    id: "cad",
    initials: "CA",
    name: "CAD Scripting",
    category: "EDA Tooling",
    description:
      "Generate TCL, Python, and Perl scripts for synthesis, P&R, timing analysis, and custom EDA tool flows.",
    icon: Terminal,
    features: ["TCL / Python / Perl", "Synthesis Scripts", "Timing Closure", "P&R Automation"],
    codeSnippet: `# Synthesis flow script\nread_verilog [glob rtl/*.sv]\nset_top_module chip_top\ncreate_clock -period 2.0 [get_ports clk]\nsynthesize -effort high\nreport_timing -slack_lesser_than 0\nwrite_netlist -format verilog`,
  },
  {
    id: "research",
    initials: "RS",
    name: "Research & Exploration",
    category: "R&D Assistant",
    description:
      "Literature review, architecture exploration, PPA trade-off analysis, and novel design methodology research.",
    icon: FlaskConical,
    features: ["Literature Review", "PPA Trade-offs", "Architecture DSE", "Methodology Research"],
    codeSnippet: `# PPA Analysis Report\n┌─────────┬───────┬───────┬──────┐\n│ Config  │ Power │ Freq  │ Area │\n├─────────┼───────┼───────┼──────┤\n│ Base    │ 1.2W  │ 1GHz  │ 2mm² │\n│ Opt-A   │ 0.9W  │ 1.2G  │ 2.1  │\n│ Opt-B   │ 1.0W  │ 1.5G  │ 2.4  │\n└─────────┴───────┴───────┴──────┘`,
  },
];

const ModelsSection = () => {
  const [selected, setSelected] = useState(capabilities[0].id);
  const active = capabilities.find((c) => c.id === selected)!;

  return (
    <section className="border-t border-border px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            What Silicogen can do
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            AI-powered tools spanning RTL, verification, SoC, CAD automation, and research.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-0 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[280px_1fr]">
          {/* Mobile: horizontal scrollable tabs */}
          <div className="flex w-full border-b border-border md:hidden">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              const isActive = selected === cap.id;
              return (
                <button
                  key={cap.id}
                  onClick={() => setSelected(cap.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-center transition-all duration-200 ${
                    isActive
                      ? "border-b-2 border-accent bg-accent/[0.07]"
                      : "border-b-2 border-transparent"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                  <span className={`text-[11px] font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {cap.initials}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop: left panel list */}
          <div className="hidden border-r border-border md:block">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              const isActive = selected === cap.id;
              return (
                 <button
                  key={cap.id}
                  onClick={() => setSelected(cap.id)}
                  className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-accent/[0.07] border-l-2 border-accent"
                      : "border-l-2 border-transparent hover:bg-muted/30 hover:border-accent/20"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {cap.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40">
                      {cap.category}
                    </p>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-all ${isActive ? "text-accent opacity-100" : "text-muted-foreground/20 opacity-0"}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right panel — detail view */}
          <div className="relative min-h-[400px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="flex h-full flex-col p-6 sm:p-8"
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex h-6 items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 font-mono text-[10px] font-bold text-accent">
                      Active
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground sm:text-2xl">{active.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {active.description}
                  </p>
                </div>

                {/* Feature tags */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {active.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-[10px] text-muted-foreground transition-colors duration-200 hover:border-accent/30 hover:text-foreground"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Code preview */}
                <div className="flex-1 overflow-hidden rounded-xl border border-border bg-background">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-destructive/50" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                    <div className="h-2 w-2 rounded-full bg-accent/50" />
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground/30">
                      example output
                    </span>
                  </div>
                  <pre className="overflow-auto p-4 font-mono text-[12px] leading-relaxed text-muted-foreground/80">
                    {active.codeSnippet}
                  </pre>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModelsSection;
