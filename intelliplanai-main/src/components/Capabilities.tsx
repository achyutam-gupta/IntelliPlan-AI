import { motion } from "framer-motion";
import { Check } from "lucide-react";

const capabilities = [
  { text: "Test Plan Documents (IEEE 829)", category: "Planning" },
  { text: "Functional & Non-Functional Test Cases", category: "Planning" },
  { text: "BDD / Gherkin Scenarios", category: "Planning" },
  { text: "Traceability Matrices", category: "Planning" },
  { text: "Selenium WebDriver Scripts", category: "Automation" },
  { text: "Playwright Automation Code", category: "Automation" },
  { text: "Cypress Test Suites", category: "Automation" },
  { text: "API Testing (REST & GraphQL)", category: "Automation" },
  { text: "Performance Test Scenarios", category: "Quality" },
  { text: "Security Test Checklists", category: "Quality" },
  { text: "Regression Test Matrices", category: "Quality" },
  { text: "Test Data Generation", category: "Quality" },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Capabilities
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            What IntelliPlan AI can <span className="text-gradient">generate</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card/30 glass px-4 py-3.5 transition-all hover:border-primary/20 hover:bg-surface-raised"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm text-foreground">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
