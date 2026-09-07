"use client";

import { useRouter } from "next/navigation";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { updateProjectStatus } from "@/actions/admin/projects.actions";

const STATUSES = ["planned", "active", "completed", "on_hold"];

export function ProjectStatusSelect({ projectId, status }: { projectId: string; status: string }) {
  const router = useRouter();

  async function handleChange(value: string) {
    await updateProjectStatus(projectId, value as "planned" | "active" | "completed" | "on_hold");
    router.refresh();
  }

  return (
    <Select value={status} onValueChange={(v) => v && handleChange(v)}>
      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
