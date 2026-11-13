---
title: TTStudy
tagline: Text-to-speech study aid for visually impaired students
summary: A web app that turns study PDFs into navigable, natural-sounding audio for visually impaired students in the Western Balkans - built solo as my bachelor's thesis and tested with the people it was built for.
year: '2026'
role: Solo - research, design, full-stack development, testing
context: BSc thesis, International Burch University
categories: [AI, Full-stack, Web]
stack: [Python, FastAPI, MySQL, JavaScript, HTML, CSS, PyMuPDF, Google Cloud TTS (Chirp 3 HD), Playwright, pytest]
featured: 1
order: 1
highlights:
  - Tested with visually impaired users, who rated it simple and high quality
  - Section-aware PDF parsing, so you can jump by chapter instead of scrubbing audio
  - End-to-end tests with Playwright, backend tests with pytest
links:
  note: Repository is private for now - code walkthrough available on request.
todo:
  - Add the repo link once it is public, and ttstudy.app if you deploy it.
  - Add 1-2 numbers from your user testing if you have them (number of testers, task success).
  - Check that the 'Decisions & trade-offs' section matches your real reasoning.
---

## The problem

Most study material at universities in Bosnia and Herzegovina is shared as PDFs. Screen readers can read them, but they read *everything* the same way - headers, page numbers, footnotes - and the available voices for Bosnian, Croatian and Serbian often sound robotic. For a visually impaired student, an hour of reading can turn into an hour of fighting the tool.

## What I built

TTStudy takes a PDF, understands its structure, and turns it into audio a student can actually study with:

- **Structure-aware parsing** with PyMuPDF: the document is split into sections, so playback can jump to the previous or next section instead of scrubbing blindly.
- **Natural voice** through Google Cloud Text-to-Speech (Chirp 3 HD Croatian voice), the closest high-quality voice available for the region's languages.
- **Study controls**: play, pause, stop, playback speed, section navigation and bookmarks.
- **Accessibility first**: high-contrast mode and adjustable text size.

The frontend is plain HTML, CSS and JavaScript, so it stays fast and predictable with assistive technology. The backend is Python with FastAPI and MySQL.

## Decisions & trade-offs

- **No frontend framework.** For an accessibility tool, every extra layer between the markup and the screen reader is a risk. Vanilla JS kept the DOM simple and the behaviour predictable.
- **Cloud TTS over a local model.** At thesis scale, quality mattered more than cost or offline use. The trade-off - no native Bosnian voice - is exactly what my master's thesis will address.

## Testing

I tested the app with visually impaired testers, who described it as simple to use and high quality. Automated tests cover the backend with pytest and the main user flows end to end with Playwright.

## What's next

My master's thesis continues this work toward a native Bosnian text-to-speech system, with support for more document types and different levels of visual impairment.
