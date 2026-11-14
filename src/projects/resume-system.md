---
title: "A resume system: one file, every version, no leaks"
date: 2026-11-08
description: "The system behind this site's resume: one data file builds the web page and six PDF versions, checks each one's page count, and stops the deploy if anything private reaches the public build."
category: Web
keywords: [Eleventy, Nunjucks, JSON, headless Chrome, PDF, GitHub Actions, Python, Claude API, privacy]
featured: false
github_url: "https://github.com/MitchDizzle/mitchgardner.cv"
live_url: "https://mitchgardner.cv/resume/"
# github_url goes live when the repo is pushed (docs/PLAN.md, Go live, step 4).
---

A job search means a lot of resumes that are almost the same: one for platform roles, one for support, a two-page federal version for USAJOBS, and now and then one for a single posting. Kept as separate documents, they drift apart, a fixed typo stays broken in three others, and sooner or later a private detail ends up somewhere public. This site is built so that can't happen.

## One file, many versions

The whole resume lives in one JSON file. Every bullet lists the versions it prints in (platform, backend, product, support, admin, federal), and a bullet with an empty list waits in a bank until a posting calls for it. The web page at [/resume/](/resume/) and every PDF are built from that file, so a fix made once is fixed everywhere.

Two rules are checked on every build, before anything else runs:

- **No typos in the wiring.** A bullet naming a version that doesn't exist, or a skills group that isn't defined, stops the build. Otherwise the bullet would just quietly disappear from a resume.
- **Page limits.** Headless Chrome prints each version to PDF and counts the pages. Every version is one page except federal, which is allowed two. One that runs over stops with "TOO LONG" and says which. The fix is to move a bullet to the bank, never to shrink the type.

## Public and private builds

The public site and its PDF never have my phone number. The PDFs I attach to applications do. They come from the same file through a private build, which also reads three things that never go in git: the phone number, a few bullets with the cafe's own numbers (which the owners haven't cleared for the public site), and an optional one-off version for a single posting.

A leak check runs last on every public build. It looks for any phone number, a personal email address, the text of any private bullet, and local file paths. A hit fails the build, so the deploy never starts. It reports only the file and the kind of leak, never the text itself, because the deploy log of a public repo is public too.

Small things matter on a resume. Every version's PDF has the same title in its properties, so a recruiter never sees "Support" or "Tailored" in a file name or document title. The page's styles are inlined, so it prints correctly straight from disk.

## The first version

This replaced a resume tool I wrote in Python in January 2026: the resume in YAML, Jinja2 templates, WeasyPrint for the PDF, and a step that sent a job posting to the Claude API to pull out its requirements and suggest which bullets to lead with. The AI step is switched off in its last version; here, which bullets go in which version is decided by hand, in the data. What carried over was the core idea: the resume is data, and documents are built from it.

## Used twice

I set up the same system for a friend's resume site, [patrickclark.cv](https://patrickclark.cv). The difference: he isn't a developer, so he runs it himself with Claude Code. He drops a document in a private folder, and the project's written rules have Claude list in plain words what would appear on the public site and wait for his yes before anything is committed. His phone number and his posting-specific versions live in a separate private repo, so they can't end up in the public one.

## What I took from it

- If a mistake can be caught by a build, catch it there. A check that fails loudly beats a rule someone has to remember.
- A privacy check has to be careful about its own output. A leak report that prints the leak is a second leak.
