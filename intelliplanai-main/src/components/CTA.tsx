import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-20 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card/40 glass p-16"
        >
          {/* Background glow */}
          <div className="absolute inset-0 hero-glow opacity-50" />
          <div className="absolute inset-0 hero-glow-violet opacity-30" />

          {/* Scan line effect */}
          <div className="absolute inset-0 scan-line" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              No credit card required
            </motion.div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to <span className="text-gradient">transform</span>
              <br />your testing workflow?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
              Join thousands of engineering teams who ship faster with AI-powered test automation. Get started in under 2 minutes.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button className="group relative overflow-hidden flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:shadow-2xl hover:shadow-primary/30">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-secondary">
                Talk to Sales
              </button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Trusted by 2,000+ teams • SOC 2 compliant • 99.9% uptime SLA
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
