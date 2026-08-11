const previewItems = [
  { day: "11", title: "Two-hour content sprint", tag: "Newsletter" },
  { day: "13", title: "Stop opening with credentials", tag: "LinkedIn" },
  { day: "17", title: "Studio desk reset", tag: "Reel" },
  { day: "20", title: "Stronger point of view", tag: "Carousel" },
];

export function MarketingPreview() {
  return (
    <div className="preview-frame" data-product-preview aria-hidden="true">
      <div className="marketing-preview">
        <div className="preview-rail">
          <span className="brand-glyph">C/</span>
          <span className="preview-rail-dot is-active" />
          <span className="preview-rail-dot" />
          <span className="preview-rail-dot" />
          <span className="preview-rail-dot" />
        </div>
        <div className="preview-main">
          <div className="preview-topbar">
            <div>
              <span className="eyebrow">Northstar Studio</span>
              <strong>August 2026</strong>
            </div>
            <span className="preview-action">+ New content</span>
          </div>
          <div className="preview-metrics">
            <span><b>08</b> planned</span>
            <span><b>03</b> scheduled</span>
            <span><b>02</b> published</span>
          </div>
          <div className="preview-calendar">
            {previewItems.map((item) => (
              <article key={item.day} className="preview-card">
                <span>{item.day} Aug</span>
                <strong>{item.title}</strong>
                <small>{item.tag}</small>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
