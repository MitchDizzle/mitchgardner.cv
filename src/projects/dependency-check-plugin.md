---
title: "A dependency check in 3,000+ builds"
date: 2022-10-01
description: "At Cerner I led a Maven plugin that checked every project's dependencies for known vulnerabilities and version conflicts before release. It ended up in 3,000+ projects."
category: Platform
keywords: [Java, Maven, security, CVE, Fortify, dependency management, build tooling]
featured: true
# Proofread before launch: written from resume notes. Add how it was rolled out (warn first? parent POM?) if you remember.
---

## The problem

Cerner had thousands of Java projects pulling in shared libraries. A vulnerable or conflicting dependency was usually found late: at release, or after it.

## What I built

I led development of a custom Maven plugin that ran as part of the build. It read each project's dependency tree and checked it against known vulnerabilities and against rules for version conflicts, before the project could be released. Running inside the Maven build meant the check happened where teams already worked, on every build, instead of in a separate review someone had to remember.

Alongside it I automated Fortify vulnerability scanning across 300+ libraries, with one consolidated report instead of one per library. Security could see everything in one place, and the manual work of triaging CVEs dropped by 70%.

## Results

The plugin was adopted across 3,000+ projects, and manual CVE triage fell by 70%.

## What I'd do today

I'd have each build produce a software bill of materials (an SBOM, for example in CycloneDX format) and check that against a vulnerability feed. The same file then serves security, licensing, and release checks, and it can be compared from one release to the next.
