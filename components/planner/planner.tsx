"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDots,
  CaretLeft,
  CaretRight,
  ChartBar,
  FileText,
  Gear,
  GridFour,
  MagnifyingGlass,
  Plus,
  Question,
  Sparkle,
  SquaresFour,
} from "@phosphor-icons/react";
import { BrandMark } from "@/components/brand-mark";
import { ContentEditor } from "./content-editor";
import {
  HelpView,
  InsightsView,
  LibraryView,
  NotificationsPanel,
  SearchEmptyState,
  SettingsView,
  type AppSection,
} from "./app-views";
import { DEMO_CONTENT, DEMO_WORKSPACE } from "@/lib/demo-data";
import { formatMonth, getCalendarDays, shiftMonth } from "@/lib/calendar";
import { CONTENT_STATUSES, type ContentItem, type ContentStatus } from "@/lib/types";

const STORAGE_KEY = "calio-demo-content-v2";
const PREFERENCES_KEY = "calio-demo-preferences-v1";
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STATUS_META: Record<ContentStatus, { label: string; short: string }> = {
  idea: { label: "Ideas", short: "Idea" },
  drafting: { label: "Drafting", short: "Draft" },
  review: { label: "In review", short: "Review" },
  scheduled: { label: "Scheduled", short: "Scheduled" },
  published: { label: "Published", short: "Published" },
};

type View = "calendar" | "pipeline";

const shortDateFormatter = new Intl.DateTimeFormat("en-ZA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});

function formatShortDate(date: string) {
  return shortDateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function newContentItem(date = "2026-08-11"): ContentItem {
  return {
    id: `content_${Date.now()}`,
    title: "",
    summary: "",
    publishDate: date,
    status: "idea",
    format: "Post",
    platforms: ["Instagram"],
    pillar: "",
    hook: "",
    caption: "",
    productionNotes: "",
  };
}

export function Planner() {
  const [items, setItems] = useState<ContentItem[]>(DEMO_CONTENT);
  const [section, setSection] = useState<AppSection>("plan");
  const [view, setView] = useState<View>("calendar");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7);
  const [query, setQuery] = useState("");
  const [editorItem, setEditorItem] = useState<ContentItem | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState(DEMO_WORKSPACE.name);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let initialItems = DEMO_CONTENT;
    let initialWorkspaceName = DEMO_WORKSPACE.name;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) initialItems = JSON.parse(saved) as ContentItem[];
      const savedPreferences = window.localStorage.getItem(PREFERENCES_KEY);
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences) as { workspaceName?: string };
        if (preferences.workspaceName?.trim()) initialWorkspaceName = preferences.workspaceName;
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    const frame = window.requestAnimationFrame(() => {
      setItems(initialItems);
      setWorkspaceName(initialWorkspaceName);
      setHasLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hasLoaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasLoaded, items]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSection("library");
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      [item.title, item.summary, item.pillar, item.format, ...item.platforms]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [items, query]);

  const metrics = useMemo(() => ({
    planned: items.length,
    scheduled: items.filter((item) => item.status === "scheduled").length,
    inProgress: items.filter((item) => ["drafting", "review"].includes(item.status)).length,
    published: items.filter((item) => item.status === "published").length,
  }), [items]);

  const saveItem = (nextItem: ContentItem) => {
    setItems((current) => {
      const exists = current.some((item) => item.id === nextItem.id);
      return exists
        ? current.map((item) => (item.id === nextItem.id ? nextItem : item))
        : [...current, nextItem];
    });
    setEditorItem(null);
    setNotificationsOpen(false);
  };

  const deleteItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setEditorItem(null);
  };

  const openItem = (item: ContentItem) => {
    setNotificationsOpen(false);
    setEditorItem(item);
  };

  const createItem = (date?: string) => {
    setNotificationsOpen(false);
    setEditorItem(newContentItem(date));
  };

  const navigateTo = (nextSection: AppSection) => {
    setSection(nextSection);
    setNotificationsOpen(false);
  };

  const saveWorkspaceName = (name: string) => {
    setWorkspaceName(name);
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ workspaceName: name }));
  };

  const resetWorkspace = () => {
    if (!window.confirm("Reset the demo workspace and discard all local changes?")) return null;
    setItems(DEMO_CONTENT);
    setWorkspaceName(DEMO_WORKSPACE.name);
    setQuery("");
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(PREFERENCES_KEY);
    return DEMO_WORKSPACE.name;
  };

  const attentionCount = items.filter((item) => item.status === "review" || item.status === "scheduled").length;

  const moveToStatus = (id: string, status: ContentStatus) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setDraggedId(null);
  };

  const changeMonth = (amount: number) => {
    const shifted = shiftMonth(year, month, amount);
    setYear(shifted.year);
    setMonth(shifted.month);
  };

  const moveTabFocus = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const nextView: View = event.key === "ArrowRight" ? "pipeline" : "calendar";
    setView(nextView);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=\"tab\"]");
    tabs?.[nextView === "calendar" ? 0 : 1]?.focus();
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <BrandMark />
        <nav aria-label="Workspace navigation">
          <button className={section === "plan" ? "is-active" : ""} type="button" onClick={() => navigateTo("plan")}><SquaresFour size={18} weight="light" aria-hidden="true" /> Plan</button>
          <button className={section === "library" ? "is-active" : ""} type="button" onClick={() => navigateTo("library")}><FileText size={18} weight="light" aria-hidden="true" /> Library</button>
          <button className={section === "insights" ? "is-active" : ""} type="button" onClick={() => navigateTo("insights")}><ChartBar size={18} weight="light" aria-hidden="true" /> Insights</button>
        </nav>
        <div className="sidebar-bottom">
          <button className={section === "help" ? "is-active" : ""} type="button" onClick={() => navigateTo("help")}><Question size={18} weight="light" aria-hidden="true" /> Help</button>
          <button className={section === "settings" ? "is-active" : ""} type="button" onClick={() => navigateTo("settings")}><Gear size={18} weight="light" aria-hidden="true" /> Settings</button>
          <div className="workspace-person">
            <span>JC</span>
            <div><strong>Joshua</strong><small>Demo workspace</small></div>
          </div>
        </div>
      </aside>

      <main className="app-main" id="main-content">
        <header className="app-topbar">
          <div className="mobile-brand"><BrandMark compact /></div>
          <div className="workspace-heading">
            <span className="eyebrow">Workspace</span>
            <strong>{workspaceName}</strong>
          </div>
          <label className="app-search">
            <MagnifyingGlass size={16} weight="light" aria-hidden="true" />
            <input ref={searchRef} name="content-search" aria-label="Search content" autoComplete="off" value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value) setSection("library"); }} placeholder="Search content…" />
            <kbd>⌘K</kbd>
          </label>
          <div className="topbar-actions">
            <Link className="icon-button" href="/" aria-label="Back to website"><ArrowLeft size={17} weight="light" aria-hidden="true" /></Link>
            <button className={`icon-button notification-trigger ${notificationsOpen ? "is-active" : ""}`} type="button" aria-label={`${attentionCount} notifications`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((current) => !current)}><Bell size={17} weight="light" aria-hidden="true" />{attentionCount > 0 && <span>{attentionCount}</span>}</button>
            <button className="primary-button" type="button" onClick={() => createItem()}>
              <Plus size={16} weight="light" aria-hidden="true" /> New content
            </button>
          </div>
        </header>

        {section === "plan" && <section className="dashboard-content">
          <div className="dashboard-intro">
            <div>
              <p className="section-label">Editorial command centre</p>
              <h1>Keep the story moving.</h1>
              <p>Plan the work, clear the bottlenecks, and publish with intention.</p>
            </div>
            <div className="sync-chip"><span /> Saved locally</div>
          </div>

          <div className="metric-grid">
            <article><span>Planned</span><strong>{String(metrics.planned).padStart(2, "0")}</strong><small>this workspace</small></article>
            <article><span>In progress</span><strong>{String(metrics.inProgress).padStart(2, "0")}</strong><small>needs attention</small></article>
            <article><span>Scheduled</span><strong>{String(metrics.scheduled).padStart(2, "0")}</strong><small>ready to publish</small></article>
            <article className="metric-accent"><span>Published</span><strong>{String(metrics.published).padStart(2, "0")}</strong><small>building momentum</small></article>
          </div>

          <div className="planner-toolbar">
            <div className="view-switcher" role="tablist" aria-label="Planner view">
              <button id="calendar-tab" className={view === "calendar" ? "is-active" : ""} type="button" role="tab" aria-selected={view === "calendar"} aria-controls="calendar-panel" onKeyDown={moveTabFocus} onClick={() => setView("calendar")}>
                <CalendarDots size={15} weight="light" aria-hidden="true" /> Calendar
              </button>
              <button id="pipeline-tab" className={view === "pipeline" ? "is-active" : ""} type="button" role="tab" aria-selected={view === "pipeline"} aria-controls="pipeline-panel" onKeyDown={moveTabFocus} onClick={() => setView("pipeline")}>
                <GridFour size={15} weight="light" aria-hidden="true" /> Pipeline
              </button>
            </div>
            {view === "calendar" && (
              <div className="month-controls">
                <button className="icon-button" type="button" onClick={() => changeMonth(-1)} aria-label="Previous month"><CaretLeft size={17} weight="light" aria-hidden="true" /></button>
                <strong>{formatMonth(year, month)}</strong>
                <button className="icon-button" type="button" onClick={() => changeMonth(1)} aria-label="Next month"><CaretRight size={17} weight="light" aria-hidden="true" /></button>
              </div>
            )}
          </div>

          {view === "calendar" ? (
            <div className="planner-panel" id="calendar-panel" role="tabpanel" aria-labelledby="calendar-tab">
              <CalendarView
                items={filteredItems}
                month={month}
                year={year}
                onOpen={openItem}
                onCreate={createItem}
              />
            </div>
          ) : (
            <div className="planner-panel" id="pipeline-panel" role="tabpanel" aria-labelledby="pipeline-tab">
              <PipelineView
                items={filteredItems}
                draggedId={draggedId}
                onDrag={setDraggedId}
                onMove={moveToStatus}
                onOpen={openItem}
              />
            </div>
          )}

          <span className="sr-only" aria-live="polite">{filteredItems.length} content items shown</span>

          {query && filteredItems.length === 0 && <SearchEmptyState onClear={() => setQuery("")} />}

          <div className="demo-note">
            <Sparkle size={15} weight="light" aria-hidden="true" /> Demo changes are saved in this browser. Cloud workspaces and collaboration are the next product layer.
          </div>
        </section>}

        {section === "library" && <div className="dashboard-content"><LibraryView items={filteredItems} onOpen={openItem} onCreate={() => createItem()} /></div>}
        {section === "insights" && <div className="dashboard-content"><InsightsView items={items} /></div>}
        {section === "settings" && <div className="dashboard-content"><SettingsView workspaceName={workspaceName} onSaveName={saveWorkspaceName} onReset={resetWorkspace} /></div>}
        {section === "help" && <div className="dashboard-content"><HelpView onCreate={() => createItem()} /></div>}
      </main>

      {notificationsOpen && <NotificationsPanel items={items} onOpen={openItem} onClose={() => setNotificationsOpen(false)} />}

      {editorItem && (
        <ContentEditor item={editorItem} onClose={() => setEditorItem(null)} onDelete={deleteItem} onSave={saveItem} />
      )}

      <nav className="mobile-app-nav" aria-label="Mobile workspace navigation">
        <button className={section === "plan" ? "is-active" : ""} type="button" onClick={() => navigateTo("plan")}><SquaresFour size={18} weight="light" aria-hidden="true" /><span>Plan</span></button>
        <button className={section === "library" ? "is-active" : ""} type="button" onClick={() => navigateTo("library")}><FileText size={18} weight="light" aria-hidden="true" /><span>Library</span></button>
        <button className={section === "insights" ? "is-active" : ""} type="button" onClick={() => navigateTo("insights")}><ChartBar size={18} weight="light" aria-hidden="true" /><span>Insights</span></button>
        <button className={section === "help" ? "is-active" : ""} type="button" onClick={() => navigateTo("help")}><Question size={18} weight="light" aria-hidden="true" /><span>Help</span></button>
        <button className={section === "settings" ? "is-active" : ""} type="button" onClick={() => navigateTo("settings")}><Gear size={18} weight="light" aria-hidden="true" /><span>Settings</span></button>
      </nav>
    </div>
  );
}

function CalendarView({
  items,
  month,
  year,
  onOpen,
  onCreate,
}: {
  items: ContentItem[];
  month: number;
  year: number;
  onOpen: (item: ContentItem) => void;
  onCreate: (date: string) => void;
}) {
  const days = getCalendarDays(year, month);

  return (
    <div className="calendar-wrap">
      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const dayItems = items.filter((item) => item.publishDate === day.date);
          return (
            <section className={`calendar-day ${!day.isCurrentMonth ? "is-muted" : ""}`} key={day.date}>
              <button className={`day-number ${day.isToday ? "is-today" : ""}`} type="button" onClick={() => onCreate(day.date)} aria-label={`Add content on ${day.date}`}>
                {day.dayNumber}
              </button>
              <div className="day-items">
                {dayItems.map((item) => (
                  <button className={`calendar-item status-${item.status}`} type="button" key={item.id} onClick={() => onOpen(item)}>
                    <span>{item.format}</span>
                    <strong>{item.title}</strong>
                    <small>{item.platforms[0]}</small>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function PipelineView({
  items,
  draggedId,
  onDrag,
  onMove,
  onOpen,
}: {
  items: ContentItem[];
  draggedId: string | null;
  onDrag: (id: string | null) => void;
  onMove: (id: string, status: ContentStatus) => void;
  onOpen: (item: ContentItem) => void;
}) {
  return (
    <div className="pipeline-grid">
      {CONTENT_STATUSES.map((status) => {
        const statusItems = items.filter((item) => item.status === status);
        return (
          <section
            className="pipeline-column"
            key={status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => draggedId && onMove(draggedId, status)}
          >
            <header><span className={`status-dot status-${status}`} /> <strong>{STATUS_META[status].label}</strong><small>{statusItems.length}</small></header>
            <div className="pipeline-list">
              {statusItems.map((item) => (
                <button
                  type="button"
                  className="pipeline-card"
                  key={item.id}
                  draggable
                  onDragStart={() => onDrag(item.id)}
                  onDragEnd={() => onDrag(null)}
                  onClick={() => onOpen(item)}
                >
                  <div><span>{item.format}</span><small>{formatShortDate(item.publishDate)}</small></div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <footer><span>{item.pillar || "Uncategorised"}</span><b>{item.platforms.length}</b></footer>
                </button>
              ))}
              {statusItems.length === 0 && <p className="empty-column">Drop content here</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
