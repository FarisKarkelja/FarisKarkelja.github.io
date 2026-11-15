---
title: Secure Auth Platform
tagline: A hardened authentication system with 2FA, OAuth and a production deployment
summary: A full-stack authentication platform built for the Secure Software System Design course - registration, login, four kinds of two-factor authentication, Google and GitHub sign-in, session management and an admin panel, deployed on a hardened Linux server.
year: "2026"
role: Solo - full-stack and deployment
context: Secure Software System Design course, IBU
categories: [Full-stack, Web]
stack: [TypeScript, Node.js, Express, MySQL, JWT, bcrypt, OAuth 2.0, Swagger, Nginx, PM2, DigitalOcean]
order: 4
highlights:
  - Two-factor authentication by authenticator app, email, SMS and recovery codes
  - Defence against brute force, bots and leaked passwords
  - Deployed on a hardened VPS behind Nginx with HTTPS and a firewall
links:
  note: Course repository is private - code available on request.
---

## The goal

Build an authentication system the way it should be built in production, where every feature is also a security decision.

## What it does

- Registration with password strength checks and a check against known leaked passwords
- Login with JWT sessions, a list of signed-in devices and the option to sign out remotely
- Two-factor authentication through an authenticator app (TOTP with QR code), email or SMS, plus one-time recovery codes
- Sign-in with Google and GitHub
- Password reset by email, security alerts and an admin dashboard for user management

## How it is protected

- Passwords hashed with bcrypt, strength scored with zxcvbn and checked against Have I Been Pwned
- Rate limiting and hCaptcha against brute-force and bot attacks
- Phone numbers validated, secrets kept out of the repository in environment variables
- API documented with OpenAPI and Swagger

## Deployment

The app runs on a DigitalOcean Ubuntu server, managed by PM2 behind an Nginx reverse proxy, with a Let's Encrypt TLS certificate, a firewall that allows only SSH, HTTP and HTTPS, and SSH access by key only.