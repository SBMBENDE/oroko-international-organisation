import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/dal/projects";
import { DonationForm } from "@/components/donations/DonationForm";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Users, CheckCircle, Circle, Heart, ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const hasFunding = project.fundingGoal && project.fundingGoal > 0;
  const pct = hasFunding
    ? Math.min(100, Math.round((project.fundingRaised / project.fundingGoal!) * 100))
    : project.progressPercent;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8"
      >
        <ArrowLeft className="size-3.5" /> Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cover image */}
          {project.coverImage && (
            <div className="relative h-64 rounded-sm overflow-hidden">
              <Image src={project.coverImage} alt={project.title} fill className="object-cover" />
            </div>
          )}

          {/* Header */}
          <div>
            <p className="text-xs text-oroko-gold uppercase tracking-[0.2em] font-semibold mb-2">
              {project.category.replace("_", " ")}
            </p>
            <h1 className="font-heading text-4xl font-bold text-oroko-black mb-4">{project.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{project.summary}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground border-t border-b border-border py-4">
            {project.location && (
              <span className="flex items-center gap-1.5"><MapPin className="size-4 text-oroko-gold" />{project.location}</span>
            )}
            {project.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 text-oroko-gold" />
                Started {new Date(project.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </span>
            )}
            {project.leadName && (
              <span className="flex items-center gap-1.5"><Users className="size-4 text-oroko-gold" />Lead: {project.leadName}</span>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <h2 className="font-heading text-2xl font-bold text-oroko-black mb-3">About this project</h2>
              <p className="leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>
          )}

          {/* Milestones */}
          {project.milestones.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-oroko-black mb-5">Milestones</h2>
              <div className="space-y-3">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white border border-border rounded-sm">
                    {m.isCompleted
                      ? <CheckCircle className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      : <Circle className="size-5 text-muted-foreground/40 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-medium text-oroko-black text-sm">{m.title}</p>
                      {m.description && <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>}
                      {m.targetDate && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Target: {new Date(m.targetDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — funding + donation */}
        <div className="space-y-5">
          {/* Progress card */}
          <div className="bg-white border border-border rounded-sm p-6">
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-heading text-2xl font-bold text-oroko-black">
                  {hasFunding
                    ? `${project.currency} ${project.fundingRaised.toLocaleString()}`
                    : `${pct}%`}
                </span>
                {hasFunding && (
                  <span className="text-xs text-muted-foreground">
                    of {project.currency} {project.fundingGoal!.toLocaleString()}
                  </span>
                )}
              </div>
              <Progress value={pct} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{pct}% funded</span>
                <span className="capitalize">{project.status.replace("_", " ")}</span>
              </div>
            </div>

            {project.milestoneCount > 0 && (
              <p className="text-xs text-muted-foreground border-t border-border pt-3">
                {project.completedMilestones} / {project.milestoneCount} milestones completed
              </p>
            )}
          </div>

          {/* Donation form */}
          <div className="bg-white border border-oroko-gold/20 rounded-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Heart className="size-4 text-oroko-gold" />
              <h3 className="font-heading text-lg font-semibold text-oroko-black">
                Support this project
              </h3>
            </div>
            <DonationForm projectId={project.id} projectTitle={project.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
