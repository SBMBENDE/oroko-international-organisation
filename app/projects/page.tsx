import type { Metadata } from "next";
import { getAllPublicProjects } from "@/lib/dal/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Layers } from "lucide-react";

export const metadata: Metadata = { title: "Projects" };

const STATUSES = ["active", "planned", "completed", "on_hold"] as const;
const STATUS_LABELS: Record<string, string> = {
  active: "Active", planned: "Planned", completed: "Completed", on_hold: "On Hold",
};

type SearchParams = Promise<{ status?: string }>;

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const projects = await getAllPublicProjects(
    status && STATUSES.includes(status as typeof STATUSES[number])
      ? { status: status as typeof STATUSES[number] }
      : undefined
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-oroko-gold" />
          <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
            Development Initiatives
          </span>
        </div>
        <h1 className="font-heading text-5xl font-bold text-oroko-black mb-4">Projects</h1>
        <p className="text-muted-foreground leading-relaxed">
          OROKO International funds and manages sustainable development projects in Oroko Land
          and across the diaspora. Every project is guided by transparency, measurable impact
          and community participation.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        <a
          href="/projects"
          className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-sm border font-medium transition-colors ${!status ? "bg-oroko-green text-white border-oroko-green" : "border-border text-muted-foreground hover:border-oroko-green/40"}`}
        >
          All
        </a>
        {STATUSES.map((s) => (
          <a
            key={s}
            href={`/projects?status=${s}`}
            className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-sm border font-medium transition-colors ${status === s ? "bg-oroko-green text-white border-oroko-green" : "border-border text-muted-foreground hover:border-oroko-green/40"}`}
          >
            {STATUS_LABELS[s]}
          </a>
        ))}
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-sm">
          <Layers className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-heading text-xl text-oroko-black">No projects yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Project initiatives will be published here once launched.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}
