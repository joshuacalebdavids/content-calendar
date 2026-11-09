import Image from "next/image";
import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand-mark${compact ? " is-compact" : ""}`} href="/" aria-label="Vorteks home">
      <Image
        className="brand-logo"
        src={compact ? "/favicon-vrtks.svg" : "/logo-vrtks.svg"}
        alt=""
        width={compact ? 512 : 500}
        height={compact ? 512 : 65}
        priority
      />
    </Link>
  );
}
