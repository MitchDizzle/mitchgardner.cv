---
title: "Websites for local businesses, and the playbook behind them"
date: 2026-10-19
description: "Sites for a local appliance and HVAC shop, a young professionals group, and a friend's resume, built so the owners run them, plus the written method they all follow."
category: Web
keywords: [Eleventy, Nunjucks, static sites, Cloudflare Pages, Apache, Pages CMS, Sveltia CMS, Cal.com, Formspree, handoff, accessibility]
featured: false
live_url: "https://patrickclark.cv"
# Draft until both are settled (a draft builds no page):
#   1. Each owner's OK to be named here: Legacy Home Services, NextGen (its board), Patrick Clark.
#   2. Paid or not (CareerWork FACTS.md, "Communication"): if none were paid, keep
#      "for friends and local businesses" and never call it freelance.
# Legacy and NextGen are private repos and not live: no links to them until they are.
draft: true
---

Alongside the cafe, I build websites for people around Leavenworth. Each one is small. What they share is the rule I hold all of them to: the owner has to be able to run it without calling me.

## The sites

- **Legacy Home Services**, an appliance, HVAC, and refrigeration shop in Leavenworth. Built, not launched yet. The plan is a site the owner keeps up from a phone: a one-screen home page with Book a Visit, Shop Appliances, Call, and Text, a status line that says whether the shop is open right now, home-visit booking through Cal.com, and the appliances for sale in a list the owner edits by phone through Pages CMS, signed in by email invite, with no GitHub account. Hosting is Cloudflare Pages on the free plan, so the running cost is the domain, about $10 to $15 a year.
- **NextGen**, a young professionals group in the Leavenworth and Lansing area. Built in September 2026. Events, a blog, sponsors, and board members are each a folder of short files, so adding an event never needs a template change, and Sveltia CMS is set up so the group's board can do it from a web page instead of the code.
- **patrickclark.cv**, a friend's resume site. He isn't a web developer, so it's set up for him to run with Claude Code under written project rules: he drops in a document, and nothing from it goes public until he's said yes to a plain-words list of what will appear. It uses the same resume system as this site.

All three are static Eleventy sites, the same stack as the cafe's site and this one, with nothing on a server to patch.

## Before any code: the questions

Each project starts with a list of questions for the owner, and each answer changes something on the site: what the business needs on day one, which accounts it already has, how customers should reach it, and what it should look like. Before quoting, there's the payback math: how many months of new work it takes for the site to pay for itself.

## The owner owns the accounts

Every account a site runs on is in the business's name: the domain, the hosting, the code, the Google listing, the booking page, the form service. My access is as a member they can remove. Each site gets a handoff document listing every account, who signed up for it, where the two-factor codes go, what it costs, and the owner's short upkeep list, plus what happens if I'm not around. Passwords are never written in it.

## Domains and hosting

I register and renew six domains, for my own sites and for friends. The sites I host run on Apache shared hosting with HTTPS from the host. I set the redirects, the hidden files, and the security headers in each site's `.htaccess` myself.

## The playbook

What I've learned on these sites is written down in a short playbook, each principle with the reason behind it:

- **Rent before you build.** Use hosted tools first. Build only what nothing off the shelf does, and make that part fail safe.
- **One source for content.** Prices, menus, hours, and specials live in one data file that builds the site, the signs, the posts, and the register import.
- **The owner owns the accounts**, as above.
- **Readable for everyone.** Type, wording, and contrast for older customers and busy kitchens.
- **A launch checklist.** Search and sharing tags, caching, what's public, photos of people, review rules, and forms.

The cafe is its first case study: hosted ordering instead of a custom cart, one data source, and a kitchen screen that fails safe.
