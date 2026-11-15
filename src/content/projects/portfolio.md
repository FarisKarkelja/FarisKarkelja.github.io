---
title: Personal Portfolio
tagline: This website, built from scratch with Astro, TypeScript and Three.js
summary: My personal portfolio, designed and built from scratch as a fast static site with real-time 3D, a working terminal, five colour themes and automatic deployment to GitHub Pages.
year: "2026"
role: Solo - design, development and deployment
context: Personal project
categories: [Web]
stack: [Astro, TypeScript, Three.js, GSAP, CSS, GitHub Actions, Claude Code]
order: 5
highlights:
  - Real-time 3D devices and dance scene, built in code with Three.js
  - Content driven from data files, so every text lives in one place
  - Accessible, responsive and deployed automatically on every push
links:
  live: https://fariskarkelja.github.io/
  repo: https://github.com/FarisKarkelja/FarisKarkelja.github.io
---

## The goal

A portfolio that shows how I work, not only what I have done. It had to be fast, readable for recruiters on any device, and still have a few moments that people remember.

## What it does

- Project screenshots appear on realistic 3D laptops and phones, rendered live with Three.js at real device proportions
- A scroll-driven salsa scene, counted 1 to 8, links each count to something dance taught me about work
- A working terminal (Ctrl+K) with commands for projects, skills and contact
- Five colour themes that switch instantly and are remembered between visits
- Case study pages for every project, with filters and paging for longer lists

## How it is built

Astro generates a static site, so pages load fast and work without a server. All text, projects, awards and performances come from typed data and Markdown files, so the content changes without touching the layout. One shared WebGL context renders every 3D device on a page, and heavy libraries load only when they scroll into view. The site respects reduced motion, works with the keyboard and is deployed by GitHub Actions on every push to main.

## How I worked

I designed and built the site myself, using Claude Code as an AI pair programmer for parts of the implementation and review. Deciding what to build, checking every change on real devices and keeping the content accurate was my job.
