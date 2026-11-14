---
title: Serviqo
tagline: Table-side ordering and restaurant management
summary: A full-stack restaurant system built for the Software Engineering course. Guests order from their table through a unique link or QR code, while staff manage orders, tables, waiter and bill requests, and follow live revenue analytics.
year: "2026"
role: Full-stack developer
context: University team project
categories: [Full-stack, Team]
stack: [PHP, Flight, JavaScript, Vite, MySQL, JWT, PHPUnit, Selenium, pytest]
order: 10
highlights:
  - Guests order from their table via a QR code, no account needed
  - Call Waiter and Request Bill, resolved by staff in the admin panel
  - Live analytics with design patterns, tested with PHPUnit and Selenium
links:
  repo: https://github.com/FarisKarkelja/restaurant-system
todo:
  - Add year, stack and your role.
---

## The idea

Waiting for a menu, a waiter and then the bill is the slowest part of eating out. Serviqo puts all three on the table: every table has a unique token, so guests scan a QR code, browse the menu and order without an account.

## What guests get

- A menu split into starters, mains, desserts and drinks, with photos, prices and trending items
- Search and dietary filters - vegan, vegetarian, halal, gluten-free, spicy
- An order bar always within reach: Order, Call Waiter and Request Bill

## What staff get

- Live order tracking with status updates
- Menu management, table status and waiter-to-table assignments
- A queue of waiter and bill requests to resolve
- An analytics dashboard with revenue trends, peak hours, average order value and popular items

## How it is built

A PHP backend on the Flight micro-framework with MySQL and JWT authentication with roles for staff, admin and guests, and a vanilla JavaScript frontend bundled with Vite. The analytics use the Strategy pattern for each metric and an event bus (Observer) that refreshes the dashboard as new orders arrive. PHPUnit covers analytics, JWT and password hashing, and a Selenium and pytest suite tests login, registration, cart, menu filters and admin navigation end to end.
