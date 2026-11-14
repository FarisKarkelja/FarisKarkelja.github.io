---
title: IBO & CO 2.0
tagline: Full-stack rebuild of a live pharmacy web shop
summary: A complete TypeScript rewrite of the web shop I built for a Sarajevo pharmacy with two locations - catalogue, cart, in-store pickup orders and reviews for customers, and an admin panel with sales charts for staff.
year: "2026"
role: Solo - architecture, frontend, backend, tests
context: Personal rebuild of a production client project
categories: [Full-stack, Web]
stack:
  [
    React,
    TypeScript,
    Vite,
    Tailwind CSS,
    TanStack Query,
    Node.js,
    Express,
    Drizzle ORM,
    Zod,
    MySQL,
    Vitest,
    Supertest,
  ]
featured: 2
order: 2
highlights:
  - Every v1 feature kept, the whole stack rebuilt in TypeScript
  - Admin panel with revenue and order charts, order, product and user management
  - One shared validation layer for forms and API, documented with OpenAPI
links:
  repo: https://github.com/FarisKarkelja/ibo-co-pharmacy
  extra:
    - label: Version 1 (live)
      url: https://apotekaiboco.ba/
todo:
  - Add 2-3 concrete improvements from v1 to v2 (e.g. security fixes, performance, features).
---

## Context

IBO & CO started as my web programming course project and became the real website of a pharmacy in Sarajevo with two locations. Version 1 is a jQuery single-page app with a PHP REST API on MySQL. Version 2 keeps every feature and the pharmacy's visual identity, and rebuilds everything in TypeScript.

## What customers get

- A catalogue with categories, search, sorting, filters and pagination
- Product pages with related products and a notice for prescription-only medicines
- A cart with VAT breakdown and a choice of pickup location, then checkout for in-store pickup
- A profile with order history, order cancellation, password change and account deletion
- Reviews with star ratings, and a contact form

## What staff get

An admin panel with a dashboard (revenue, orders, users, ratings, unread messages), charts for daily orders, revenue and sales by category, and management of orders, products, categories with image upload, users and roles, reviews and contact messages.

## How it is built

- **Monorepo** with npm workspaces: client, server and one shared package with validation schemas, types and business rules used by both sides
- **Frontend:** React 19, Vite, React Router, TanStack Query and Table, React Hook Form, Tailwind CSS and accessible Radix UI components
- **Backend:** Express 5 with routes, controllers, services and repositories organized by feature; Drizzle ORM on MySQL with versioned migrations
- **Security:** JWT in an httpOnly cookie, bcrypt, Helmet, rate limiting and input validation with Zod
- **Quality:** Vitest and Supertest integration tests, and Swagger docs generated from the same schemas
- **Performance:** code splitting, so the admin panel and charts load only for admins

## What it shows

Taking a system that is already in production, understanding why it is built the way it is, and moving it to a cleaner, typed, tested architecture without changing what the client relies on.
