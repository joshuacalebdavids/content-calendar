"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="system-page">
          <header><span className="brand-mark"><span className="brand-glyph">C/</span><span>calio</span></span><span>Error</span></header>
          <div className="system-page-copy">
            <p className="section-label">Something went wrong</p>
            <h1>The workspace<br />lost its place.</h1>
            <p>Reload this view. Your locally saved content will remain available.</p>
            <button className="button" type="button" onClick={reset}>Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
