import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Pricing", href: "#pricing" }
  ],
  Resources: ["Documentation", "API Reference", "Blog", "Tutorials"],
  Company: ["About", "Careers", "Contact", "Press Kit"],
  Legal: ["Privacy", "Terms", "Security", "GDPR"],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-base font-bold text-foreground">
                IntelliPlan <span className="text-gradient-cyan">AI</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              From Requirements to Automation — Instantly.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground">{category}</h4>
              <ul className="mt-3 space-y-2.5">
                {links.map((link) => {
                  const label = typeof link === 'string' ? link : link.label;
                  const href = typeof link === 'string' ? '#' : link.href;
                  return (
                    <li key={label}>
                      <a href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} IntelliPlan AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="https://medium.com/@gupta.achyutam" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Medium</a>
            <a href="https://github.com/achyutam-gupta" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/achyutam-gupta/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
