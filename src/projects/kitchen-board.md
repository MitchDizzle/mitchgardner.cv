---
title: "A kitchen order board for Square"
date: 2026-10-05
description: "The kitchen display a restaurant has run every service since it opened: dependency-free Node.js on a mini PC, reading and writing Square orders, with the kitchen printer as its fallback. Next: its own repo, for any Square business."
category: Software
keywords: [Node.js, Square API, kitchen display, point of sale, polling, idempotency, Windows, testing, product design]
featured: true
order: 1
# On both sites: edit here, then `npm run sync -- --to-mtch` (or the other way).
shared: true
github_url: "https://github.com/MitchDizzle/TheCafeSite/tree/main/kitchen"
# Still to add: screenshots of the board and the front page in practice mode
# (TheCafeSite: kitchen/start-dev.bat). When it has its own repo, change github_url.
---

The Cafe, the Leavenworth restaurant where I'm the only engineer, opened to the public on October 5, 2026. Every order since, from the counter, online, and DoorDash, has gone across this board. It's the one piece of custom software the business runs on, so it's written up here on its own. The rest of the job is in [The Cafe](/projects/the-cafe/).

## Why build one

The kitchen needed to see orders from all three places on one screen. Square's own kitchen display needs a paid Square plan plus $30 a month for each screen, on an Android tablet, and DoorDash rents its order tablet for $6 a week. I wrote a board instead and had DoorDash orders come in through Square, so the cafe pays for neither: about $100 a month. (Prices from Square's and DoorDash's US pages in November 2026.)

## What it does

It's a Node.js program with no npm packages, running on a mini PC behind the kitchen's wall screen. During kitchen hours it polls the Square Orders API every five seconds (every five minutes overnight) and shows each order as a big ticket.

- **Made for the cooks.** They work it from a number pad: 1 to 9 clears a ticket, 0 brings the last one back. Colors mean time and nothing else, and a new order flashes mint so new never looks like late. A chime means a new order.
- **It talks back to Square.** When a cook clears an online or DoorDash order, the board waits ten seconds in case it was a mistake, then marks it Ready, which texts the customer or tells DoorDash. When the counter hands an order over, the board marks it picked up and closes it. Every write carries an idempotency key, and it tries again a minute later if Square refuses.
- **It times the kitchen.** An online order reaches the cooks based on how long orders its size have taken over the last eight weeks (the median, plus five minutes), so a ten-sandwich order starts early and a coffee doesn't sit. DoorDash deliveries wait until a driver has taken them, or fifteen minutes at most.
- **A screen for the counter.** Any phone or laptop on the cafe's wifi can open the front page: the same orders, a button to send a held order to the kitchen now, a PIN-protected Manage menu for the day's specials, desserts, reservations, and signs, and a report of how the day is going that the owners can check from their phones.
- **Practice mode.** Demo orders on both screens, for training new staff without touching real ones.
- **It keeps itself running.** Windows signs in and starts it at power-on, so the cooks only press the power button. It updates itself from the main branch when it starts, backs its data up to a private GitHub repository during the day, reopens itself if the screen gets closed by accident, and turns the PC off at 9pm.

## Fails safe

The board is never the only copy of an order. The kitchen printer, which never stopped printing, is the backup. If the board loses Square, it plays a low tone and shows a red banner so the cooks know to go by the printer. A `/check` page lists every order Square sent on the last check and, for each one, why it is or isn't on the board.

## What the kitchen taught me

Most of the work came from watching service, not from the API documentation:

- On a restaurant POS, a counter order is marked completed the moment it's paid. The board can't go by Square's status for those, so they stay up until a cook clears them.
- Square keeps the first 30 characters of a ticket name. Phone orders put the pickup time first ("11:30 Sue"), and the board reads it.
- Not every DoorDash order is a delivery. One pickup waited fifteen minutes for a driver who was never coming while the customer stood at the counter. The board now checks where each order came from, and the counter has a Send to kitchen now button for anything it's holding.
- Square doesn't close a picked-up order by itself, and those open orders were missing from the sales reports until the board started closing them.

Each one is written into the board's README with the date it changed, so whoever looks after it next doesn't have to learn it again.

## How it's built

About 12,500 lines of JavaScript in 68 files, with 161 tests on Node's built-in test runner. There are no npm packages on purpose: the kitchen PC updates with a plain `git pull` and nothing to install, so an update has no step that can fail halfway. Every setting has a built-in default, so the PC's own settings file needs little more than the Square token. If a line in that file pins a setting so updates can't improve it, the board says so when it starts.

## Next: its own repo

Today the board lives in a folder of the cafe's website repo. The goal is a project of its own, "a kitchen board for Square", that still runs The Cafe and could run any Square business with a screen and wifi.

Most of the way is already there. I copied the folder alone into an empty directory: the board, the counter page, and the reports all came up in practice mode, and the only tests that failed were the ones that read the website's files. The plan:

1. **Tidy the seams in place.** One file becomes the only door to the website, the website publishes a small feed with what the board needs (phone, hours, survey questions, photos), and The Cafe's names come out of the code into settings. Each step ships to the kitchen PC like any other update.
2. **Move it, history and all**, then switch the kitchen PC to the new repo on an afternoon after close, with the printer as the fallback.
3. **Make it work for anyone.** The Cafe becomes the first example, not the default. A new install only reads from Square until someone switches on each write. It reads what Square already knows (name, time zone, hours) and asks only for the rest. One list of settings generates the README table, the setup page, and the startup check, so the documentation can't drift from the code.

The part worth keeping isn't the screen. It's everything the board knows about how Square's restaurant POS and DoorDash really behave, learned one lunch rush at a time.
