import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import P from "./CasaAltbauPlanner.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <P />
    <Analytics />
  </>
);
