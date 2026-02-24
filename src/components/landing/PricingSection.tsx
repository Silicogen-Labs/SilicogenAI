import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Pro",
    price: "$10",
    period: "/mo",
    description: "For engineers shipping silicon. Full access across all VLSI domains.",
    features: [
      "Unlimited generations across all domains",
      "RTL, SoC, CAD scripting & research",
      "PPA optimization reports",
      "Priority support",
      "50+ AI connections",
      "Community access",
    ],
    cta: "Coming Soon",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For design houses and semiconductor companies at scale.",
    features: [
      "Everything in Pro",
      "On-prem deployment option",
      "Custom model fine-tuning",
      "SSO & compliance",
      "Dedicated support system",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="border-t border-border px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free during early access. Scale with Pro or Enterprise.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative rounded-xl border bg-card p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_hsl(var(--accent)/0.08)] ${
                plan.popular
                  ? "border-accent/40 glow-accent"
                  : "border-border hover:border-accent/20"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                  Most Popular
                </span>
              )}

              <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-8 w-full rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 ${
                  plan.popular
                    ? "shadow-[0_8px_24px_hsl(var(--accent)/0.15)] hover:shadow-[0_12px_32px_hsl(var(--accent)/0.25)]"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
