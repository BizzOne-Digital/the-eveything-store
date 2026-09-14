import Link from "next/link";
import Image from "next/image";
import { resolveImage } from "@/lib/utils";

export default function Logo({
  businessName,
  logo,
  className,
}: {
  businessName: string;
  logo?: string;
  className?: string;
}) {
  const hasLogo = logo && !logo.startsWith("/uploads/");

  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 ${className ?? ""}`}>
      {hasLogo ? (
        <Image
          src={resolveImage(logo)}
          alt={businessName}
          width={44}
          height={44}
          className="h-10 w-10 object-contain"
        />
      ) : (
        <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden="true">
          <circle cx="24" cy="24" r="23" fill="#050505" stroke="#c99a2e" strokeWidth="1.5" />
          <path
            d="M14 20l2-6h16l2 6M14 20h20M14 20l1.5 11a2 2 0 0 0 2 1.7h13a2 2 0 0 0 2-1.7L34 20"
            fill="none"
            stroke="#c99a2e"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 14a6 6 0 0 1 12 0"
            fill="none"
            stroke="#e7c568"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M24 9l1.2 2.4L28 12l-2.3 1.1L24 16l-.7-2.9L21 12l2.8-.6L24 9z" fill="#e7c568" />
        </svg>
      )}
      <span className="font-display leading-tight">
        <span className="block text-sm sm:text-base font-bold tracking-tight text-tes-black">
          The Everything
        </span>
        <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] gold-text-gradient">
          Shop &amp; Services
        </span>
      </span>
    </Link>
  );
}
