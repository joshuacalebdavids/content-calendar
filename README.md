# VRTKS Calio

A minimal, browser-based content planner for creators. Plan 12 months of daily content with scripts, hooks, captions, and more — all saved locally in your browser.

**Live demo:** [content-calendar-pearl.vercel.app](https://content-calendar-pearl.vercel.app/)

## Features

- **3 views** — Day, Week, and Overview
- **12-month calendar** — 48 weeks, 5 days per week (Mon–Fri)
- **Full content briefs** — Title, principle, hook, script, delivery notes, b-roll checklist, caption, hashtags
- **Customizable branding** — Name, subtitle, day series, pillars, colors
- **Status tracking** — Idea, Drafting, Ready, Posted
- **Dark / Light theme** — Toggle with preference saved
- **Drag and drop** — Rearrange content between days and weeks
- **Export / Import** — JSON backup files for your data
- **Responsive** — Works on mobile, tablet, and desktop
- **Privacy first** — All data stays in your browser using localStorage. Nothing is sent to a server.

## Getting Started

### Use it now

Visit [content-calendar-pearl.vercel.app](https://content-calendar-pearl.vercel.app/) — no signup, no install.

### Run locally

```bash
git clone https://github.com/joshuacalebdavids/vrtks-calio.git
cd vrtks-calio
npm install
npm run dev
```

### Deploy your own

Click the button below to deploy your own instance to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/joshuacalebdavids/content-calendar)

## Tech Stack

- React 18
- Vite
- Single-file component with inline styles
- No database — localStorage only

## License

MIT

--

"use client";



import { useEffect } from "react";

import { initializeAnimations } from "@/assets/script";



export default function Home() {

useEffect(() => {

const cleanupAnimations = initializeAnimations();



return cleanupAnimations;

}, []);



return (

<main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">

<section className="hero">

<div className="hero-img-container">

<img src="/clubhouse.png" alt="clubhouse" />



<div className="hero-img-logo">

<img src="/logo.svg" alt="logo" />

</div>



<img src="/layer-2.png" alt="blank" />



<div className="hero-img-copy">

<p>Scroll Down</p>

</div>

</div>



<div className="fade-overlay"></div>



<div className="overlay">

<svg width="100%" height="100%">

<defs>

<mask id="logoRevealMask">

<rect width="100%" height="100%" fill="white" />

<path id="logoMask"></path>

</mask>

</defs>

<rect

width="100%"

height="100%"

fill="#232323"

mask="url(#logoRevealMask)"

/>

</svg>

</div>



<div className="logo-container"></div>



<div className="overlay-copy">

<h1>

Coming

<br />

to you

<br />

August

<br />

2026

</h1>

</div>

</section>

<section className="outro">

<p>

Coming

<br />

to you

<br />

August

<br />

2026

</p>

</section>

</main>

);

}





import { logoData } from "./logo";



import gsap from "gsap";

import ScrollTrigger from "gsap/ScrollTrigger";

import Lenis from "lenis";



export function initializeAnimations() {

console.log("working");



gsap.registerPlugin(ScrollTrigger);



const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {

lenis.raf(time * 1000);

});



gsap.ticker.lagSmoothing(0);



const heroImgContainer = document.querySelector(".hero-img-container");

const heroImgLogo = document.querySelector(".hero-img-logo");

const heroImgCopy = document.querySelector(".hero-img-copy");

const fadeOverlay = document.querySelector(".fade-overlay");

const svgOverlay = document.querySelector(".overlay");

const overlayCopy = document.querySelector("h1");



const initialOverlayScale = 350;

const logoContainer = document.querySelector(".logo-container");

const logoMask = document.getElementById("logoMask");



logoMask.setAttribute("d", logoData);



const logoDimensions = logoContainer.getBoundingClientRect();

const logoBoundingBox = logoMask.getBBox();



const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;

const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;

const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);



const logoHorizontalPostion =

logoDimensions.left +

(logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 -

logoBoundingBox.x * logoScaleFactor;

const logoVerticalPostion =

logoDimensions.top +

(logoDimensions.height - logoBoundingBox.height * logoScaleFactor) / 2 -

logoBoundingBox.y * logoScaleFactor;



logoMask.setAttribute(

"transform",

`translate(${logoHorizontalPostion}, ${logoVerticalPostion}) scale(${logoScaleFactor})`,

);



ScrollTrigger.create({

trigger: ".hero",

start: "top top",

end: `${window.innerHeight * 5}px`,

pin: true,

scrub: 1,

onUpdate: (self) => {

const scrollProgress = self.progress;

const fadeOpacity = 1 - scrollProgress * (1 / 0.15);



if (scrollProgress <= 0.15) {

gsap.set([heroImgLogo, heroImgCopy], {

opacity: fadeOpacity,

});

} else {

gsap.set([heroImgLogo, heroImgCopy], {

opacity: 0,

});

}



if (scrollProgress <= 0.85) {

const normalizedProgress = scrollProgress * (1 / 0.85);

const heroImgContainerScale = 1.5 - 0.5 * normalizedProgress;

const overlayScale =

initialOverlayScale *

Math.pow(1 / initialOverlayScale, normalizedProgress);

let fadeOverlayOpacity = 0;



gsap.set(heroImgContainer, {

scale: heroImgContainerScale,

});



gsap.set(svgOverlay, {

scale: overlayScale,

});



if (scrollProgress >= 0.25) {

fadeOverlayOpacity = Math.min(1, (scrollProgress - 0.25) * (1 / 0.4));

}



gsap.set(fadeOverlay, {

opacity: fadeOverlayOpacity,

});

}



console.log("working");



if (scrollProgress >= 0.6 && scrollProgress <= 0.85) {

const overlayCopyRevealprogress = (scrollProgress - 0.6) * (1 / 0.25);



const gradientSpread = 100;

const gradientBottomPosition = 240 - overlayCopyRevealprogress * 280;

const gradientTopPosition = gradientBottomPosition - gradientSpread;

const overlayCopyScale = 1.25 - 0.25 * overlayCopyRevealprogress;



overlayCopy.style.background = `linear-gradient(to bottom, #000 0%, #000 $${gradientTopPosition}%, #5C4E4A ${gradientBottomPosition}%, #5C4E4A 100%`;

overlayCopy.style.backgroundClip = "text";



gsap.set(overlayCopy, {

scale: overlayCopyScale,

opacity: overlayCopyRevealprogress,

});

} else if (scrollProgress < 0.6) {

gsap.set(overlayCopy, {

opacity: 0,

});

}

},

});

}



