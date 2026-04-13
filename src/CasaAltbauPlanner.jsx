import React, { useState, useEffect, useCallback, useRef } from "react";

/* ─── Version & Changelog ─── */
const APP_VERSION = "1.4.0";
const CHANGELOG = [
  {
    version: "1.4.0",
    date: "2026-03-30",
    changes: [
      "Added 'Post' as a new format option alongside Reel and Carousel",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-03-10",
    changes: [
      "Fully responsive layout for mobile, tablet, and desktop",
      "Scrollable month and pillar tabs on small screens",
      "Adaptive grid: 1 column on mobile, 2 on tablet, 5 on desktop",
      "Touch-friendly modals with compact padding",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-03-10",
    changes: [
      "Light and dark theme toggle",
      "Theme preference saved across sessions",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-03-10",
    changes: [
      "12-month calendar (48 weeks)",
      "Export and Import backup files",
      "Customizable brand settings (name, colors, pillars, series)",
      "Format selector (Reel / Carousel) per content piece",
      "Status, month, and week selections persist across refreshes",
      "Full-viewport grid layout",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-03-02",
    changes: [
      "Initial release: 5-day content planner with drag-and-drop",
      "Brief modal with editable fields (script, hook, captions, tags)",
      "Week and overview views",
      "Pillar-based filtering",
    ],
  },
];

/* ─── Default Brand Settings ─── */
const DEFAULT_BRAND = {
  name: "VRTKS Calio",
  subtitle: "Content Planner · Reels + Carousels + Posts",
  months: [
    "Month 1",
    "Month 2",
    "Month 3",
    "Month 4",
    "Month 5",
    "Month 6",
    "Month 7",
    "Month 8",
    "Month 9",
    "Month 10",
    "Month 11",
    "Month 12",
  ],
  daySeries: {
    Mon: "Monday Series",
    Tue: "Tuesday Series",
    Wed: "Wednesday Series",
    Thu: "Thursday Series",
    Fri: "Friday Series",
  },
  dayColors: {
    Mon: "#f0c040",
    Tue: "#60aaff",
    Wed: "#ff6b6b",
    Thu: "#4cdd80",
    Fri: "#d070ff",
  },
  pillars: {
    Mon: "Pillar 1",
    Tue: "Pillar 2",
    Wed: "Pillar 3",
    Thu: "Pillar 4",
    Fri: "Pillar 5",
  },
};

const DY = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DY_FULL = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

/* ─── Format options ─── */
const FORMATS = ["Reel", "Carousel", "Post"];

/* ─── Theme Palettes ─── */
const THEMES = {
  dark: {
    bg: "#0f0f0f",
    bgAlt: "#0a0a0a",
    card: "#1a1a1a",
    cardAlt: "#141414",
    cardDark: "#0d0d0d",
    cardHover: "#181818",
    modal: "#131313",
    modalBorder: "#252525",
    text: "#e0e0e0",
    textBright: "#fff",
    textSoft: "#d0d0d0",
    textMuted: "#888",
    textDim: "#777",
    textVeryDim: "#666",
    textFaint: "#555",
    border: "#333",
    borderLight: "#1f1f1f",
    borderDark: "#151515",
    borderMid: "#444",
    inputBg: "#1a1a1a",
    inputBorder: "#333",
    accent: "#fff",
    accentText: "#000",
    btnBg: "#1a1a1a",
    btnActiveBg: "#333",
    btnActiveText: "#fff",
    overlay: "rgba(0,0,0,0.82)",
    shadow: "0 24px 80px rgba(0,0,0,0.6)",
    sectionBg: "#0e0e0e",
    dragOverBg: "#1c1c1c",
    dragOverBorder: "#555",
    readyDot: "#4cdd80",
    hoverBorderSuffix: "77",
  },
  light: {
    bg: "#f4f4f5",
    bgAlt: "#fff",
    card: "#ffffff",
    cardAlt: "#fafafa",
    cardDark: "#f0f0f0",
    cardHover: "#f7f7f7",
    modal: "#ffffff",
    modalBorder: "#e0e0e0",
    text: "#1a1a1a",
    textBright: "#000",
    textSoft: "#333",
    textMuted: "#666",
    textDim: "#777",
    textVeryDim: "#999",
    textFaint: "#bbb",
    border: "#ddd",
    borderLight: "#e5e5e5",
    borderDark: "#eee",
    borderMid: "#ccc",
    inputBg: "#f5f5f5",
    inputBorder: "#ddd",
    accent: "#000",
    accentText: "#fff",
    btnBg: "#fff",
    btnActiveBg: "#e0e0e0",
    btnActiveText: "#000",
    overlay: "rgba(0,0,0,0.4)",
    shadow: "0 24px 80px rgba(0,0,0,0.15)",
    sectionBg: "#f8f8f8",
    dragOverBg: "#f0f0f0",
    dragOverBorder: "#bbb",
    readyDot: "#22a355",
    hoverBorderSuffix: "88",
  },
};

/* ─── Empty day template ─── */
const EMPTY = (d) => ({
  d,
  t: "",
  p: "",
  f: "Reel",
  h: "",
  sc: "",
  dn: "",
  br: "",
  ca: "",
  tg: "",
});
const BLANK_WEEK = () => DY.map((d) => EMPTY(d));

/* ─── Build initial data ─── */
const buildInitialData = () => {
  const weeks = [];
  for (let i = 0; i < 48; i++) weeks.push(BLANK_WEEK());
  weeks[0][0] = {
    d: "Mon",
    t: "Example: Your Monday Topic",
    p: "Principle or angle for this piece",
    f: "Reel",
    h: "Hook line that grabs attention in 0-2 seconds.",
    sc: "Write your full script here.\nBreak into sections as needed.\nInclude visual directions and dialogue.",
    dn: "Format: vertical video, 9:16.\nPlatforms: Instagram Reels, TikTok.\nDuration: 30-60 seconds.",
    br: "Shot 1: Opening visual\nShot 2: Main demonstration\nShot 3: Close-up detail\nShot 4: Final reveal",
    ca: "Your Instagram caption goes here. Tell the story behind the content.\n\nAdd a call to action.",
    tg: "#yourbrand #content #monday",
  };
  return weeks;
};

/* ─── Format colour chips ─── */
const FORMAT_COLORS = {
  Reel: { bg: "#ff6b6b22", text: "#ff6b6b" },
  Carousel: { bg: "#60aaff22", text: "#60aaff" },
  Post: { bg: "#4cdd8022", text: "#4cdd80" },
};

/* ─── Editable Field ─── */
function EditField({
  value,
  onChange,
  color,
  style,
  multiline = true,
  T = THEMES.dark,
  placeholder = "",
}) {
  const baseStyle = {
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: "3px",
    outline: "none",
    width: "100%",
    fontFamily: "'Inter', sans-serif",
    resize: "vertical",
    padding: "6px 8px",
    margin: "-6px -8px",
    transition: "border-color 0.15s, background 0.15s",
    ...style,
  };
  const handlers = {
    onFocus: (e) => {
      e.currentTarget.style.borderColor = color || T.border;
      e.currentTarget.style.background = T.bgAlt;
    },
    onBlur: (e) => {
      e.currentTarget.style.borderColor = "transparent";
      e.currentTarget.style.background = "transparent";
    },
  };
  if (!multiline) {
    return (
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...baseStyle, height: "auto" }}
        {...handlers}
      />
    );
  }
  const rows = Math.max(2, (value || "").split("\n").length + 1);
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      style={{ ...baseStyle, lineHeight: style?.lineHeight || 1.75 }}
      {...handlers}
    />
  );
}

/* ─── Format Select ─── */
function FormatSelect({ value, onChange, T }) {
  const fc = FORMAT_COLORS[value] || { bg: "transparent", text: T.textMuted };
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        display: "inline-block",
        background: fc.bg,
        color: fc.text,
        padding: "4px 12px",
        borderRadius: "3px",
        fontSize: "0.64rem",
        fontWeight: 600,
        letterSpacing: "2px",
        textTransform: "uppercase",
        border: `1px solid ${fc.text}55`,
        fontFamily: "Inter",
        outline: "none",
        cursor: "pointer",
      }}
    >
      {FORMATS.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  );
}

/* ─── Settings Modal ─── */
function SettingsModal({ brand, onSave, onClose, T, mobile }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(brand)));

  const upd = (path, val) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = val;
      return next;
    });
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const labelStyle = {
    fontSize: "0.64rem",
    color: T.textMuted,
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "4px",
  };
  const inputStyle = {
    background: T.inputBg,
    border: `1px solid ${T.inputBorder}`,
    borderRadius: "3px",
    padding: "8px 10px",
    color: T.text,
    fontFamily: "Inter",
    fontSize: "0.82rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };
  const sectionStyle = { marginBottom: "24px" };
  const sectionTitle = {
    fontSize: "0.7rem",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: T.textMuted,
    marginBottom: "12px",
    paddingBottom: "8px",
    borderBottom: `1px solid ${T.modalBorder}`,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: T.overlay,
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "32px 16px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.modal,
          border: `1px solid ${T.modalBorder}`,
          borderRadius: "6px",
          maxWidth: "580px",
          width: "100%",
          padding: mobile ? "20px 16px" : "36px 32px",
          position: "relative",
          color: T.textSoft,
          fontFamily: "'Inter', sans-serif",
          boxShadow: T.shadow,
          marginBottom: "40px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "14px",
            right: "16px",
            background: "none",
            border: `1px solid ${T.borderMid}`,
            color: T.textMuted,
            fontSize: "0.75rem",
            cursor: "pointer",
            borderRadius: "3px",
            padding: "4px 10px",
            fontFamily: "Inter",
            letterSpacing: "1px",
          }}
        >
          ESC
        </button>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: T.textBright,
            margin: "0 0 28px",
          }}
        >
          Brand Settings
        </h2>

        <div style={sectionStyle}>
          <div style={sectionTitle}>Identity</div>
          <div style={{ marginBottom: "12px" }}>
            <div style={labelStyle}>Brand Name</div>
            <input
              style={inputStyle}
              value={draft.name}
              onChange={(e) => upd("name", e.target.value)}
            />
          </div>
          <div>
            <div style={labelStyle}>Subtitle</div>
            <input
              style={inputStyle}
              value={draft.subtitle}
              onChange={(e) => upd("subtitle", e.target.value)}
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitle}>Month Names</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {draft.months.map((m, i) => (
              <div key={i}>
                <div style={labelStyle}>Month {i + 1}</div>
                <input
                  style={inputStyle}
                  value={m}
                  onChange={(e) => {
                    const months = [...draft.months];
                    months[i] = e.target.value;
                    setDraft((prev) => ({ ...prev, months }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitle}>Day Configuration</div>
          {DY.map((d) => (
            <div
              key={d}
              style={{
                display: "grid",
                gridTemplateColumns: mobile
                  ? "40px 1fr 40px"
                  : "50px 1fr 1fr 40px",
                gap: "8px",
                marginBottom: "8px",
                alignItems: "end",
              }}
            >
              <div>
                <div style={labelStyle}>{d}</div>
                <div
                  style={{
                    ...inputStyle,
                    textAlign: "center",
                    fontWeight: 600,
                    color: draft.dayColors[d],
                    background: T.bg,
                    border: `1px solid ${draft.dayColors[d]}44`,
                  }}
                >
                  {d}
                </div>
              </div>
              <div>
                <div style={labelStyle}>
                  {mobile ? "Series / Pillar" : "Series Name"}
                </div>
                <input
                  style={inputStyle}
                  value={draft.daySeries[d]}
                  onChange={(e) => upd(`daySeries.${d}`, e.target.value)}
                />
                {mobile && (
                  <input
                    style={{ ...inputStyle, marginTop: "4px" }}
                    value={draft.pillars[d]}
                    onChange={(e) => upd(`pillars.${d}`, e.target.value)}
                    placeholder="Pillar"
                  />
                )}
              </div>
              {!mobile && (
                <div>
                  <div style={labelStyle}>Pillar</div>
                  <input
                    style={inputStyle}
                    value={draft.pillars[d]}
                    onChange={(e) => upd(`pillars.${d}`, e.target.value)}
                  />
                </div>
              )}
              <div>
                <div style={labelStyle}>Color</div>
                <input
                  type="color"
                  value={draft.dayColors[d]}
                  onChange={(e) => upd(`dayColors.${d}`, e.target.value)}
                  style={{
                    width: "100%",
                    height: "35px",
                    border: `1px solid ${T.border}`,
                    borderRadius: "3px",
                    background: T.inputBg,
                    cursor: "pointer",
                    padding: "2px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <button
            onClick={onClose}
            style={{
              background: T.btnBg,
              border: `1px solid ${T.border}`,
              color: T.textMuted,
              padding: "8px 20px",
              borderRadius: "3px",
              fontSize: "0.76rem",
              fontFamily: "Inter",
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            style={{
              background: T.accent,
              border: `1px solid ${T.accent}`,
              color: T.accentText,
              padding: "8px 20px",
              borderRadius: "3px",
              fontSize: "0.76rem",
              fontFamily: "Inter",
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal Brief Component ─── */
function BriefModal({
  item,
  mo,
  tw,
  onClose,
  edits,
  onEdit,
  brand,
  T,
  mobile,
  sts,
  onStatus,
}) {
  const SC = brand.dayColors;
  const SN = brand.daySeries;
  const PIL = brand.pillars;
  const MN = brand.months;
  const c = SC[item.d];
  const key = `${tw - 1}-${item.d}`;

  const get = (field) => edits[key]?.[field] ?? item[field] ?? "";
  const set = (field) => (val) => onEdit(key, field, val);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const Section = ({ label }) => (
    <div
      style={{
        fontSize: "0.7rem",
        letterSpacing: "3.5px",
        textTransform: "uppercase",
        color: T.textMuted,
        marginBottom: "8px",
        marginTop: "28px",
        borderTop: `1px solid ${T.modalBorder}`,
        paddingTop: "16px",
      }}
    >
      {label}
    </div>
  );

  const fieldBase = { color: T.textSoft, fontFamily: "'Inter', sans-serif" };
  const stC2 = {
    Idea: "#f0c040",
    Drafting: "#60aaff",
    Ready: "#d070ff",
    Posted: "#4cdd80",
  };
  const st = sts[key];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: T.overlay,
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "32px 16px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.modal,
          border: `1px solid ${T.modalBorder}`,
          borderRadius: "6px",
          maxWidth: "660px",
          width: "100%",
          padding: mobile ? "20px 16px" : "40px 38px",
          position: "relative",
          color: T.textSoft,
          lineHeight: 1.75,
          fontFamily: "'Inter', sans-serif",
          boxShadow: T.shadow,
          marginBottom: "40px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "14px",
            right: "16px",
            background: "none",
            border: `1px solid ${T.borderMid}`,
            color: T.textMuted,
            fontSize: "0.75rem",
            cursor: "pointer",
            borderRadius: "3px",
            padding: "4px 10px",
            fontFamily: "Inter",
            letterSpacing: "1px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = T.textBright;
            e.currentTarget.style.borderColor = T.textVeryDim;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = T.textMuted;
            e.currentTarget.style.borderColor = T.borderMid;
          }}
        >
          ESC
        </button>

        {/* Badge row */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: c,
              color: "#000",
              padding: "4px 14px",
              borderRadius: "3px",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}
          >
            {item.d} · {SN[item.d]}
          </span>
          {/* Format selector with colour coding */}
          <FormatSelect value={get("f")} onChange={set("f")} T={T} />
          <span
            style={{
              display: "inline-block",
              background: c + "18",
              color: c,
              padding: "4px 10px",
              borderRadius: "3px",
              fontSize: "0.64rem",
              fontWeight: 500,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {PIL[item.d]}
          </span>
          <select
            value={st || ""}
            onChange={(e) => onStatus(key, e.target.value)}
            style={{
              display: "inline-block",
              background: T.card,
              color: st ? stC2[st] : T.textMuted,
              padding: "4px 12px",
              borderRadius: "3px",
              fontSize: "0.64rem",
              fontWeight: 500,
              letterSpacing: "2px",
              textTransform: "uppercase",
              border: `1px solid ${st ? stC2[st] + "66" : T.border}`,
              fontFamily: "Inter",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">Status</option>
            <option value="Idea">Idea</option>
            <option value="Drafting">Drafting</option>
            <option value="Ready">Ready</option>
            <option value="Posted">Posted</option>
          </select>
        </div>

        <div
          style={{
            color: T.textDim,
            fontSize: "0.68rem",
            letterSpacing: "1.5px",
            marginBottom: "22px",
            textTransform: "uppercase",
          }}
        >
          {brand.name} · Month {mo + 1}: {MN[mo]} · Week {tw}
        </div>

        <EditField
          value={get("t")}
          onChange={set("t")}
          color={c}
          multiline={false}
          T={T}
          placeholder="Content title — what is this piece about?"
          style={{
            ...fieldBase,
            fontSize: "1.25rem",
            fontWeight: 600,
            color: T.textBright,
            lineHeight: 1.35,
            marginBottom: "4px",
          }}
        />
        <EditField
          value={get("p")}
          onChange={set("p")}
          color={c}
          multiline={false}
          T={T}
          placeholder="Angle or principle behind this content"
          style={{
            ...fieldBase,
            fontSize: "0.84rem",
            color: T.textMuted,
            fontStyle: "italic",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        />

        <Section label="Hook (0-2 sec)" />
        <div style={{ borderLeft: `3px solid ${c}`, paddingLeft: "14px" }}>
          <EditField
            value={get("h")}
            onChange={set("h")}
            color={c}
            multiline={false}
            T={T}
            placeholder="Opening line that grabs attention in the first 2 seconds"
            style={{
              ...fieldBase,
              fontSize: "0.95rem",
              color: T.text,
              fontStyle: "italic",
              lineHeight: 1.65,
            }}
          />
        </div>

        <Section label="Script" />
        <EditField
          value={get("sc")}
          onChange={set("sc")}
          color={c}
          T={T}
          placeholder="Write your full script here. Break into sections, include visual directions and dialogue."
          style={{
            ...fieldBase,
            fontSize: "0.88rem",
            color: T.textSoft,
            lineHeight: 1.85,
          }}
        />

        <Section label="Delivery Notes" />
        <div
          style={{
            background: T.sectionBg,
            padding: "14px 16px",
            borderRadius: "4px",
            borderLeft: `3px solid ${c}44`,
          }}
        >
          <EditField
            value={get("dn")}
            onChange={set("dn")}
            color={c}
            T={T}
            placeholder="Format, platforms, duration, aspect ratio..."
            style={{
              ...fieldBase,
              fontSize: "0.84rem",
              color: T.textMuted,
              lineHeight: 1.7,
            }}
          />
        </div>

        <Section label="B-Roll Checklist" />
        <EditField
          value={get("br")}
          onChange={set("br")}
          color={c}
          T={T}
          placeholder="List the shots you need to capture for this piece"
          style={{
            ...fieldBase,
            fontSize: "0.84rem",
            color: T.textMuted,
            lineHeight: 1.9,
          }}
        />

        <Section label="Caption (Instagram)" />
        <EditField
          value={get("ca")}
          onChange={set("ca")}
          color={c}
          T={T}
          placeholder="Write your Instagram caption here. Tell the story, add a call to action."
          style={{
            ...fieldBase,
            fontSize: "0.86rem",
            color: T.textSoft,
            lineHeight: 1.7,
          }}
        />

        <div
          style={{
            marginTop: "24px",
            borderTop: `1px solid ${T.modalBorder}`,
            paddingTop: "14px",
          }}
        >
          <EditField
            value={get("tg")}
            onChange={set("tg")}
            color={c}
            multiline={false}
            T={T}
            placeholder="#hashtags #for #this #post"
            style={{
              ...fieldBase,
              fontSize: "0.78rem",
              color: T.textDim,
              letterSpacing: "0.3px",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "28px",
            borderTop: `1px solid ${T.borderLight}`,
            paddingTop: "14px",
            fontSize: "0.6rem",
            color: T.textFaint,
            textTransform: "uppercase",
            letterSpacing: "2.5px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{brand.name} Content Plan</span>
          <span>
            {SN[item.d]} · WK{tw}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── What's New Modal ─── */
function WhatsNewModal({ onClose, T }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const lastSeen = localStorage.getItem("cp-version") || "0.0.0";
  const newEntries = CHANGELOG.filter((e) => e.version > lastSeen);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: T.overlay,
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "32px 16px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.modal,
          border: `1px solid ${T.modalBorder}`,
          borderRadius: "6px",
          maxWidth: "480px",
          width: "100%",
          padding: "36px 32px",
          position: "relative",
          color: T.textSoft,
          fontFamily: "'Inter', sans-serif",
          boxShadow: T.shadow,
        }}
      >
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: T.textBright,
            margin: "0 0 6px",
          }}
        >
          What's New
        </h2>
        <p
          style={{
            fontSize: "0.68rem",
            color: T.textVeryDim,
            letterSpacing: "1px",
            margin: "0 0 24px",
          }}
        >
          v{APP_VERSION}
        </p>
        {(newEntries.length > 0 ? newEntries : CHANGELOG.slice(0, 1)).map(
          (entry) => (
            <div key={entry.version} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: T.textMuted,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  paddingBottom: "6px",
                  borderBottom: `1px solid ${T.modalBorder}`,
                }}
              >
                v{entry.version} · {entry.date}
              </div>
              <ul style={{ margin: 0, paddingLeft: "16px" }}>
                {entry.changes.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "0.78rem",
                      color: T.textSoft,
                      lineHeight: 1.8,
                      listStyleType: "'·  '",
                    }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
        <button
          onClick={() => {
            localStorage.setItem("cp-version", APP_VERSION);
            onClose();
          }}
          style={{
            background: T.accent,
            border: `1px solid ${T.accent}`,
            color: T.accentText,
            padding: "8px 24px",
            borderRadius: "3px",
            fontSize: "0.76rem",
            fontFamily: "Inter",
            letterSpacing: "1px",
            textTransform: "uppercase",
            cursor: "pointer",
            fontWeight: 600,
            width: "100%",
            marginTop: "8px",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

/* ─── Format badge (read-only chip on cards) ─── */
function FormatBadge({ value }) {
  const fc = FORMAT_COLORS[value] || { bg: "transparent", text: "#888" };
  return (
    <span
      style={{
        fontSize: "0.56rem",
        color: fc.text,
        background: fc.bg,
        padding: "1px 5px",
        borderRadius: "2px",
        letterSpacing: "1px",
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      {value}
    </span>
  );
}

/* ─── Main Planner ─── */
export default function P() {
  const [brand, setBrand] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cp-brand"));
      if (!saved) return { ...DEFAULT_BRAND };
      const merged = { ...DEFAULT_BRAND, ...saved };
      if (!merged.months || merged.months.length < 12)
        merged.months = DEFAULT_BRAND.months;
      return merged;
    } catch {
      return { ...DEFAULT_BRAND };
    }
  });
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("cp-theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const T = THEMES[theme];
  const [showSettings, setShowSettings] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(() => {
    const seen = localStorage.getItem("cp-version");
    return seen !== APP_VERSION;
  });
  const [mo, setMo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cp-mo")) || 0;
    } catch {
      return 0;
    }
  });
  const [wk, setWk] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cp-wk")) || 0;
    } catch {
      return 0;
    }
  });
  const [vw, setVw] = useState(() => {
    try {
      return localStorage.getItem("cp-vw") || "week";
    } catch {
      return "week";
    }
  });
  const [ap, setAp] = useState(null);
  const [sts, setSts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cp-sts") || "{}");
    } catch {
      return {};
    }
  });
  const [modalItem, setModalItem] = useState(null);
  const [edits, setEdits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cp-edits") || "{}");
    } catch {
      return {};
    }
  });
  const [allData, setAllData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cp-data"));
      if (saved && saved.length === 48) return saved;
    } catch {}
    return buildInitialData();
  });
  const [dy, setDy] = useState(() => {
    try {
      return localStorage.getItem("cp-dy") || "Mon";
    } catch {
      return "Mon";
    }
  });
  const [dragOver, setDragOver] = useState(null);
  const dragRef = useRef(null);
  const [winW, setWinW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const h = () => setWinW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const mobile = winW < 640;
  const tablet = winW >= 640 && winW < 1024;

  const SC = brand.dayColors;
  const SN = brand.daySeries;
  const PIL = brand.pillars;
  const MN = brand.months;
  const PILC = {};
  DY.forEach((d) => {
    PILC[PIL[d]] = SC[d];
  });

  const wi = mo * 4 + wk;
  const data = allData[wi];
  const tw = wi + 1;
  const stC = {
    Idea: "#f0c040",
    Drafting: "#60aaff",
    Ready: "#d070ff",
    Posted: "#4cdd80",
  };
  const sk = (d) => `${wi}-${d}`;

  useEffect(() => {
    localStorage.setItem("cp-theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("cp-dy", dy);
  }, [dy]);
  useEffect(() => {
    localStorage.setItem("cp-mo", JSON.stringify(mo));
  }, [mo]);
  useEffect(() => {
    localStorage.setItem("cp-wk", JSON.stringify(wk));
  }, [wk]);
  useEffect(() => {
    localStorage.setItem("cp-vw", vw);
  }, [vw]);
  useEffect(() => {
    localStorage.setItem("cp-brand", JSON.stringify(brand));
  }, [brand]);
  useEffect(() => {
    localStorage.setItem("cp-sts", JSON.stringify(sts));
  }, [sts]);
  useEffect(() => {
    localStorage.setItem("cp-edits", JSON.stringify(edits));
  }, [edits]);
  useEffect(() => {
    localStorage.setItem("cp-data", JSON.stringify(allData));
  }, [allData]);

  const openDoc = useCallback((item) => {
    setModalItem(item);
  }, []);
  const closeModal = useCallback(() => {
    setModalItem(null);
  }, []);
  const handleEdit = useCallback((key, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: value },
    }));
  }, []);
  const getEdited = useCallback(
    (item, field) => {
      const key = `${wi}-${item.d}`;
      return edits[key]?.[field] ?? item[field] ?? "";
    },
    [wi, edits],
  );
  const isMatch = useCallback(
    (d) => {
      if (!ap) return true;
      return PIL[d] === ap;
    },
    [ap, PIL],
  );

  /* ─── Drag & Drop ─── */
  const handleDragStart = useCallback((weekIdx, day, item, e) => {
    dragRef.current = { weekIdx, day, item };
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", "");
    } catch {}
  }, []);
  const handleDragEnd = useCallback(() => {
    dragRef.current = null;
    setDragOver(null);
  }, []);
  const handleDragOver = useCallback((weekIdx, day, e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const key = `${weekIdx}-${day}`;
    setDragOver((prev) => (prev === key ? prev : key));
  }, []);
  const handleDragLeave = useCallback(() => {
    setDragOver(null);
  }, []);
  const handleDrop = useCallback((targetWeekIdx, targetDay, e) => {
    e.preventDefault();
    setDragOver(null);
    if (!dragRef.current) return;
    const { weekIdx: srcWeekIdx, day: srcDay } = dragRef.current;
    dragRef.current = null;
    if (srcWeekIdx === targetWeekIdx && srcDay === targetDay) return;
    setAllData((prev) => {
      const next = prev.map((w) => w.map((i) => ({ ...i })));
      const srcWeek = next[srcWeekIdx];
      const tgtWeek = next[targetWeekIdx];
      const srcIdx = srcWeek.findIndex((x) => x.d === srcDay);
      const tgtIdx = tgtWeek.findIndex((x) => x.d === targetDay);
      if (srcIdx === -1) return prev;
      const srcItem = { ...srcWeek[srcIdx], d: targetDay };
      if (tgtIdx !== -1) {
        const tgtItem = { ...tgtWeek[tgtIdx], d: srcDay };
        srcWeek[srcIdx] = tgtItem;
        tgtWeek[tgtIdx] = srcItem;
      } else {
        srcWeek.splice(srcIdx, 1);
        tgtWeek.push(srcItem);
      }
      const srcKey = `${srcWeekIdx}-${srcDay}`;
      const tgtKey = `${targetWeekIdx}-${targetDay}`;
      setEdits((pe) => {
        const ne = { ...pe };
        const srcE = ne[srcKey];
        const tgtE = ne[tgtKey];
        delete ne[srcKey];
        delete ne[tgtKey];
        if (srcE) ne[tgtKey] = srcE;
        if (tgtE) ne[srcKey] = tgtE;
        return ne;
      });
      setSts((ps) => {
        const ns = { ...ps };
        const srcS = ns[srcKey];
        const tgtS = ns[tgtKey];
        delete ns[srcKey];
        delete ns[tgtKey];
        if (srcS) ns[tgtKey] = srcS;
        if (tgtS) ns[srcKey] = tgtS;
        return ns;
      });
      return next;
    });
  }, []);

  /* ─── Export / Import ─── */
  const exportData = useCallback(() => {
    const backup = {
      brand,
      sts,
      edits,
      allData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [brand, sts, edits, allData]);

  const importData = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.brand) setBrand({ ...DEFAULT_BRAND, ...data.brand });
          if (data.sts) setSts(data.sts);
          if (data.edits) setEdits(data.edits);
          if (data.allData && data.allData.length === 48)
            setAllData(data.allData);
        } catch {
          alert("Invalid backup file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const bs = {
    borderRadius: "3px",
    fontSize: "0.72rem",
    cursor: "pointer",
    fontFamily: "Inter",
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "all 0.15s",
    border: `1px solid ${T.border}`,
    padding: "5px 13px",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter',sans-serif",
        background: T.bg,
        color: T.text,
        padding: mobile ? "10px" : "20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showWhatsNew && (
        <WhatsNewModal onClose={() => setShowWhatsNew(false)} T={T} />
      )}
      {showSettings && (
        <SettingsModal
          brand={brand}
          onSave={setBrand}
          onClose={() => setShowSettings(false)}
          T={T}
          mobile={mobile}
        />
      )}
      {modalItem && (
        <BriefModal
          item={modalItem}
          mo={mo}
          tw={tw}
          onClose={closeModal}
          edits={edits}
          onEdit={handleEdit}
          brand={brand}
          T={T}
          mobile={mobile}
          sts={sts}
          onStatus={(key, val) => setSts((p) => ({ ...p, [key]: val }))}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: mobile ? "stretch" : "flex-end",
          flexDirection: mobile ? "column" : "row",
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: "14px",
          marginBottom: mobile ? "12px" : "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: mobile ? "1rem" : "1.3rem",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: T.textBright,
              margin: 0,
            }}
          >
            {brand.name}
          </h1>
          <p
            style={{
              fontSize: "0.68rem",
              color: T.textDim,
              letterSpacing: "2px",
              textTransform: "uppercase",
              margin: "4px 0 0",
            }}
          >
            {brand.subtitle}
          </p>
        </div>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              ...bs,
              background: T.btnBg,
              color: T.textMuted,
              borderColor: T.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.textBright;
              e.currentTarget.style.borderColor = T.borderMid;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.textMuted;
              e.currentTarget.style.borderColor = T.border;
            }}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              ...bs,
              background: T.btnBg,
              color: T.textMuted,
              borderColor: T.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.textBright;
              e.currentTarget.style.borderColor = T.borderMid;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.textMuted;
              e.currentTarget.style.borderColor = T.border;
            }}
          >
            Settings
          </button>
          <button
            onClick={exportData}
            style={{
              ...bs,
              background: T.btnBg,
              color: T.textMuted,
              borderColor: T.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.textBright;
              e.currentTarget.style.borderColor = T.borderMid;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.textMuted;
              e.currentTarget.style.borderColor = T.border;
            }}
          >
            Export
          </button>
          <button
            onClick={importData}
            style={{
              ...bs,
              background: T.btnBg,
              color: T.textMuted,
              borderColor: T.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.textBright;
              e.currentTarget.style.borderColor = T.borderMid;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.textMuted;
              e.currentTarget.style.borderColor = T.border;
            }}
          >
            Import
          </button>
          {["day", "week", "overview"].map((v) => (
            <button
              key={v}
              onClick={() => {
                setVw(v);
                setAp(null);
              }}
              style={{
                ...bs,
                background: vw === v ? T.accent : T.btnBg,
                color: vw === v ? T.accentText : T.textMuted,
                borderColor: vw === v ? T.accent : T.border,
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Format legend */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.62rem",
            color: T.textVeryDim,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginRight: "2px",
          }}
        >
          FORMAT
        </span>
        {FORMATS.map((f) => {
          const fc = FORMAT_COLORS[f];
          return (
            <span
              key={f}
              style={{
                fontSize: "0.62rem",
                color: fc.text,
                background: fc.bg,
                padding: "3px 10px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600,
                border: `1px solid ${fc.text}33`,
              }}
            >
              {f}
            </span>
          );
        })}
      </div>

      {/* Pillar Filters */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          marginBottom: "14px",
          flexWrap: mobile ? "nowrap" : "wrap",
          overflowX: mobile ? "auto" : "visible",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <span
          style={{
            fontSize: "0.66rem",
            color: T.textVeryDim,
            letterSpacing: "2px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            marginRight: "4px",
          }}
        >
          PILLARS
        </span>
        {Object.entries(PILC).map(([p, c]) => (
          <button
            key={p}
            onClick={() => setAp(ap === p ? null : p)}
            style={{
              ...bs,
              background: ap === p ? c : T.btnBg,
              color: ap === p ? "#000" : c,
              borderColor: ap === p ? c : c + "44",
              fontSize: "0.68rem",
              padding: "4px 12px",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Month tabs */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          marginBottom: "8px",
          flexWrap: mobile ? "nowrap" : "wrap",
          overflowX: mobile ? "auto" : "visible",
          WebkitOverflowScrolling: "touch",
          paddingBottom: mobile ? "4px" : 0,
        }}
      >
        {MN.map((m, i) => (
          <button
            key={i}
            onClick={() => {
              setMo(i);
              setWk(0);
            }}
            style={{
              ...bs,
              fontWeight: mo === i ? 600 : 400,
              background: mo === i ? T.accent : T.btnBg,
              color: mo === i ? T.accentText : T.textMuted,
              borderColor: mo === i ? T.accent : T.border,
              padding: "6px 13px",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            M{i + 1} · {m}
          </button>
        ))}
      </div>

      {/* Week tabs */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          marginBottom: "18px",
          alignItems: "center",
        }}
      >
        {[0, 1, 2, 3].map((w) => (
          <button
            key={w}
            onClick={() => setWk(w)}
            style={{
              ...bs,
              background: wk === w ? T.btnActiveBg : T.btnBg,
              color: wk === w ? T.btnActiveText : T.textDim,
              borderColor: wk === w ? T.borderMid : T.border,
            }}
          >
            WK {mo * 4 + w + 1}
          </button>
        ))}
        <span
          style={{
            fontSize: "0.66rem",
            color: T.textVeryDim,
            marginLeft: "6px",
            letterSpacing: "1px",
          }}
        >
          WEEK {tw} / 48
        </span>
      </div>

      {/* DAY VIEW */}
      {vw === "day" &&
        (() => {
          const item = data.find((x) => x.d === dy);
          const st = sts[sk(dy)];
          const c = SC[dy];
          const fmtVal = edits[`${wi}-${dy}`]?.f ?? (item?.f || "Reel");
          const fc = FORMAT_COLORS[fmtVal] || {
            bg: "transparent",
            text: T.textMuted,
          };
          return (
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  marginBottom: "14px",
                  flexWrap: "wrap",
                }}
              >
                {DY.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDy(d)}
                    style={{
                      ...bs,
                      background: dy === d ? SC[d] : T.btnBg,
                      color: dy === d ? "#000" : SC[d],
                      borderColor: dy === d ? SC[d] : SC[d] + "44",
                      fontWeight: dy === d ? 600 : 400,
                    }}
                  >
                    {DY_FULL[d]}
                  </button>
                ))}
              </div>
              <div
                onClick={() => item && openDoc(item)}
                style={{
                  background: T.cardAlt,
                  border: `1px solid ${c}33`,
                  borderRadius: "4px",
                  padding: mobile ? "16px" : "24px",
                  flex: 1,
                  cursor: item ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        background: c,
                        color: "#000",
                        padding: "4px 14px",
                        borderRadius: "3px",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {DY_FULL[dy]} · {SN[dy]}
                    </span>
                    <span
                      style={{
                        background: c + "18",
                        color: c,
                        padding: "4px 10px",
                        borderRadius: "3px",
                        fontSize: "0.64rem",
                        fontWeight: 500,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {PIL[dy]}
                    </span>
                    {/* Coloured format chip */}
                    <span
                      style={{
                        background: fc.bg,
                        color: fc.text,
                        padding: "4px 10px",
                        borderRadius: "3px",
                        fontSize: "0.64rem",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        border: `1px solid ${fc.text}44`,
                        fontWeight: 600,
                      }}
                    >
                      {fmtVal}
                    </span>
                  </div>
                  {(() => {
                    const stC2 = {
                      Idea: "#f0c040",
                      Drafting: "#60aaff",
                      Ready: "#d070ff",
                      Posted: "#4cdd80",
                    };
                    return (
                      <select
                        value={st || ""}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSts((p) => ({ ...p, [sk(dy)]: e.target.value }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: T.card,
                          color: st ? stC2[st] : T.textMuted,
                          padding: "4px 12px",
                          borderRadius: "3px",
                          fontSize: "0.64rem",
                          fontWeight: 500,
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          border: `1px solid ${st ? stC2[st] + "66" : T.border}`,
                          fontFamily: "Inter",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Status</option>
                        <option value="Idea">Idea</option>
                        <option value="Drafting">Drafting</option>
                        <option value="Ready">Ready</option>
                        <option value="Posted">Posted</option>
                      </select>
                    );
                  })()}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: T.textBright,
                      marginBottom: "4px",
                      lineHeight: 1.4,
                    }}
                  >
                    {getEdited(item || { d: dy }, "t") || (
                      <span style={{ color: T.textFaint }}>
                        Click to add title
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: T.textMuted,
                      fontStyle: "italic",
                      marginBottom: "12px",
                      lineHeight: 1.4,
                    }}
                  >
                    {getEdited(item || { d: dy }, "p") || (
                      <span style={{ color: T.textFaint }}>
                        Click to add principle
                      </span>
                    )}
                  </div>
                  {getEdited(item || { d: dy }, "h") && (
                    <div
                      style={{
                        borderLeft: `3px solid ${c}`,
                        paddingLeft: "12px",
                        fontSize: "0.88rem",
                        color: T.text,
                        fontStyle: "italic",
                        lineHeight: 1.6,
                        marginBottom: "12px",
                      }}
                    >
                      {getEdited(item || { d: dy }, "h")}
                    </div>
                  )}
                  {getEdited(item || { d: dy }, "sc") && (
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: T.textSoft,
                        lineHeight: 1.8,
                        marginBottom: "12px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {getEdited(item || { d: dy }, "sc")}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: T.textFaint,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginTop: "12px",
                    borderTop: `1px solid ${T.borderLight}`,
                    paddingTop: "10px",
                  }}
                >
                  Click to open full brief · {brand.name} · {MN[mo]} · Week {tw}
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.6rem",
                  color: T.textFaint,
                  letterSpacing: "1px",
                  marginTop: "12px",
                  lineHeight: 1.6,
                }}
              >
                All content is saved locally in your browser. Use Export to back
                up your data. Clearing browser data will erase your content
                unless you have a backup file.
              </p>
            </div>
          );
        })()}

      {/* WEEK VIEW */}
      {vw === "week" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
              marginBottom: "14px",
              overflowX: mobile ? "auto" : "visible",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {DY.map((d) => {
              const item = data.find((x) => x.d === d);
              const fv = edits[`${wi}-${d}`]?.f ?? (item?.f || "—");
              const fc = FORMAT_COLORS[fv] || { text: T.textDim };
              return (
                <div
                  key={d}
                  style={{
                    background: T.card,
                    border: `1px solid ${SC[d]}33`,
                    borderRadius: "3px",
                    padding: "3px 10px",
                    fontSize: "0.7rem",
                    color: SC[d],
                    letterSpacing: "1px",
                    opacity: isMatch(d) ? 1 : 0.3,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{DY_FULL[d]}</span> ·{" "}
                  {SN[d]}{" "}
                  <span
                    style={{
                      color: fc.text,
                      fontSize: "0.64rem",
                      fontWeight: 600,
                    }}
                  >
                    ({fv})
                  </span>
                </div>
              );
            })}
          </div>
          <p
            style={{
              fontSize: "0.66rem",
              color: T.textVeryDim,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Drag cards to rearrange · Click to open brief
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile
                ? "1fr"
                : tablet
                  ? "repeat(2,1fr)"
                  : "repeat(5,1fr)",
              gridTemplateRows: mobile
                ? undefined
                : tablet
                  ? undefined
                  : "auto 1fr",
              gap: "4px",
              marginBottom: "12px",
              flex: 1,
            }}
          >
            {!mobile &&
              !tablet &&
              DY.map((d) => (
                <div
                  key={d}
                  style={{
                    background: T.card,
                    borderRadius: "3px",
                    padding: "4px",
                    textAlign: "center",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    color: SC[d],
                    letterSpacing: "1.5px",
                    opacity: isMatch(d) ? 1 : 0.3,
                  }}
                >
                  {DY_FULL[d].toUpperCase()}
                </div>
              ))}
            {DY.map((d) => {
              const item = data.find((x) => x.d === d);
              const isOver = dragOver === `${wi}-${d}`;
              if (!item)
                return (
                  <div
                    key={d}
                    onDragOver={(e) => handleDragOver(wi, d, e)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(wi, d, e)}
                    style={{
                      background: isOver ? T.dragOverBg : "transparent",
                      border: isOver
                        ? `1px dashed ${T.dragOverBorder}`
                        : "1px dashed transparent",
                      borderRadius: "3px",
                      minHeight: "60px",
                      transition: "all 0.15s",
                    }}
                  />
                );
              const st = sts[sk(d)];
              const match = isMatch(d);
              const fv = getEdited(item, "f");
              const fc = FORMAT_COLORS[fv] || {
                bg: "transparent",
                text: T.textDim,
              };
              return (
                <div
                  key={`c-${d}`}
                  draggable
                  onDragStart={(e) => handleDragStart(wi, d, item, e)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(wi, d, e)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(wi, d, e)}
                  onClick={() => openDoc(item)}
                  style={{
                    background: isOver
                      ? T.cardHover
                      : match
                        ? T.cardAlt
                        : T.cardDark,
                    border: isOver
                      ? `1px dashed ${T.textVeryDim}`
                      : `1px solid ${match ? T.borderLight : T.borderDark}`,
                    borderRadius: "3px",
                    padding: "6px",
                    minHeight: "60px",
                    cursor: "grab",
                    transition: "all 0.15s",
                    position: "relative",
                    opacity: match ? 1 : 0.2,
                  }}
                  onMouseEnter={(e) => {
                    if (match) {
                      e.currentTarget.style.borderColor =
                        SC[d] + T.hoverBorderSuffix;
                      e.currentTarget.style.background = T.cardHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = match
                      ? T.borderLight
                      : T.borderDark;
                    e.currentTarget.style.background = match
                      ? T.cardAlt
                      : T.cardDark;
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      {(mobile || tablet) && (
                        <span
                          style={{
                            fontSize: "0.54rem",
                            color: SC[d],
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            opacity: 0.8,
                          }}
                        >
                          {DY_FULL[d]} ·
                        </span>
                      )}
                      {/* Coloured format badge */}
                      <span
                        style={{
                          fontSize: "0.54rem",
                          color: fc.text,
                          background: fc.bg,
                          padding: "1px 5px",
                          borderRadius: "2px",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {fv}
                      </span>
                    </div>
                    {st ? (
                      <span
                        style={{
                          fontSize: "0.5rem",
                          color: stC[st],
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          background: stC[st] + "18",
                          padding: "1px 6px",
                          borderRadius: "2px",
                        }}
                      >
                        {st}
                      </span>
                    ) : (
                      <div
                        style={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          background: T.textFaint,
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: T.text,
                      lineHeight: 1.4,
                      marginBottom: "2px",
                    }}
                  >
                    {getEdited(item, "t")}
                  </div>
                  <div
                    style={{
                      fontSize: "0.58rem",
                      color: T.textDim,
                      lineHeight: 1.3,
                    }}
                  >
                    {getEdited(item, "p")}
                  </div>
                  {getEdited(item, "h") && (
                    <div
                      style={{
                        fontSize: "0.58rem",
                        color: T.textMuted,
                        fontStyle: "italic",
                        lineHeight: 1.4,
                        marginTop: "4px",
                        borderLeft: `2px solid ${SC[d]}33`,
                        paddingLeft: "6px",
                      }}
                    >
                      {getEdited(item, "h")}
                    </div>
                  )}
                  {getEdited(item, "sc") && (
                    <div
                      style={{
                        fontSize: "0.56rem",
                        color: T.textVeryDim,
                        lineHeight: 1.55,
                        marginTop: "6px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {getEdited(item, "sc")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p
            style={{
              fontSize: "0.6rem",
              color: T.textFaint,
              letterSpacing: "1px",
              marginTop: "12px",
              lineHeight: 1.6,
            }}
          >
            All content is saved locally in your browser. Use Export to back up
            your data. Clearing browser data will erase your content unless you
            have a backup file.
          </p>
        </div>
      )}

      {/* OVERVIEW */}
      {vw === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <p
            style={{
              fontSize: "0.66rem",
              color: T.textVeryDim,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Month {mo + 1}: {MN[mo]} — Drag cards to rearrange
          </p>
          <div
            style={{
              display: mobile ? "flex" : "grid",
              flexDirection: mobile ? "column" : undefined,
              gridTemplateColumns: mobile
                ? undefined
                : tablet
                  ? "auto repeat(3,1fr)"
                  : "auto repeat(5,1fr)",
              gridTemplateRows: mobile ? undefined : "auto repeat(4, 1fr)",
              gap: "4px",
              flex: 1,
            }}
          >
            {!mobile && (
              <>
                <div />
                {(tablet ? DY.slice(0, 3) : DY).map((d) => (
                  <div
                    key={d}
                    style={{
                      background: T.card,
                      borderRadius: "3px",
                      padding: "4px",
                      textAlign: "center",
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      color: SC[d],
                      letterSpacing: "1.5px",
                      opacity: isMatch(d) ? 1 : 0.3,
                    }}
                  >
                    {SN[d].toUpperCase()}
                  </div>
                ))}
              </>
            )}
            {[0, 1, 2, 3].map((w) => {
              const gi = mo * 4 + w;
              const wd = allData[gi];
              const days = tablet ? DY.slice(0, 3) : DY;
              return (
                <React.Fragment key={`row-${w}`}>
                  {mobile && (
                    <div
                      style={{
                        background: T.card,
                        borderRadius: "3px",
                        padding: "6px 8px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: T.textSoft,
                        letterSpacing: "1.5px",
                        marginTop: w > 0 ? "8px" : 0,
                      }}
                    >
                      WK{gi + 1}
                    </div>
                  )}
                  {!mobile && (
                    <div
                      style={{
                        background: T.card,
                        borderRadius: "3px",
                        padding: "5px",
                        fontSize: "0.64rem",
                        fontWeight: 700,
                        color: T.textSoft,
                        letterSpacing: "1.5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      WK{gi + 1}
                    </div>
                  )}
                  {days.map((d) => {
                    const item = wd.find((x) => x.d === d);
                    const isOver = dragOver === `${gi}-${d}`;
                    const match = isMatch(d);
                    if (!item)
                      return (
                        <div
                          key={d}
                          onDragOver={(e) => handleDragOver(gi, d, e)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(gi, d, e)}
                          style={{
                            background: isOver ? T.dragOverBg : "transparent",
                            border: isOver
                              ? `1px dashed ${T.dragOverBorder}`
                              : "1px dashed transparent",
                            borderRadius: "3px",
                            minHeight: mobile ? "40px" : "60px",
                            transition: "all 0.15s",
                          }}
                        />
                      );
                    const ovSt = sts[`${gi}-${d}`];
                    const fv = edits[`${gi}-${d}`]?.f ?? item.f;
                    const fc = FORMAT_COLORS[fv] || {
                      bg: "transparent",
                      text: T.textDim,
                    };
                    return (
                      <div
                        key={`${w}-${d}`}
                        draggable={!mobile}
                        onDragStart={(e) => handleDragStart(gi, d, item, e)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(gi, d, e)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(gi, d, e)}
                        onClick={() => {
                          setWk(w);
                          openDoc(item);
                        }}
                        style={{
                          background: isOver
                            ? T.cardHover
                            : match
                              ? T.cardAlt
                              : T.cardDark,
                          border: isOver
                            ? `1px dashed ${T.textVeryDim}`
                            : `1px solid ${match ? T.borderLight : T.borderDark}`,
                          borderRadius: "3px",
                          padding: "6px",
                          cursor: mobile ? "pointer" : "grab",
                          minHeight: mobile ? "40px" : "60px",
                          position: "relative",
                          transition: "all 0.15s",
                          opacity: match ? 1 : 0.2,
                        }}
                        onMouseEnter={(e) => {
                          if (match)
                            e.currentTarget.style.borderColor = T.borderMid;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = match
                            ? T.borderLight
                            : T.borderDark;
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "2px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "3px",
                              alignItems: "center",
                            }}
                          >
                            {mobile && (
                              <span
                                style={{
                                  fontSize: "0.54rem",
                                  color: SC[d],
                                  letterSpacing: "1px",
                                  textTransform: "uppercase",
                                  opacity: 0.8,
                                }}
                              >
                                {DY_FULL[d]} ·
                              </span>
                            )}
                            {/* Coloured format badge */}
                            <span
                              style={{
                                fontSize: "0.5rem",
                                color: fc.text,
                                background: fc.bg,
                                padding: "1px 4px",
                                borderRadius: "2px",
                                letterSpacing: "0.8px",
                                textTransform: "uppercase",
                                fontWeight: 600,
                              }}
                            >
                              {fv}
                            </span>
                          </div>
                          {ovSt ? (
                            <span
                              style={{
                                fontSize: "0.46rem",
                                color: stC[ovSt],
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                fontWeight: 600,
                                background: stC[ovSt] + "18",
                                padding: "1px 4px",
                                borderRadius: "2px",
                              }}
                            >
                              {ovSt}
                            </span>
                          ) : (
                            <div
                              style={{
                                width: "3px",
                                height: "3px",
                                borderRadius: "50%",
                                background: T.textFaint,
                              }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: "0.68rem",
                            color: T.text,
                            lineHeight: 1.4,
                            marginBottom: "2px",
                          }}
                        >
                          {edits[`${gi}-${d}`]?.t ?? item.t}
                        </div>
                        <div
                          style={{
                            fontSize: "0.58rem",
                            color: T.textDim,
                            lineHeight: 1.3,
                          }}
                        >
                          {edits[`${gi}-${d}`]?.p ?? item.p}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
