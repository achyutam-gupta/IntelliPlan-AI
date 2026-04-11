import { motion } from "framer-motion";
import { FileText, Code, TestTubes, Brain, Workflow, Shield, Layers, Bug } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: FileText,
    title: "Test Plan Generation",
    description: "Transform requirements into structured, comprehensive test plans with full traceability and coverage mapping.",
    color: "text-cyan",
    bgColor: "bg-cyan/10",
    borderHover: "hover:border-cyan/30",
  },
  {
    icon: TestTubes,
    title: "Smart Test Cases",
    description: "Auto-generate detailed test cases with steps, expected results, preconditions, and intelligent edge case coverage.",
    color: "text-violet",
    bgColor: "bg-violet/10",
    borderHover: "hover:border-violet/30",
  },
  {
    icon: Code,
    title: "Automation Code",
    description: "Get production-ready automation scripts in Selenium, Playwright, Cypress, and any framework of your choice.",
    color: "text-emerald",
    bgColor: "bg-emerald/10",
    borderHover: "hover:border-emerald/30",
  },
  {
    icon: Brain,
    title: "AI Analysis Engine",
    description: "Deep learning models understand your requirements context to suggest the most impactful test scenarios.",
    color: "text-amber",
    bgColor: "bg-amber/10",
    borderHover: "hover:border-amber/30",
  },
  {
    icon: Workflow,
    title: "CI/CD Ready",
    description: "Export tests directly into your pipeline with GitHub Actions, Jenkins, and GitLab CI configurations included.",
    color: "text-cyan",
    bgColor: "bg-cyan/10",
    borderHover: "hover:border-cyan/30",
  },
  {
    icon: Shield,
    title: "Quality Metrics",
    description: "Real-time dashboards tracking coverage, risk analysis, and quality scores across your test suite.",
    color: "text-violet",
    bgColor: "bg-violet/10",
    borderHover: "hover:border-violet/30",
  },
  {
    icon: Bug,
    title: "Defect Prediction",
    description: "AI predicts potential defect areas based on code complexity and historical patterns.",
    color: "text-emerald",
    bgColor: "bg-emerald/10",
    borderHover: "hover:border-emerald/30",
  },
  {
    icon: Layers,
    title: "Multi-Layer Testing",
    description: "Covers unit, integration, API, E2E, and performance testing — all from a single input.",
    color: "text-amber",
    bgColor: "bg-amber/10",
    borderHover: "hover:border-amber/30",
  },
];

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="relative py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            Features
          </motion.span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Everything you need to{" "}
            <span className="text-gradient">automate testing</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            From planning to execution, IntelliPlan AI covers the entire testing lifecycle with enterprise-grade intelligence.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 glass p-6 card-hover ${feature.borderHover}`}
            >
              {/* Hover glow effect */}
              {hoveredIndex === i && (
                <motion.div
                  layoutId="feature-glow"
                  className="absolute inset-0 bg-primary/3 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative z-10">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.bgColor} transition-all group-hover:scale-110`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
