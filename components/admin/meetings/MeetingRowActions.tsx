"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { toggleMeetingPublished, deleteMeeting } from "@/actions/governance.actions";
import { MeetingFormDialog, type MeetingFormInitial } from "@/components/admin/meetings/MeetingFormDialog";

type Props = {
  meeting: MeetingFormInitial;
  committees?: { id: string; name: string }[];
};

export function MeetingRowActions({ meeting, committees = [] }: Props) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="flex justify-end gap-2">
      <MeetingFormDialog
        meeting={meeting}
        committees={committees}
        trigger={<Button size="xs" variant="outline">Edit</Button>}
      />
      {meeting.isPublic ? (
        <Button size="xs" variant="outline" onClick={async () => { await toggleMeetingPublished(meeting.id, false); refresh(); }}>Unpublish</Button>
      ) : (
        <Button size="xs" onClick={async () => { await toggleMeetingPublished(meeting.id, true); refresh(); }}>Publish</Button>
      )}
      <ConfirmButton label="Delete" title="Delete session" description="This cannot be undone." variant="destructive" size="xs" onConfirm={() => deleteMeeting(meeting.id)} onDone={refresh} />
    </div>
  );
}
