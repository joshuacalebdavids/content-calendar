import Link from "next/link";
import { ArrowRight, CalendarDots, Sparkle, Stack } from "@phosphor-icons/react/dist/ssr";
import { BrandMark } from "@/components/brand-mark";
import { MarketingMotion } from "@/components/marketing-motion";
import { MarketingPreview } from "@/components/marketing-preview";

const features = [
  {
    icon: CalendarDots,
    index: "01",
    title: "See the whole story",
    copy: "Move from a single idea to a balanced publishing rhythm across every platform.",
  },
  {
    icon: Stack,
    index: "02",
    title: "Shape before you ship",
    copy: "Keep hooks, scripts, captions, production notes, and status in one focused brief.",
  },
  {
    icon: Sparkle,
    index: "03",
    title: "Build a system that lasts",
    copy: "Turn content pillars and repeatable templates into a workflow your team can trust.",
  },
];

export default function HomePage() {
  return (
    <MarketingMotion>
      <main className="marketing-shell" id="main-content">
        <header className="marketing-nav">
          <div className="marketing-brand-group">
            <BrandMark />
            <span className="marketing-location">Johannesburg · working worldwide</span>
          </div>
          <nav aria-label="Main navigation">
            <a href="#product">product</a><span aria-hidden="true">,</span>
            <a href="#workflow">workflow</a><span aria-hidden="true">,</span>
            <a href="#pricing">start</a>
          </nav>
          <div className="nav-actions">
            <Link className="text-link" href="/auth/sign-in">Sign in</Link>
            <Link className="text-link" href="/demo">Open demo</Link>
          </div>
        </header>

        <section className="hero-section">
          <div className="hero-grid">
            <div className="hero-statement">
              <h1 data-reveal>
                <span>Plan</span>
                <span>tomorrow&apos;s</span>
                <span className="hero-final-line">
                  <span>story</span>
                  <span className="hero-media-pill" aria-hidden="true"><i /><i /><i /></span>
                  <span>today.</span>
                </span>
              </h1>
            </div>
            <div className="hero-aside" data-reveal>
              <p className="hero-copy">
                A focused content workspace for teams that want to plan with clarity,
                shape better ideas, and publish with momentum.
              </p>
              <div className="hero-actions">
                <Link className="hero-text-link" href="/demo">
                  Explore the workspace
                  <ArrowRight size={16} weight="light" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="manifesto-section" id="workflow" data-scroll-reveal>
          <p className="section-label">(Approach)</p>
          <div className="manifesto-grid">
            <h2>Content planning built for clearer thinking and stronger creative momentum.</h2>
            <p>
              Calio brings the planning room, writing desk, and production board into
              one considered system—so the work stays connected from idea to publish.
            </p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, index, title, copy }) => (
              <article key={index} className="feature-card">
                <div className="feature-number">{index}</div>
                <div className="feature-icon"><Icon aria-hidden="true" weight="light" /></div>
                <div className="feature-copy"><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="preview-section" id="product">
          <div className="preview-section-heading">
            <span>(Workspace)</span>
            <h2>One calm view of everything moving.</h2>
          </div>
          <MarketingPreview />
        </section>

        <section className="closing-section" id="pricing" data-scroll-reveal>
          <span className="section-label">(Start planning)</span>
          <h2>A real workspace.<br />Ready for real ideas.</h2>
          <p>The refreshed product is taking shape. Step inside the working prototype.</p>
          <Link className="button button-light" href="/demo">
            Open workspace
            <ArrowRight size={16} weight="light" aria-hidden="true" />
          </Link>
        </section>

        <footer className="marketing-footer">
          <div className="footer-meta">
            <BrandMark />
            <p>Designed and built in Johannesburg.</p>
            <p>© 2026 Vorteks Digital</p>
          </div>
          <div className="footer-wordmark" aria-hidden="true">VRTKS</div>
        </footer>
      </main>
    </MarketingMotion>
  );
}
