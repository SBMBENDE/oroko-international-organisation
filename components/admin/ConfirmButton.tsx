"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ConfirmButtonProps {
  label: string;
  title: string;
  description: string;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "xs" | "lg";
  confirmLabel?: string;
  onDone?: () => void;
  className?: string;
}

/** Confirmation dialog wrapper for destructive or state-changing admin actions. */
export function ConfirmButton({
  label,
  title,
  description,
  onConfirm,
  variant = "outline",
  size = "sm",
  confirmLabel = "Confirm",
  onDone,
  className,
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await onConfirm();
      if (!result.success) {
        setError(result.error ?? "Something went wrong");
        return;
      }
      setOpen(false);
      onDone?.();
    });
  }

  return (
    <>
      <Button type="button" variant={variant} size={size} className={cn(className)} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="button" variant={variant === "destructive" ? "destructive" : "default"} onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Please wait…" : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
