import Link from "next/link";
import {
  ArrowRight,
  CalendarDots,
  CheckCircle,
  LockKey,
  Play,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { BrandMark } from "@/components/brand-mark";
import { MarketingMotion } from "@/components/marketing-motion";
import { MarketingPreview } from "@/components/marketing-preview";

const pexels = {
  camera: "https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg?auto=compress&cs=tinysrgb&w=1600",
  crew: "https://images.pexels.com/photos/30481729/pexels-photo-30481729.jpeg?auto=compress&cs=tinysrgb&w=1600",
  creator: "https://images.pexels.com/photos/13929966/pexels-photo-13929966.jpeg?auto=compress&cs=tinysrgb&w=1600",
  phone: "https://images.pexels.com/photos/15525898/pexels-photo-15525898.jpeg?auto=compress&cs=tinysrgb&w=1600",
  mountain: "https://images.pexels.com/photos/1758531/pexels-photo-1758531.jpeg?auto=compress&cs=tinysrgb&w=1800",
};

const steps = [
  ["01", "Ideas", "Capture the thought before it disappears."],
  ["02", "Plan", "Shape the angle, channel, owner and date."],
  ["03", "Create", "Keep every draft and production note together."],
  ["04", "Publish", "Move with a clear view of what happens next."],
];

const formats = [
  { title: "Campaigns", meta: "Multi-channel launches", image: pexels.camera },
  { title: "Always-on", meta: "A reliable publishing rhythm", image: pexels.creator },
  { title: "Production", meta: "Briefs, shoots and approvals", image: pexels.crew },
];

function ArrowButton({ children, href, light = false }: { children: React.ReactNode; href: string; light?: boolean }) {
  return (
    <Link className={`cinema-button${light ? " is-light" : ""}`} href={href}>
      <span>{children}</span>
      <i aria-hidden="true"><ArrowRight size={15} weight="light" /></i>
    </Link>
  );
}

export default function HomePage() {
  return (
    <MarketingMotion>
      <main className="marketing-shell cinema-page" id="main-content">
        <header className="marketing-nav">
          <div className="marketing-brand-group">
            <BrandMark />
            <span className="marketing-location">Johannesburg · working worldwide</span>
          </div>
          <nav aria-label="Main navigation">
            <a href="#product">product</a><span aria-hidden="true">,</span>
            <a href="#workflow">workflow</a><span aria-hidden="true">,</span>
            <a href="#stories">stories</a>
          </nav>
          <div className="nav-actions">
            <Link className="text-link" href="/auth/sign-in">Sign in</Link>
            <Link className="text-link" href="/demo">Open demo</Link>
          </div>
        </header>

        <section className="cinema-hero">
          <div className="cinema-hero-copy" data-reveal>
            <p className="cinema-eyebrow"><span /> Content operations, rethought</p>
            <h1>See the whole story.<br />Shape what comes next.</h1>
            <p className="cinema-lede">One intelligent command centre for the ideas, people and deadlines behind every piece of content.</p>
            <div className="cinema-actions">
              <ArrowButton href="/auth/sign-up" light>Start planning</ArrowButton>
              <Link className="cinema-quiet-link" href="/demo">View the command centre</Link>
            </div>
          </div>

          <div className="cinema-orbit" data-product-preview aria-label="A stream of content moving into the calendar">
            <div className="orbit-line orbit-line-one" />
            <div className="orbit-line orbit-line-two" />
            <div className="orbit-thumb thumb-one" style={{ backgroundImage: `url(${pexels.camera})` }} />
            <div className="orbit-thumb thumb-two" style={{ backgroundImage: `url(${pexels.creator})` }} />
            <div className="orbit-thumb thumb-three" style={{ backgroundImage: `url(${pexels.phone})` }} />
            <div className="orbit-thumb thumb-four" style={{ backgroundImage: `url(${pexels.crew})` }} />
            <div className="orbit-thumb thumb-five" style={{ backgroundImage: `url(${pexels.mountain})` }} />
            <div className="orbit-card-shell">
              <article className="orbit-card">
                <div className="orbit-card-image" style={{ backgroundImage: `url(${pexels.creator})` }}>
                  <span><Play size={12} weight="fill" /> Preview</span>
                </div>
                <div className="orbit-card-copy">
                  <p>Summer campaign</p><strong>Behind the process</strong>
                  <div><span>Instagram</span><span>Ready for review</span></div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="cinema-results" id="workflow">
          <div className="cinema-results-intro" data-scroll-reveal>
            <p className="cinema-kicker">A clearer workflow</p>
            <h2>From loose thought<br />to live post.</h2>
            <p>Give every idea a path forward, without losing the creative context that made it worth pursuing.</p>
            <ArrowButton href="/demo">Explore the workflow</ArrowButton>
          </div>
          <div className="cinema-sequence" data-scroll-reveal>
            <div className="sequence-list">
              {steps.map(([index, title, copy], stepIndex) => (
                <article className={stepIndex === 1 ? "is-active" : ""} key={index}>
                  <span>{index}</span><div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
            <div className="signal-shell">
              <div className="signal-core">
                <div className="signal-grid" aria-hidden="true">
                  <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                </div>
                <div className="signal-copy"><span>Momentum</span><strong>Every moving part,<br />made visible.</strong></div>
                <div className="signal-status"><span /> 12 posts on track</div>
              </div>
            </div>
          </div>
        </section>

        <section className="workflow-band" id="product">
          <div className="band-heading" data-scroll-reveal>
            <p className="cinema-kicker">One connected workspace</p>
            <h2>Built for the most demanding content workflows.</h2>
            <p>Strategy, production and publishing finally share the same source of truth.</p>
          </div>
          <div className="workspace-shell" data-scroll-reveal>
            <div className="workspace-core">
              <div className="workspace-caption">
                <span>Command centre</span><h3>Know what is moving—and what needs you.</h3>
                <p>See the calendar, briefs and team activity without stitching together five different tools.</p>
              </div>
              <div className="workspace-preview"><MarketingPreview /></div>
            </div>
          </div>
        </section>

        <section className="cinema-metrics" data-scroll-reveal>
          <p className="cinema-kicker">Less coordination. More creation.</p>
          <h2>Create, shape and move faster with one calm view.</h2>
          <div className="metric-row">
            <article><strong>1</strong><p>home for every content decision</p></article>
            <article><strong>7 days</strong><p>of momentum visible at a glance</p></article>
            <article><strong>0</strong><p>lost ideas between tools and chats</p></article>
          </div>
          <div className="metric-proof"><span>BRAND</span><span>STUDIO</span><span>SOCIAL</span><span>EDITORIAL</span><span>TEAM</span></div>
        </section>

        <section className="format-section">
          <div className="format-heading" data-scroll-reveal>
            <p className="cinema-kicker">Flexible by design</p>
            <h2>Built for every content workflow.</h2>
            <p>From a single founder to a full creative department, Content Calendar keeps the operating rhythm intact.</p>
          </div>
          <div className="format-rail" data-scroll-reveal>
            {formats.map((format, index) => (
              <article className={index === 1 ? "is-featured" : ""} key={format.title}>
                <div className="format-image" style={{ backgroundImage: `url(${format.image})` }}><span>0{index + 1}</span></div>
                <div><p>{format.meta}</p><h3>{format.title}</h3></div>
              </article>
            ))}
          </div>
        </section>

        <section className="secure-band" data-scroll-reveal>
          <div className="secure-visual" aria-hidden="true">
            <div className="secure-lock"><LockKey size={25} weight="light" /></div>
            <div className="secure-tile tile-a"><CalendarDots size={26} weight="light" /></div>
            <div className="secure-tile tile-b"><Sparkle size={26} weight="light" /></div>
            <div className="secure-tile tile-c"><CheckCircle size={26} weight="light" /></div>
          </div>
          <div className="secure-copy">
            <p className="cinema-kicker">Your work stays yours</p>
            <h2>Calm, considered and secure by design.</h2>
            <p>Protected sign-in and a focused workspace give your team a dependable place to think in progress.</p>
            <ArrowButton href="/auth/sign-up">Create your workspace</ArrowButton>
          </div>
        </section>

        <section className="intelligence-section">
          <div className="intelligence-heading" data-scroll-reveal>
            <p className="cinema-kicker">Content-native intelligence</p>
            <h2>Planning, context and momentum—in orchestration.</h2>
            <p>Not another task list. A purpose-built system that understands how content actually gets made.</p>
          </div>
          <div className="intelligence-grid" data-scroll-reveal>
            <article className="intelligence-shell"><div className="intelligence-card">
              <span>01 · Plan</span><h3>See the shape of your week.</h3>
              <div className="mini-week"><i /><i /><i /><i /><i /><i /><i /></div>
              <p>Balance channels, formats and priorities before the team hits capacity.</p>
            </div></article>
            <article className="intelligence-shell"><div className="intelligence-card">
              <span>02 · Move</span><h3>Know exactly what comes next.</h3>
              <div className="mini-flow"><i /><b /><i /><b /><i /></div>
              <p>Clear ownership and status keep work moving without constant check-ins.</p>
            </div></article>
          </div>
        </section>

        <section className="story-section" id="stories">
          <div className="story-heading" data-scroll-reveal>
            <p className="cinema-kicker">Made for creative teams</p><h2>A better way to work together.</h2>
          </div>
          <div className="story-grid" data-scroll-reveal>
            <blockquote>“The whole week finally feels legible. We can see the gaps before they become emergencies.”<cite>Content lead · Johannesburg</cite></blockquote>
            <blockquote>“Ideas no longer vanish inside chat. Everyone knows where the latest thinking lives.”<cite>Creative director · Remote team</cite></blockquote>
            <blockquote>“We spend less time asking for status and more time making the work better.”<cite>Studio founder · South Africa</cite></blockquote>
          </div>
        </section>

        <section className="cinema-cta" data-scroll-reveal>
          <div className="cta-image" style={{ backgroundImage: `url(${pexels.mountain})` }}>
            <div>
              <p className="cinema-kicker">Your next chapter is already moving</p><h2>Ready to see the whole story?</h2>
              <div className="cinema-actions">
                <ArrowButton href="/auth/sign-up" light>Start planning</ArrowButton>
                <Link className="cinema-quiet-link is-light" href="/demo">View the demo</Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="cinema-footer">
          <div className="footer-top">
            <div><BrandMark /><p>Content Calendar</p><span>Designed and built in Johannesburg.</span></div>
            <div><span>Product</span><Link href="/demo">Command centre</Link><a href="#workflow">Workflow</a><Link href="/auth/sign-up">Create account</Link></div>
            <div><span>Company</span><a href="https://vorteksdigital.co.za">Vorteks Digital</a><a href="mailto:hello@vorteksdigital.co.za">Contact</a><Link href="/auth/sign-in">Sign in</Link></div>
          </div>
          <div className="footer-wordmark" aria-hidden="true">VRTKS</div>
          <div className="footer-base"><span>© 2026 Vorteks Digital</span><span>Johannesburg · South Africa</span></div>
        </footer>
      </main>
    </MarketingMotion>
  );
}
