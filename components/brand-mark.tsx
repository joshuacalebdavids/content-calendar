import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand-mark" href="/" aria-label="Calio home">
      <span className="brand-glyph" aria-hidden="true">
        C/
      </span>
      {!compact && <span>calio</span>}
    </Link>
  );
}
