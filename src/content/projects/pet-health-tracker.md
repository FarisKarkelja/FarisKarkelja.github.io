---
title: Pet Health Tracker
tagline: A desktop app for keeping pets' health records in one place
summary: A Python app for pet owners, with accounts, multiple pets, health records, vaccinations and vet appointments, available as a console app and a desktop GUI.
year: "2024"
role: Solo
context: Programming course project, IBU
categories: [Systems]
stack: [Python, CustomTkinter, JSON]
order: 14
highlights:
  - Accounts with saved data for multiple pets
  - Health records, vaccinations and vet appointments
  - Console version and a desktop GUI
links:
  repo: https://github.com/FarisKarkelja/pet-health-tracker
---

## The idea

Pet owners keep vaccination dates, vet visits and health notes scattered across papers and phone notes. Pet Health Tracker puts all of it in one place, for every pet an owner has.

## What it does

- Accounts with registration and login, so each owner sees only their own pets
- Several pets per owner, with breed, age, weight and vaccination status
- Health records and vaccinations logged by date
- Vet appointments, with the next recommended visit calculated automatically
- A console version and a desktop app with a modern interface built in CustomTkinter

## How it is built

Python with object-oriented models for owners, pets and records. Data is saved to JSON and text files between sessions, and the app validates every input so wrong dates or numbers never break it.

## What I learned

It was one of my first complete applications. Building the same logic for both a console and a GUI version showed me why the data and the interface should be kept separate.