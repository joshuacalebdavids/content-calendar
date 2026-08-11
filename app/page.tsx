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
          <BrandMark />
          <nav aria-label="Main navigation">
            <a href="#product"><span>01</span> Product</a>
            <a href="#workflow"><span>02</span> Workflow</a>
            <a href="#pricing"><span>03</span> Pricing</a>
          </nav>
          <div className="nav-actions">
            <Link className="text-link" href="/demo">Sign in</Link>
            <Link className="button button-small" href="/demo">Try the demo</Link>
          </div>
        </header>

        <section className="hero-section">
          <div className="hero-grid">
            <div className="hero-index" data-reveal>(Calio v0.1)</div>
            <div className="hero-statement">
              <p className="hero-kicker" data-reveal>
                The content workspace for focused creators
              </p>
              <h1 data-reveal>
                <span>Your ideas</span>
                <span>deserve a clearer path.</span>
              </h1>
            </div>
            <div className="hero-aside" data-reveal>
              <p className="hero-copy">
                Plan the story, shape the brief, and move every piece from first thought
                to published in one calm workspace.
              </p>
              <div className="hero-actions">
                <Link className="button" href="/demo">
                  Explore the workspace
                  <ArrowRight size={16} weight="light" aria-hidden="true" />
                </Link>
                <span>No signup required for the demo</span>
              </div>
            </div>
          </div>
        </section>

        <section className="preview-section" id="product">
          <MarketingPreview />
        </section>

        <section className="manifesto-section" id="workflow" data-scroll-reveal>
          <p className="section-label">(Workflow)</p>
          <div className="manifesto-grid">
            <h2>Less content chaos.<br />More creative momentum.</h2>
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

        <section className="closing-section" id="pricing" data-scroll-reveal>
          <span className="section-label">(Start planning)</span>
          <h2>A real workspace.<br />Ready for real ideas.</h2>
          <p>The refreshed product is taking shape. Step inside the working prototype.</p>
          <Link className="button button-light" href="/demo">
            Open Calio
            <ArrowRight size={16} weight="light" aria-hidden="true" />
          </Link>
        </section>

        <footer className="marketing-footer">
          <div className="footer-meta">
            <BrandMark />
            <p>Designed and built in Cape Town.</p>
            <p>© 2026 Calio</p>
          </div>
          <div className="footer-wordmark" aria-hidden="true">calio</div>
        </footer>
      </main>
    </MarketingMotion>
  );
}
