"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { createProject, updateProject } from "@/actions/admin/projects.actions";

export interface ProjectFormValues {
  title: string;
  summary: string;
  description: string;
  category: string;
  location: string;
  leadName: string;
  fundingGoal: string;
  startDate: string;
  targetEndDate: string;
  progressPercent: string;
  isPublic: boolean;
  isFeatured: boolean;
}

const DEFAULTS: ProjectFormValues = {
  title: "", summary: "", description: "", category: "community", location: "", leadName: "",
  fundingGoal: "", startDate: "", targetEndDate: "", progressPercent: "0", isPublic: true, isFeatured: false,
};

const CATEGORIES = ["education", "healthcare", "infrastructure", "agriculture", "culture", "youth", "women_empowerment", "digital", "environment", "community", "other"];

export function ProjectForm({ projectId, defaultValues }: { projectId?: string; defaultValues?: Partial<ProjectFormValues> }) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>({ ...DEFAULTS, ...defaultValues });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set<K extends keyof ProjectFormValues>(key: K, v: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      ...values,
      fundingGoal: values.fundingGoal ? Number(values.fundingGoal) : undefined,
      progressPercent: Number(values.progressPercent),
    };
    const result = projectId ? await updateProject(projectId, payload) : await createProject(payload);
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed to save"); return; }
    const nextId = projectId ?? ("id" in result ? result.id : undefined);
    router.push(`/admin/projects/${nextId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={values.title} onChange={(e) => set("title", e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" value={values.summary} onChange={(e) => set("summary", e.target.value)} rows={2} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Full Description</Label>
        <Textarea id="description" value={values.description} onChange={(e) => set("description", e.target.value)} rows={4} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={values.category} onValueChange={(v) => set("category", v ?? values.category)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={values.location} onChange={(e) => set("location", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="leadName">Project Leader</Label>
          <Input id="leadName" value={values.leadName} onChange={(e) => set("leadName", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
          <Input id="fundingGoal" type="number" min={0} value={values.fundingGoal} onChange={(e) => set("fundingGoal", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" value={values.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="targetEndDate">Target End Date</Label>
          <Input id="targetEndDate" type="date" value={values.targetEndDate} onChange={(e) => set("targetEndDate", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="progressPercent">Progress (%)</Label>
        <Input id="progressPercent" type="number" min={0} max={100} value={values.progressPercent} onChange={(e) => set("progressPercent", e.target.value)} />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.isPublic} onChange={(e) => set("isPublic", e.target.checked)} className="size-4 accent-oroko-gold" />
          Publicly listed
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="size-4 accent-oroko-gold" />
          Featured
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : projectId ? "Save Changes" : "Create Project"}</Button>
    </form>
  );
}
