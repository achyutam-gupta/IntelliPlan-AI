import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "For individuals exploring AI testing",
    features: [
      "50 test cases / month",
      "3 automation scripts / month",
      "Playwright & Cypress support",
      "Community support",
      "Basic test plan templates",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For teams shipping quality software fast",
    features: [
      "Unlimited test cases",
      "Unlimited automation scripts",
      "All frameworks supported",
      "CI/CD pipeline configs",
      "Priority support",
      "API access",
      "Custom test templates",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with advanced needs",
    features: [
      "Everything in Pro",
      "SSO & SAML authentication",
      "Dedicated account manager",
      "Custom AI model training",
      "On-premise deployment",
      "SLA guarantee",
      "Audit logs & compliance",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="relative py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free, scale as you grow. No hidden fees.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative group rounded-2xl border p-8 card-hover ${
                tier.popular
                  ? "glow-border bg-card/60 glass"
                  : "border-border bg-card/30 glass"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/login')}
                className={`mt-8 w-full group/btn flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                    : "border border-border text-foreground hover:bg-secondary hover:border-primary/30"
                }`}
              >
                {tier.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
