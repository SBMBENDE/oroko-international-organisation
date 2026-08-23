import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { image: 28, text: "text-sm" },
  md: { image: 36, text: "text-base" },
  lg: { image: 48, text: "text-xl" },
};

export function Logo({ variant = "light", size = "md", className }: LogoProps) {
  const { image, text } = sizes[size];

  return (
    <Link href="/" className={cn("flex items-center gap-3 group", className)}>
      <div className="relative shrink-0 rounded-full overflow-hidden ring-1 ring-oroko-gold/30 group-hover:ring-oroko-gold/70 transition-all duration-300">
        <Image
          src="/images/logo.jpeg"
          alt="OROKO International"
          width={image}
          height={image}
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading font-bold tracking-widest uppercase",
            text,
            variant === "light" ? "text-oroko-warm-white" : "text-oroko-black"
          )}
        >
          OROKO
        </span>
        <span
          className={cn(
            "text-[0.55rem] tracking-[0.2em] uppercase font-sans font-medium",
            variant === "light"
              ? "text-oroko-gold"
              : "text-oroko-green"
          )}
        >
          International
        </span>
      </div>
    </Link>
  );
}
