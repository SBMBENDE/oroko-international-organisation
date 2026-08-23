import { Scale, CalendarDays, Layers, Users } from "lucide-react";

const pillars = [
  {
    id: "governance",
    icon: Scale,
    title: "Governance",
    description:
      "A transparent, democratic framework through the General Assembly, Executive, and specialized Committees — ensuring accountable leadership.",
  },
  {
    id: "events",
    icon: CalendarDays,
    title: "Events & Conventions",
    description:
      "Annual conventions, seminars, and cultural gatherings that bring our global membership together to celebrate, connect, and collaborate.",
  },
  {
    id: "projects",
    icon: Layers,
    title: "Projects & Initiatives",
    description:
      "Community development projects, capacity-building programs, and initiatives that create tangible impact for our members and communities.",
  },
  {
    id: "community",
    icon: Users,
    title: "Community & Members",
    description:
      "A verified, global network of individual members with a shared directory, profiles, and tools that strengthen ties across borders.",
  },
];

export function PillarsSection() {
  return (
    <section className="bg-oroko-green py-24 lg:py-32 oroko-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-oroko-gold/60" />
            <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
              Our Foundation
            </span>
            <span className="h-px w-8 bg-oroko-gold/60" />
          </div>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white text-balance">
            What We Stand For
          </h2>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Four interconnected pillars that define OROKO International and
            guide everything we do as an organization.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-oroko-gold/30 rounded-sm p-7 transition-all duration-300 cursor-default"
              >
                {/* Icon */}
                <div className="mb-5 inline-flex p-3 rounded-sm bg-oroko-gold/10 border border-oroko-gold/20 group-hover:bg-oroko-gold/20 transition-colors duration-300">
                  <Icon className="size-5 text-oroko-gold" strokeWidth={1.5} />
                </div>

                {/* Number */}
                <div className="font-heading text-5xl font-bold text-white/8 leading-none mb-3 select-none">
                  0{pillars.indexOf(pillar) + 1}
                </div>

                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
