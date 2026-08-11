"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Trash, X } from "@phosphor-icons/react";
import {
  CONTENT_FORMATS,
  CONTENT_STATUSES,
  PLATFORMS,
  type ContentItem,
  type Platform,
} from "@/lib/types";

interface ContentEditorProps {
  item: ContentItem;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (item: ContentItem) => void;
}

const STATUS_LABELS: Record<ContentItem["status"], string> = {
  idea: "Idea",
  drafting: "Drafting",
  review: "In review",
  scheduled: "Scheduled",
  published: "Published",
};

export function ContentEditor({ item, onClose, onDelete, onSave }: ContentEditorProps) {
  const [draft, setDraft] = useState(item);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(item);
  const dialogRef = useRef<HTMLElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const requestClose = useCallback(() => {
    if (!isDirty || window.confirm("Discard your unsaved changes?")) onClose();
  }, [isDirty, onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    if (window.matchMedia("(min-width: 768px)").matches) titleInputRef.current?.focus();
    else dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]',
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [requestClose]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const update = <Key extends keyof ContentItem>(key: Key, value: ContentItem[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const togglePlatform = (platform: Platform) => {
    update(
      "platforms",
      draft.platforms.includes(platform)
        ? draft.platforms.filter((entry) => entry !== platform)
        : [...draft.platforms, platform],
    );
  };

  const confirmDelete = () => {
    if (window.confirm(`Delete “${draft.title || "Untitled content"}”? This cannot be undone.`)) {
      onDelete(draft.id);
    }
  };

  return (
    <div className="editor-backdrop" role="presentation" onMouseDown={requestClose}>
      <section
        ref={dialogRef}
        className="content-editor"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby="content-editor-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="editor-header">
          <div>
            <span className="eyebrow">Content brief</span>
            <h2 id="content-editor-title">Shape the idea</h2>
          </div>
          <button className="icon-button" type="button" onClick={requestClose} aria-label="Close editor">
            <X size={18} weight="light" aria-hidden="true" />
          </button>
        </header>

        <div className="editor-grid">
          <label className="field field-wide">
            <span>Working title</span>
            <input
              ref={titleInputRef}
              value={draft.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="Give this idea a clear name…"
              name="title"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>Publish date</span>
            <input
              type="date"
              name="publish-date"
              value={draft.publishDate}
              onChange={(event) => update("publishDate", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select
              value={draft.status}
              name="status"
              onChange={(event) => update("status", event.target.value as ContentItem["status"])}
            >
              {CONTENT_STATUSES.map((status) => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Format</span>
            <select
              value={draft.format}
              name="format"
              onChange={(event) => update("format", event.target.value as ContentItem["format"])}
            >
              {CONTENT_FORMATS.map((format) => <option key={format}>{format}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Content pillar</span>
            <input name="pillar" autoComplete="off" value={draft.pillar} onChange={(event) => update("pillar", event.target.value)} />
          </label>

          <fieldset className="field field-wide platform-field">
            <legend>Platforms</legend>
            <div className="platform-options">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  className={draft.platforms.includes(platform) ? "is-selected" : ""}
                  type="button"
                  aria-pressed={draft.platforms.includes(platform)}
                  onClick={() => togglePlatform(platform)}
                >
                  {draft.platforms.includes(platform) && <Check size={13} weight="light" aria-hidden="true" />}
                  {platform}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="field field-wide">
            <span>Summary</span>
            <textarea
              rows={2}
              name="summary"
              value={draft.summary}
              onChange={(event) => update("summary", event.target.value)}
              placeholder="What is this piece trying to do?…"
            />
          </label>
          <label className="field field-wide">
            <span>Hook</span>
            <textarea
              rows={2}
              name="hook"
              value={draft.hook}
              onChange={(event) => update("hook", event.target.value)}
              placeholder="The opening line that earns attention…"
            />
          </label>
          <label className="field field-wide">
            <span>Caption</span>
            <textarea
              rows={4}
              name="caption"
              value={draft.caption}
              onChange={(event) => update("caption", event.target.value)}
              placeholder="Draft the post copy…"
            />
          </label>
          <label className="field field-wide">
            <span>Production notes</span>
            <textarea
              rows={3}
              name="production-notes"
              value={draft.productionNotes}
              onChange={(event) => update("productionNotes", event.target.value)}
              placeholder="Assets, shots, links, or handoff notes…"
            />
          </label>
        </div>

        <footer className="editor-footer">
          <button className="danger-button" type="button" onClick={confirmDelete}>
            <Trash size={15} weight="light" aria-hidden="true" /> Delete
          </button>
          <div>
            <button className="secondary-button" type="button" onClick={requestClose}>Cancel</button>
            <button
              className="primary-button"
              type="button"
              disabled={!draft.title.trim()}
              onClick={() => onSave(draft)}
            >
              Save brief
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
