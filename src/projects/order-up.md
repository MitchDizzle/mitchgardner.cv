---
title: "Order Up: a phone game for The Cafe"
date: 2026-11-13
description: "A short-order cook's week at The Cafe, played in a phone browser one shift at a time: a small roguelite built from the restaurant's real menu, tuned by a stand-in player."
category: Gaming
keywords: [JavaScript, game design, Web Audio, SVG, localStorage, Google Apps Script, balance testing, Eleventy]
featured: false
# On both sites: edit here, then `npm run sync -- --to-mtch` (or the other way).
shared: true
# Draft until Terry and Dalton say go (CafeWork TASKS.md, GM-1) and the name is settled
# (CafeWork GAME-NAME-AND-VIDEO.md). A draft builds no page. When it's cleared:
#   remove `draft`, add a live_url (https://lvcafetogo.com/play), add screenshots to a
#   gallery, link this from the-cafe.md, then `npm run sync -- --to-mtch`.
# If the name changes, rename this file too (the slug is the address).
draft: true
---

Order Up is a small phone game I made for The Cafe, the Leavenworth restaurant where I'm the only engineer. You're on the flat-top for a week: tickets come in on the rail, food goes on the griddle, and you send each plate before the ticket goes late. It runs in the phone's browser on the cafe's own website, with nothing to install. The idea was something a customer could tap through while waiting for an order, that feels like this kitchen and no other.

It's separate from the systems that run the restaurant. Those are written up in [The Cafe](/projects/the-cafe/).

## Built from the real kitchen

Everything in the game is something a customer has seen or eaten there. The tickets sit on a rail like the ones on the kitchen board I wrote. Breakfast runs until 11, then lunch and the day's special. Nearly every real plate comes with a pickle spear, so in the game any lunch plate can take one for a dollar more. The shift is 6am to 2pm, there are no weekends because the cafe is closed then, and Friday ends on a catering order, because the cafe caters too.

## How it plays

- **A run is one week**, Monday to Friday, and each day is one shift of about 100 seconds.
- **Three coffees are your lives.** A ticket that runs out of time is a walk-out and spills one. Spill all three in a day and the week is over.
- **After close**, you pick one item for free out of three, then spend the day's tips on more. Items have a rarity, and the odds move toward the better ones as the week goes on.
- **Three levels**: Easy, Regular, and Rush. On Regular, eggs and burgers stop cooking half way until you flip them; on Rush, the flip is a swipe.
- **Ten achievements**, kept on the phone. Most of them unlock an item that's never dealt until you earn it, so a new player starts with a smaller set and it grows as they get better.
- **The score is the tips you keep**: what you earned, less what you spent. Buying your way through a week helps you finish it, but the best score is a week won with little help.

## How it's built

It's plain JavaScript, HTML, and CSS, with no game engine, built into the cafe's existing Eleventy site. The drawings are one SVG sprite sheet. The music is made in the browser while you play, with the Web Audio API, so there are no audio files to download. Your saves and achievements stay on your phone. There are no accounts and no cookies.

Every number worth tuning lives in one data file: the foods, the tickets, the 15 specials, the 29 items, their odds and prices, and how hard each day gets on each level. The build checks that file against the cafe's real menu and warns if a ticket names a dish that's no longer on it.

I built it with Claude Code, working from a written design guide (the run, the items, the art, the words on every screen) that every change is checked against.

## Testing the balance with a stand-in player

A game like this is easy to make too hard or too easy, and playing whole weeks by hand after every change is slow. So I wrote a stand-in player: a script that plays complete weeks the way a fair person would, one thing at a time, most urgent ticket first. You give it a speed (taps a minute) and how often it hesitates or mis-taps, and it reports the day each week ended, the tips per day, the walk-outs, and what it bought. It runs a week in a second or two. After a change to the numbers, I run it on all three levels before anyone plays it.

## Scores, without tracking people

The next step is keeping scores, so the cafe can see how many people play and who had the best week. That part is built but not live yet. The game sends small anonymous notes as a week goes (a score, a level, and a random number for the phone, never a name) to a Google Sheet through Google Apps Script. A player's name goes in only if they choose to send it, after a finished week.

A game that runs on the player's phone can't be made cheat-proof: anyone can read its code and send whatever numbers they like. So the goal is numbers the cafe can trust, not an unbreakable lock. The notes are signed, impossible scores are set aside, and how the doubtful ones are caught is kept out of the public code on purpose. While there's no prize, there's little reason to cheat.

## Where it stands

The game is live on the cafe's site but unlisted: no link to it, and hidden from search. Before it's announced, the owners decide on the name and give the go-ahead, and it gets played on real phones by people other than me.

## What I took from it

- A stand-in player turned balance from a feeling into a number I could check after every change.
- Putting every tunable number in one data file meant most changes were edits to that file, not the code.
- Being honest about the limits up front (what a browser game can and can't stop) made the design simpler, not weaker.
