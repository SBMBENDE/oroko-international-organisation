import Link from "next/link";
import Image from "next/image";
import { MapPin, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/lib/dal/projects";

const statusStyle: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600 border-emerald-200",
  planned: "bg-blue-50 text-blue-600 border-blue-200",
  completed: "bg-muted text-muted-foreground border-border",
  on_hold: "bg-amber-50 text-amber-600 border-amber-200",
};

const categoryLabel: Record<string, string> = {
  education: "Education", healthcare: "Healthcare", infrastructure: "Infrastructure",
  agriculture: "Agriculture", culture: "Culture", youth: "Youth",
  women_empowerment: "Women's Empowerment", digital: "Digital", environment: "Environment",
  community: "Community", other: "Other",
};

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const hasFunding = project.fundingGoal && project.fundingGoal > 0;
  const pct = hasFunding
    ? Math.min(100, Math.round((project.fundingRaised / project.fundingGoal!) * 100))
    : project.progressPercent;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block bg-white border border-border rounded-sm overflow-hidden hover:border-oroko-gold/30 hover:shadow-sm transition-all"
    >
      {/* Cover image or placeholder */}
      <div className="relative h-44 bg-oroko-green/10 overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center oroko-pattern">
            <Target className="size-8 text-oroko-green/30" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm", statusStyle[project.status] ?? statusStyle.planned)}>
            {project.status.replace("_", " ")}
          </span>
        </div>
        {project.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-oroko-gold text-oroko-black rounded-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Category */}
        <p className="text-[10px] text-oroko-gold uppercase tracking-[0.2em] font-semibold mb-2">
          {categoryLabel[project.category] ?? project.category}
        </p>

        <h3 className="font-heading text-lg font-semibold text-oroko-black mb-2 line-clamp-2 group-hover:text-oroko-green transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.summary}</p>

        {project.location && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <MapPin className="size-3 shrink-0" />
            {project.location}
          </p>
        )}

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{pct}% complete</span>
            {hasFunding && (
              <span>
                {project.currency} {project.fundingRaised.toLocaleString()} / {project.fundingGoal!.toLocaleString()}
              </span>
            )}
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
      </div>
    </Link>
  );
}
