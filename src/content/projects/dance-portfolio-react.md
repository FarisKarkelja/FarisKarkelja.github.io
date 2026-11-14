---
title: FK - Dance Portfolio (React)
tagline: My dance portfolio, rebuilt in React
summary: A React rewrite of my dance website, originally built in 2024 as a university project - biography, performances loaded from a data file, a masonry gallery and a validated contact form.
year: "2024"
role: Solo - design & development
context: Personal project
categories: [Web]
stack: [React, Vite, Material UI, React Router, ESLint]
order: 12
highlights:
  - Rewrite of the jQuery version with React components and routing
  - Performances rendered from one JSON data file
  - Masonry gallery and a contact form with client-side validation
links:
  repo: https://github.com/FarisKarkelja/dance-portfolio-react
todo:
  - Confirm the year and add a live link if there is one.
---

## Why rebuild it

The first version was HTML, SCSS and jQuery, and repeated sections - performance cards, gallery items, navigation - were written by hand. Rebuilding it in React turned each of them into a component fed by data, so adding a new performance means adding one entry to a JSON file, not new markup.

## What it includes

- Home with a full-width stage photo and a signature logo
- About with my biography
- Projects: performances such as two Supertalent appearances, an Erasmus+ dance exchange in Montecatini Terme in Italy and a talk show on Hayat TV, each with year, organizers and collaborators
- A responsive masonry gallery
- A contact form with client-side validation of name, email, subject and message
- A collapsible mobile menu, dark theme and a custom signature font

## How it is built

React 18 with Vite, Material UI and Emotion for components and theming, React Router for pages, and ESLint for code quality.
