import {
  ShieldCheck,
  Zap,
  BadgeCheck,
  Building2,
  Database,
  CheckCircle,
} from "lucide-react";

const securityCards = [
  {
    icon: ShieldCheck,
    title: "SOC 2 certified",
    description:
      "Banking-grade data handling security with full SOC 2 certification.",
    link: "Learn more →",
  },
  {
    icon: Zap,
    title: "Resilience at the core",
    description:
      "Robust failover system across multiple cloud and LLM providers for uninterrupted service.",
  },
  {
    icon: BadgeCheck,
    title: "GDPR Ready",
    description:
      "Fully GDPR compliant for transparent data handling and protection.",
  },
  {
    icon: Building2,
    title: "Enterprise ready",
    description:
      "SSO, comprehensive audit logs, and role-based permissions that scale flexibly.",
  },
  {
    icon: Database,
    title: "Multi-model AI",
    description:
      "Always powered by the latest from OpenAI, Anthropic, and Google.",
  },
  {
    icon: CheckCircle,
    title: "Auto quality assurance",
    description:
      "Continuous automated quality checks ensuring consistent, reliable performance.",
  },
];

export default function SecuritySection() {
  return (
    <section className="bg-black py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top Border */}
        <div className="mb-6 border-t border-zinc-700 pt-4">
          <span className="text-sm italic text-zinc-400">
            ▪ Enterprise-grade security
          </span>
        </div>

        {/* Heading */}
        <h2 className="mb-16 text-4xl font-semibold tracking-tight md:text-6xl">
          Secure & responsible AI by design
        </h2>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {securityCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
                  <Icon size={24} />
                </div>

                <h3 className="mb-3 text-2xl font-medium">
                  {card.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                  {card.description}
                </p>

                {card.link && (
                  <button className="text-sm font-medium text-white">
                    {card.link}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}