---
title: Mini Quiz App
tagline: A quiz app built around three classic design patterns
summary: A small web quiz on design patterns, built to apply Factory Method, Facade and Strategy to a real problem, with a PHP backend, a vanilla JavaScript frontend and Docker.
year: "2026"
role: Solo
context: Software design course project, IBU
categories: [Web, Full-stack]
stack: [PHP, JavaScript, HTML, CSS, JSON, Docker]
order: 9
highlights:
  - Factory Method creates every question type without hardcoded classes
  - A Facade gives the frontend two simple calls for the whole quiz
  - Swappable grading through the Strategy pattern
links:
  repo: https://github.com/FarisKarkelja/mini-quiz-app
---

## The idea

After analysing the Sakai learning platform and its weak points, I built a small app in the same category to show how design patterns fix those problems.

## How it is built

- **Factory Method** creates multiple-choice, true/false and short-answer questions, so a new question type is one new class
- **Facade** hides loading, grading and strategy selection behind two methods, so the frontend never touches the internals
- **Strategy** makes grading swappable without changing the quiz itself

A PHP backend serves a JSON-based question bank to a vanilla JavaScript frontend, and the whole app runs in a Docker container.