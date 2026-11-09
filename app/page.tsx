import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
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
  ["01", "Capture", "Put the idea somewhere the team can find it."],
  ["02", "Shape", "Add the angle, owner, channel and publish date."],
  ["03", "Review", "Keep feedback beside the work, not in another chat."],
  ["04", "Publish", "Move the finished piece into a visible weekly rhythm."],
];

const formats = [
  { title: "Campaigns", meta: "Launches across multiple channels", image: pexels.camera },
  { title: "Always-on", meta: "A steady weekly publishing rhythm", image: pexels.creator },
  { title: "Production", meta: "Briefs, shoots and approvals", image: pexels.crew },
];

function ActionLink({ children, href, light = false }: { children: React.ReactNode; href: string; light?: boolean }) {
  return (
    <Link className={`cinema-button${light ? " is-light" : ""}`} href={href}>
      <span>{children}</span>
      <ArrowRight size={15} weight="light" aria-hidden="true" />
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
            <span className="marketing-location">Johannesburg / working worldwide</span>
          </div>
          <nav aria-label="Main navigation">
            <a href="#product">product</a><span aria-hidden="true">,</span>
            <a href="#workflow">workflow</a><span aria-hidden="true">,</span>
            <a href="#week">the week</a>
          </nav>
          <div className="nav-actions">
            <Link className="text-link" href="/auth/sign-in">Sign in</Link>
            <Link className="text-link" href="/demo">Open demo</Link>
          </div>
        </header>

        <section className="cinema-hero">
          <div className="cinema-hero-copy" data-reveal>
            <p className="cinema-eyebrow">Content Calendar by VRTKS</p>
            <h1>Plan the week.<br />Make the work.</h1>
            <div className="cinema-hero-support">
              <p className="cinema-lede">Ideas, briefs, owners and publish dates in one clear command centre.</p>
              <div className="cinema-actions">
                <ActionLink href="/demo" light>Open live demo</ActionLink>
                <Link className="cinema-quiet-link" href="/auth/sign-up">Create an account</Link>
              </div>
            </div>
          </div>

          <div className="hero-calendar" data-product-preview aria-label="Example publishing week">
            <div className="hero-calendar-head">
              <div><span>August</span><strong>Publishing week</strong></div>
              <p>12 pieces / 3 channels</p>
            </div>
            <div className="hero-week-grid">
              <article><time>Mon 10</time><div className="week-note"><span>09:00</span><strong>Campaign direction</strong><small>Brief / Studio</small></div></article>
              <article><time>Tue 11</time><div className="week-image" style={{ backgroundImage: `url(${pexels.creator})` }} /><div className="week-note is-orange"><span>14:30</span><strong>Behind the process</strong><small>Reel / Instagram</small></div></article>
              <article className="is-today"><time>Wed 12</time><div className="week-note is-coral"><span>11:00</span><strong>Founder notes</strong><small>Post / LinkedIn</small></div></article>
              <article><time>Thu 13</time><div className="week-image" style={{ backgroundImage: `url(${pexels.camera})` }} /><div className="week-note"><span>16:00</span><strong>Studio cut</strong><small>Video / YouTube</small></div></article>
              <article><time>Fri 14</time><div className="week-note is-rust"><span>10:00</span><strong>Week in review</strong><small>Carousel / Instagram</small></div></article>
            </div>
          </div>
        </section>

        <section className="cinema-results" id="workflow">
          <div className="cinema-results-intro">
            <p className="cinema-kicker">How work moves</p>
            <h2>A workflow that survives the week.</h2>
            <p>Every piece keeps its brief, owner and next decision attached from first thought to published post.</p>
            <ActionLink href="/demo">Try the workflow</ActionLink>
          </div>

          <div className="cinema-sequence">
            <div className="sequence-list">
              {steps.map(([index, title, copy], stepIndex) => (
                <article className={stepIndex === 1 ? "is-active" : ""} key={index}>
                  <span>{index}</span><div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
            <div className="schedule-board">
              <header><div><span>Today</span><strong>Tuesday, 11 August</strong></div><small>4 decisions due</small></header>
              <div className="schedule-row"><time>09:00</time><span className="schedule-mark is-rust" /><div><strong>Approve campaign direction</strong><small>Summer campaign / You</small></div><b>Review</b></div>
              <div className="schedule-row"><time>11:30</time><span className="schedule-mark is-orange" /><div><strong>Creator selects</strong><small>Behind the process / Jamie</small></div><b>Assets</b></div>
              <div className="schedule-row"><time>14:00</time><span className="schedule-mark is-coral" /><div><strong>Caption sign-off</strong><small>Founder notes / Sarah</small></div><b>Copy</b></div>
              <div className="schedule-row"><time>16:30</time><span className="schedule-mark" /><div><strong>Schedule weekly recap</strong><small>Week in review / Tom</small></div><b>Publish</b></div>
            </div>
          </div>
        </section>

        <section className="workflow-band" id="product">
          <div className="band-heading">
            <p className="cinema-kicker">One connected workspace</p>
            <h2>Built around the way content actually moves.</h2>
            <p>Strategy, production and publishing share one source of truth—without turning creative work into admin.</p>
          </div>
          <div className="workspace-stage" data-scroll-reveal>
            <div className="workspace-caption">
              <span>Command centre</span>
              <h3>Know what is moving and what needs you.</h3>
              <p>See the calendar, briefs and team activity without stitching together five different tools.</p>
              <Link href="/demo">Explore this screen</Link>
            </div>
            <div className="workspace-preview"><MarketingPreview /></div>
          </div>
        </section>

        <section className="cinema-metrics">
          <p className="cinema-kicker">One operating rhythm</p>
          <h2>Decisions that used to live everywhere, kept together.</h2>
          <div className="metric-row">
            <article><span>Plan</span><h3>See the real shape of the week.</h3><p>Balance channels, formats and deadlines before the team hits capacity.</p></article>
            <article><span>Shape</span><h3>Keep the thinking beside the work.</h3><p>Hooks, captions, production notes and feedback stay attached to each piece.</p></article>
            <article><span>Publish</span><h3>Move with fewer status checks.</h3><p>Ownership and next actions stay visible from brief through release.</p></article>
          </div>
        </section>

        <section className="format-section">
          <div className="format-heading">
            <p className="cinema-kicker">Different work, same view</p>
            <h2>From campaign launch to Friday recap.</h2>
            <p>Use one weekly rhythm for planned campaigns, daily social and production-heavy shoots.</p>
          </div>
          <div className="format-rail">
            {formats.map((format) => (
              <article key={format.title}>
                <div className="format-image" style={{ backgroundImage: `url(${format.image})` }} />
                <div><p>{format.meta}</p><h3>{format.title}</h3></div>
              </article>
            ))}
          </div>
        </section>

        <section className="secure-band">
          <div className="privacy-panel" aria-label="Demo access details">
            <header><div><span className="privacy-dot" /> Live demo</div><strong>No account needed</strong></header>
            <dl><div><dt>Ideas and briefs</dt><dd>Saved in this browser</dd></div><div><dt>Sign in</dt><dd>Optional</dd></div><div><dt>Cloud collaboration</dt><dd>Next product layer</dd></div></dl>
            <footer><span>VRTKS / Content Calendar</span><span>Johannesburg</span></footer>
          </div>
          <div className="secure-copy">
            <p className="cinema-kicker">Try before you join</p>
            <h2>Open the workspace. No gate in the way.</h2>
            <p>The demo works without an account and saves changes locally. Sign in only when you want an identity attached.</p>
            <ActionLink href="/demo">Open the demo</ActionLink>
          </div>
        </section>

        <section className="intelligence-section">
          <div className="intelligence-heading">
            <p className="cinema-kicker">Made for content</p>
            <h2>Planning without project-management theatre.</h2>
            <p>A focused system for the decisions creative teams make every day.</p>
          </div>
          <div className="intelligence-grid">
            <article className="intelligence-card">
              <span>Capacity view</span><h3>See the pressure points.</h3>
              <div className="mini-week"><i /><i /><i /><i /><i /><i /><i /></div>
              <p>Balance channels and production load while there is still time to change the plan.</p>
            </article>
            <article className="intelligence-card">
              <span>Clear ownership</span><h3>Move work without the chase.</h3>
              <div className="mini-flow"><i /><b /><i /><b /><i /></div>
              <p>Each piece shows who owns it, what state it is in and what happens next.</p>
            </article>
          </div>
        </section>

        <section className="story-section" id="week">
          <div className="story-heading">
            <p className="cinema-kicker">A working week</p>
            <h2>Less chasing. Better work.</h2>
          </div>
          <div className="story-grid">
            <article><time>Monday</time><h3>Set the rhythm.</h3><p>Turn priorities into a visible week before production starts.</p></article>
            <article><time>Wednesday</time><h3>Resolve the middle.</h3><p>Review drafts, unblock owners and rebalance what is slipping.</p></article>
            <article><time>Friday</time><h3>Close the loop.</h3><p>Publish what is ready and carry the right ideas into next week.</p></article>
          </div>
        </section>

        <section className="cinema-cta" data-scroll-reveal>
          <div className="cta-image" style={{ backgroundImage: `url(${pexels.mountain})` }}>
            <div>
              <p className="cinema-kicker">Next week starts here</p>
              <h2>Put the work in order.</h2>
              <div className="cinema-actions">
                <ActionLink href="/demo" light>Open live demo</ActionLink>
                <Link className="cinema-quiet-link is-light" href="/auth/sign-up">Create an account</Link>
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
          <div className="footer-base"><span>© 2026 Vorteks Digital</span><span>Johannesburg, South Africa</span></div>
        </footer>
      </main>
    </MarketingMotion>
  );
}
