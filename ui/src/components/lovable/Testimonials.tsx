import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "IntelliPlan AI cut our test creation time by 80%. What used to take our QA team a week now takes hours.",
    author: "Sarah Chen",
    role: "QA Lead, TechFlow",
    avatar: "SC",
  },
  {
    quote: "The automation code it generates is production-ready. We pushed Playwright scripts straight to CI without modifications.",
    author: "Marcus Rivera",
    role: "Engineering Manager, Stackwise",
    avatar: "MR",
  },
  {
    quote: "Finally, a tool that understands requirements context. The test coverage suggestions are incredibly accurate.",
    author: "Priya Sharma",
    role: "Director of QA, CloudSync",
    avatar: "PS",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Loved by <span className="text-gradient">engineering teams</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card/50 glass p-6 card-hover"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber text-amber" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed italic">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
