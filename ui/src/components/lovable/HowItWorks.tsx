import { motion } from "framer-motion";
import { Upload, Cpu, Settings2, Rocket } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Input Requirements",
    description: "Paste user stories, requirements docs, Jira tickets, or feature specs. Our AI understands natural language and structured formats.",
    color: "text-cyan",
  },
  {
    icon: Cpu,
    number: "02",
    title: "AI Generates Tests",
    description: "Our deep learning engine analyzes context, identifies test scenarios, and generates comprehensive test plans and automation code in seconds.",
    color: "text-violet",
  },
  {
    icon: Settings2,
    number: "03",
    title: "Review & Customize",
    description: "Fine-tune outputs, adjust coverage priorities, select your preferred framework, and configure test data generation settings.",
    color: "text-emerald",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Export & Execute",
    description: "Download production-ready code, push to CI/CD pipeline, or trigger execution directly from the platform. Start testing immediately.",
    color: "text-amber",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 px-6 overflow-hidden">
      {/* Background line */}
      <div className="absolute left-1/2 top-48 bottom-32 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            How It Works
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Four steps to <span className="text-gradient">complete automation</span>
          </h2>
        </motion.div>

        <div className="mt-20 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group"
            >
              <div className="rounded-2xl border border-border bg-card/50 glass p-6 card-hover h-full">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-4xl font-black text-border/80 group-hover:text-primary/30 transition-colors">{step.number}</span>
                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-secondary transition-all group-hover:scale-110`}>
                  <step.icon className={`h-5 w-5 ${step.color}`} />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connector arrow (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="h-px w-6 bg-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
