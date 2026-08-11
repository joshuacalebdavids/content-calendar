"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  Clock,
  FileText,
  MagnifyingGlass,
  ArrowCounterClockwise,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { CONTENT_STATUSES, type ContentItem, type ContentStatus } from "@/lib/types";

export type AppSection = "plan" | "library" | "insights" | "settings" | "help";

const STATUS_LABELS: Record<ContentStatus, string> = {
  idea: "Idea",
  drafting: "Drafting",
  review: "In review",
  scheduled: "Scheduled",
  published: "Published",
};

const fullDateFormatter = new Intl.DateTimeFormat("en-ZA", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  return fullDateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function LibraryView({
  items,
  onOpen,
  onCreate,
}: {
  items: ContentItem[];
  onOpen: (item: ContentItem) => void;
  onCreate: () => void;
}) {
  const [status, setStatus] = useState<ContentStatus | "all">("all");
  const visibleItems = status === "all" ? items : items.filter((item) => item.status === status);

  return (
    <section className="product-view" aria-labelledby="library-title">
      <header className="product-view-header">
        <div>
          <p className="section-label">Content library</p>
          <h1 id="library-title">Every idea, in one place.</h1>
          <p>Find, review, and reopen every brief in the workspace.</p>
        </div>
        <span className="view-count">{String(visibleItems.length).padStart(2, "0")} items</span>
      </header>

      <div className="library-toolbar">
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as ContentStatus | "all")}>
            <option value="all">All statuses</option>
            {CONTENT_STATUSES.map((entry) => <option key={entry} value={entry}>{STATUS_LABELS[entry]}</option>)}
          </select>
        </label>
      </div>

      {visibleItems.length ? (
        <div className="library-table" aria-label="Content library">
          <div className="library-row library-row-head" aria-hidden="true">
            <span>Brief</span>
            <span>Status</span>
            <span>Format</span>
            <span>Publish date</span>
            <span className="sr-only">Open</span>
          </div>
          {visibleItems.map((item) => (
            <button className="library-row" type="button" key={item.id} onClick={() => onOpen(item)} aria-label={`Open ${item.title}`}>
              <span className="library-title-cell"><strong>{item.title}</strong><small>{item.pillar || "Uncategorised"}</small></span>
              <span><i className={`status-dot status-${item.status}`} />{STATUS_LABELS[item.status]}</span>
              <span>{item.format}</span>
              <span>{formatDate(item.publishDate)}</span>
              <span><ArrowRight size={16} weight="light" aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      ) : (
        <div className="product-empty">
          <FileText size={28} weight="light" aria-hidden="true" />
          <h2>No briefs match this view.</h2>
          <p>Choose another status or start a new content brief.</p>
          <button className="primary-button" type="button" onClick={onCreate}>Create content</button>
        </div>
      )}
    </section>
  );
}

export function InsightsView({ items }: { items: ContentItem[] }) {
  const published = items.filter((item) => item.status === "published").length;
  const completion = items.length ? Math.round((published / items.length) * 100) : 0;
  const platformCounts = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => item.platforms.forEach((platform) => counts.set(platform, (counts.get(platform) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);
  const pillarCounts = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => {
      const pillar = item.pillar || "Uncategorised";
      counts.set(pillar, (counts.get(pillar) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);
  const maxPlatform = Math.max(1, ...platformCounts.map(([, count]) => count));

  return (
    <section className="product-view" aria-labelledby="insights-title">
      <header className="product-view-header">
        <div>
          <p className="section-label">Workspace insights</p>
          <h1 id="insights-title">See the shape of the work.</h1>
          <p>Live signals calculated from the briefs in this workspace.</p>
        </div>
        <span className="view-count">Live data</span>
      </header>

      <div className="insight-summary">
        <article><span>Publishing progress</span><strong>{completion}%</strong><small>{published} of {items.length} briefs published</small></article>
        <article><span>Active platforms</span><strong>{String(platformCounts.length).padStart(2, "0")}</strong><small>across current briefs</small></article>
        <article><span>Content pillars</span><strong>{String(pillarCounts.length).padStart(2, "0")}</strong><small>keeping the mix balanced</small></article>
      </div>

      <div className="insight-grid">
        <article className="insight-panel">
          <header><span>Platform mix</span><small>Briefs per channel</small></header>
          <div className="bar-list">
            {platformCounts.map(([platform, count]) => (
              <div className="bar-row" key={platform}>
                <span>{platform}</span>
                <div><i style={{ width: `${(count / maxPlatform) * 100}%` }} /></div>
                <strong>{String(count).padStart(2, "0")}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="insight-panel">
          <header><span>Pillar balance</span><small>Current editorial themes</small></header>
          <ol className="rank-list">
            {pillarCounts.map(([pillar, count], index) => (
              <li key={pillar}><span>{String(index + 1).padStart(2, "0")}</span><strong>{pillar}</strong><small>{count} {count === 1 ? "brief" : "briefs"}</small></li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}

export function SettingsView({
  workspaceName,
  onSaveName,
  onReset,
}: {
  workspaceName: string;
  onSaveName: (name: string) => void;
  onReset: () => string | null;
}) {
  const [name, setName] = useState(workspaceName);
  const [saved, setSaved] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSaveName(trimmed);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const reset = () => {
    const resetName = onReset();
    if (resetName) setName(resetName);
  };

  return (
    <section className="product-view settings-view" aria-labelledby="settings-title">
      <header className="product-view-header">
        <div>
          <p className="section-label">Workspace settings</p>
          <h1 id="settings-title">Keep the workspace yours.</h1>
          <p>Demo preferences are stored locally in this browser.</p>
        </div>
      </header>

      <form className="settings-form" onSubmit={submit}>
        <div className="settings-copy"><h2>Workspace details</h2><p>Update the name shown throughout this demo.</p></div>
        <label className="field"><span>Workspace name</span><input value={name} maxLength={80} onChange={(event) => setName(event.target.value)} /></label>
        <div className="settings-action"><button className="primary-button" type="submit" disabled={!name.trim()}>{saved ? <><Check size={15} /> Saved</> : "Save changes"}</button></div>
      </form>

      <section className="settings-form danger-zone">
        <div className="settings-copy"><h2>Reset demo</h2><p>Restore the original briefs and remove all local changes.</p></div>
        <div className="settings-action"><button className="danger-button" type="button" onClick={reset}><ArrowCounterClockwise size={15} weight="light" /> Reset workspace</button></div>
      </section>
    </section>
  );
}

export function HelpView({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="product-view" aria-labelledby="help-title">
      <header className="product-view-header">
        <div>
          <p className="section-label">Help centre</p>
          <h1 id="help-title">Start with the next idea.</h1>
          <p>Everything in this demo is designed to be explored and changed.</p>
        </div>
        <button className="primary-button" type="button" onClick={onCreate}>Create a brief</button>
      </header>

      <div className="help-grid">
        <article><span>01</span><h2>Plan on the calendar</h2><p>Select any date to create a brief for that day. Use the month controls to move through the schedule.</p></article>
        <article><span>02</span><h2>Move work forward</h2><p>Open Pipeline and drag briefs between stages as production progresses.</p></article>
        <article><span>03</span><h2>Find the signal</h2><p>Use Library to search the archive, then open Insights to review the live content mix.</p></article>
      </div>
      <div className="shortcut-list">
        <div><kbd>⌘</kbd><kbd>K</kbd><span>Focus content search</span></div>
        <div><kbd>Esc</kbd><span>Close the content editor</span></div>
        <div><kbd>←</kbd><kbd>→</kbd><span>Switch planner tabs</span></div>
      </div>
    </section>
  );
}

export function NotificationsPanel({
  items,
  onOpen,
  onClose,
}: {
  items: ContentItem[];
  onOpen: (item: ContentItem) => void;
  onClose: () => void;
}) {
  const notifications = items
    .filter((item) => item.status === "review" || item.status === "scheduled")
    .sort((a, b) => a.publishDate.localeCompare(b.publishDate));

  return (
    <aside className="notifications-panel" aria-label="Notifications">
      <header><div><span className="eyebrow">Notifications</span><strong>What needs attention</strong></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close notifications"><X size={16} /></button></header>
      <div className="notification-list">
        {notifications.length ? notifications.map((item) => (
          <button key={item.id} type="button" onClick={() => onOpen(item)}>
            <span className={`notification-icon status-${item.status}`}>{item.status === "review" ? <Sparkle size={15} /> : <Clock size={15} />}</span>
            <span><strong>{item.title}</strong><small>{item.status === "review" ? "Ready for review" : `Scheduled for ${formatDate(item.publishDate)}`}</small></span>
            <ArrowRight size={15} weight="light" />
          </button>
        )) : <div className="notification-empty"><Bell size={22} weight="light" /><p>Nothing needs attention right now.</p></div>}
      </div>
    </aside>
  );
}

export function SearchEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="product-empty compact-empty">
      <MagnifyingGlass size={24} weight="light" />
      <h2>No matching content.</h2>
      <p>Try a different title, platform, format, or content pillar.</p>
      <button className="secondary-button" type="button" onClick={onClear}>Clear search</button>
    </div>
  );
}
