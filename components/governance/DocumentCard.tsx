import { FileText, Download, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentSummary } from "@/lib/dal/governance";

const typeLabel: Record<string, string> = {
  resolution: "Resolution",
  decision: "Decision",
  minutes: "Minutes",
  report: "Report",
  agenda: "Agenda",
  statute: "Statute",
  bylaw: "By-Law",
};

const typeStyle: Record<string, string> = {
  resolution: "bg-purple-50 text-purple-600 border-purple-200",
  decision: "bg-oroko-gold/10 text-oroko-gold border-oroko-gold/20",
  minutes: "bg-blue-50 text-blue-600 border-blue-200",
  report: "bg-emerald-50 text-emerald-600 border-emerald-200",
  agenda: "bg-muted text-muted-foreground border-border",
  statute: "bg-oroko-green/10 text-oroko-green border-oroko-green/20",
  bylaw: "bg-oroko-green/10 text-oroko-green border-oroko-green/20",
};

export function DocumentCard({ doc }: { doc: DocumentSummary }) {
  return (
    <div className="bg-white border border-border rounded-sm p-5 hover:border-oroko-gold/20 hover:shadow-sm transition-all flex items-start gap-4">
      {/* Icon */}
      <div className="p-2.5 rounded-sm bg-muted border border-border shrink-0">
        {doc.isPublic ? (
          <FileText className="size-4 text-oroko-green" />
        ) : (
          <Lock className="size-4 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Type + reference */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm", typeStyle[doc.type] ?? typeStyle.agenda)}>
            {typeLabel[doc.type] ?? doc.type}
          </span>
          {doc.reference && (
            <span className="text-[10px] font-mono text-muted-foreground">{doc.reference}</span>
          )}
        </div>

        <h4 className="font-heading text-base font-semibold text-oroko-black leading-snug">
          {doc.title}
        </h4>

        {doc.summary && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.summary}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          {doc.adoptedAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(doc.adoptedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {doc.attachmentUrl && doc.isPublic && (
            <a
              href={doc.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-oroko-green hover:text-oroko-gold transition-colors font-medium ml-auto"
            >
              <Download className="size-3.5" />
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
