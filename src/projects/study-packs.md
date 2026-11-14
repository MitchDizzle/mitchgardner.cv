---
title: "Study Packs: a flashcard app for certification study"
date: 2025-12-31
description: "An offline-first study app in Vue 3 with spaced repetition, three kinds of cards, and progress by exam domain, built to study for CompTIA Security+ and Network+."
category: Web
keywords: [Vue 3, Pinia, IndexedDB, Vite, spaced repetition, SM-2, offline-first, CompTIA Security+, Network+]
featured: false
github_url: "https://github.com/MitchDizzle/StudyGuideWebapp"
# If it goes up somewhere (it builds to plain files that work in any folder), add live_url.
# Still to add: a screenshot of the dashboard and a scenario card.
---

In December 2025, between Oracle and the cafe, I built a study app for the CompTIA Security+ and Network+ exams: typed answers instead of flipping cards, practice questions written like the exam's scenarios, and the cards I miss coming back sooner than the ones I know.

## What it does

- **Packs.** Each subject is a pack that can be switched on or off, with its own progress. It ships with a Security+ (SY0-701) pack covering all five exam domains and a Network+ (N10-008) pack.
- **Three kinds of cards.** Definition cards, where you type the answer instead of flipping; scenario cards, multiple choice with an explanation of the right answer; and drag-and-drop cards for matching and putting steps in order.
- **Spaced repetition.** After each card you pick when to see it again: this session, later today, tomorrow, or "know it". A version of the SM-2 algorithm tracks how easy each card is for you, so a card you know waits three days the first time and longer each time after.
- **Progress you can act on.** A dashboard shows cards due today, accuracy over the last 30 days, retention by exam domain, and your weakest topics, plus a daily goal, a streak, and a break reminder every 15 minutes.
- **Works offline.** Everything is stored in the browser (IndexedDB), and progress can be exported to a file and imported again.

## How it's built

Vue 3 with the Composition API, Pinia for state, Vue Router, and Vite. Routing uses the URL's hash, so the built app is plain files that run from any folder on any web host, with no server setup.

Cards are plain data files, one per exam domain, and a pack lists its domains, so the dashboard's domain breakdown comes straight from the pack. Adding a subject means adding a folder of data, not changing the app.

## Writing cards faster

Some of the card text was drafted with AI. Generating cards as JavaScript wasted most of the output on syntax, so I wrote a small converter between the card files and CSV: about 70% fewer tokens for the same cards, and a format that also opens in a spreadsheet for bulk edits. Every card still lands in the app as the same data file.

## What I took from it

- Writing a good scenario card means knowing why each wrong answer is wrong, so making the cards was study too.
- Content as data runs through most of what I build: the cafe's menus and the resume on this site work the same way.
- I'm studying for Security+ again now, on the newer SY0-801 exam, which is a good reason to update the pack.
