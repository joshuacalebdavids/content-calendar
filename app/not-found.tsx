import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <main className="system-page" id="main-content">
      <header><BrandMark /><span>404</span></header>
      <div className="system-page-copy">
        <p className="section-label">Page not found</p>
        <h1>This idea<br />went off brief.</h1>
        <p>The page you requested does not exist or may have moved.</p>
        <Link className="button" href="/"><ArrowLeft size={16} weight="light" aria-hidden="true" /> Return home</Link>
      </div>
    </main>
  );
}
