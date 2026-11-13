---
title: IBO & CO 2.0
tagline: Full-stack rebuild of a live pharmacy web shop
summary: A ground-up rewrite of the web shop I built for a Sarajevo pharmacy with two branches - from PHP and jQuery-era patterns to React, TypeScript and a tested Node.js API.
year: '2026'
role: Solo - architecture, frontend, backend, tests
context: Personal rebuild of a production client project
categories: [Full-stack, Web]
stack: [React, TypeScript, Vite, Node.js, Express, MySQL, Vitest, Supertest]
featured: 2
order: 2
highlights:
  - Version 1 is live for a real pharmacy with two branches
  - Typed end to end with TypeScript
  - Automated API tests with Vitest and Supertest
links:
  repo: https://github.com/FarisKarkelja/ibo-co-pharmacy
  extra:
    - label: Version 1 (live)
      url: https://apotekaiboco.ba/
todo:
  - Add 2-3 concrete improvements from v1 to v2 (e.g. security fixes, performance, features).
---

## Context

IBO & CO started as my web programming course project and became the real website of a pharmacy in Sarajevo with two branches: product catalogue, shop, user registration and login, backed by a REST API. Version 1 is built with HTML, CSS, JavaScript and Bootstrap on the frontend, and PHP (FlightPHP) with a layered routes / services / DAO backend on MySQL.

## Why rebuild it

Version 1 works, but it was written while I was learning. Version 2 is the same product rebuilt the way I would build it today:

- **Type safety** across the frontend and the API with TypeScript.
- **A component-based UI** in React (Vite) instead of a hand-rolled SPA library.
- **A tested backend**: Node.js and Express on MySQL, with automated API tests (Vitest and Supertest) so changes can be made without fear.
- **Stronger security** around authentication and input handling.

The pharmacy's visual identity stays the same, so the rewrite is a technical upgrade, not a redesign.

## What it shows

Taking an existing production system, understanding why it is built the way it is, and moving it to a cleaner architecture without changing what the client relies on - the kind of work most real software engineering is.
