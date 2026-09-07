import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ContactMessageDetail } from "@/components/admin/contact/ContactMessageDetail";

export default async function ContactMessagesPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.CONTACT_MANAGE)) redirect("/admin");
  await connectDB();
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).populate("internalNotes.author", "firstName lastName").lean();

  return (
    <div>
      <PageHeader title="Contact Messages" description="Messages submitted through the public contact form." />

      {messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages yet" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Name</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Date</th>
            <th />
          </AdminTableHead>
          <tbody>
            {messages.map((m) => (
              <AdminTableRow key={m._id.toString()}>
                <td>
                  <p className="font-medium text-oroko-black">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </td>
                <td className="max-w-xs truncate">{m.subject || "—"}</td>
                <td><StatusBadge status={m.status} /></td>
                <td className="text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</td>
                <td className="text-right">
                  <ContactMessageDetail
                    message={{
                      id: m._id.toString(),
                      name: m.name,
                      email: m.email,
                      phone: m.phone,
                      subject: m.subject,
                      message: m.message,
                      status: m.status,
                      createdAt: m.createdAt.toISOString(),
                      internalNotes: m.internalNotes.map((n) => ({
                        authorName: n.authorName,
                        text: n.text,
                        createdAt: n.createdAt.toISOString(),
                      })),
                    }}
                  />
                </td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
