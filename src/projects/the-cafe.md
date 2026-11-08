---
title: "The Cafe: website, ordering, and kitchen board"
date: 2026-11-06
description: "The website, Square ordering, and kitchen order display a Leavenworth restaurant opened with on October 5, 2026, and still runs every service."
category: Software
keywords: [Eleventy, Node.js, Square API, kitchen display, restaurant, point of sale, GitHub Actions, headless Chrome, Google Apps Script, Python]
featured: true
image: "/assets/img/projects/the-cafe/website.webp"
imageAlt: "The Cafe's home page: the script wordmark on a dark teal background, with Order Online, Menu & Specials, and Catering buttons and the hours below."
github_url: "https://github.com/MitchDizzle/TheCafeSite"
live_url: "https://lvcafetogo.com"
# Still to add: a photo or screenshot of the kitchen board (kitchen/start-dev.bat runs it on demo orders).
gallery:
  - src: "/assets/img/projects/the-cafe/website.webp"
    alt: "The Cafe's home page: the script wordmark on a dark teal background, with Order Online, Menu & Specials, and Catering buttons and the hours below."
    caption: "The home page. Order Online goes to the cafe's Square Online pickup site."
    width: 1440
    height: 1000
  - src: "/assets/img/projects/the-cafe/menu-page.webp"
    alt: "The menu page, opening with today's lunch special and soup, and next week's specials in a table below."
    caption: "The menu opens with today's special, picked on Central time in the browser, and next week's plates. A special that has passed never shows."
    width: 1440
    height: 1000
  - src: "/assets/img/projects/the-cafe/weekly-post.webp"
    alt: "A Facebook post listing the lunch specials for November 9 to 13, with Wednesday marked closed for Veterans Day, the soups, and the sides."
    caption: "The weekly Facebook post, built from the same specials file as the website. The closed day comes from the site's holiday list."
    width: 1080
    height: 1350
---

The Cafe is a breakfast, lunch, and catering restaurant in Leavenworth, Kansas. In 2026 it moved from cooking for a contract meal program to serving the public: a counter, online pickup orders, and DoorDash. I joined in February 2026. I'm its only engineer, and during service I'm usually at the front counter taking orders. It opened to retail customers on October 5, 2026, on the systems below, and they run every service.

## What it had to do

When the meal contract ended in September, the cafe had to open to the public in October, and that date couldn't move. The staff are cooks and counter staff, the software budget was close to nothing, and the building gets the occasional power flicker. Everything had to work for them, on those terms.

## Rent before you build

The first plan was a custom web application on a VPS: customer accounts, a cart, an admin panel. I costed it against Square Online and dropped it. Square Online's free plan costs nothing a month. Its card fee is a little higher than a custom checkout's, which at the volume we expected came to a few dollars a month. A custom cart would have been mine to host, patch, and keep running. I also ruled out a server in the store: no fixed IP, no inbound HTTPS, and a power flicker would take online ordering down with it.

So the business runs on Square: POS at the counter, Square Online for pickups, and DoorDash through Square. The website is static and links to the ordering site. The custom path is written down for later, if the volume ever justifies it.

## The website

[lvcafetogo.com](https://lvcafetogo.com) is built with Eleventy 3 and Nunjucks and served as static files from Apache shared hosting. It has the menu with today's special at the top, catering packages, table reservations, a customer survey, a page that publishes what customers said (good and bad), a gallery, and an unlisted menu board sized for the 1920×1080 TV in the dining room. GitHub Actions builds and uploads it on every push to `main`. Work happens on a `dev` branch first.

The customers skew older, so the type is large, the wording is plain, and the phone number is never far away.

Reservations post to a Google Apps Script that keeps a Google Sheet, emails the cafe and the customer, and passes the request to the kitchen PC.

## The kitchen board

Once the doors opened, the kitchen needed to see orders from the counter, online, and DoorDash in one place. Square's own kitchen display needs a paid Square plan plus $30 a month for each screen, on an Android tablet, and DoorDash rents its order tablet for $6 a week. I wrote a board instead and had DoorDash orders come in through Square, so the cafe pays for neither. (Prices from Square's and DoorDash's US pages in November 2026.)

It's a Node.js program with no dependencies, running on a mini PC behind a wall screen. During kitchen hours it polls the Square Orders API every five seconds (every five minutes overnight) and shows each order as a ticket. Cooks work it from a number pad: 1 to 9 clears a ticket, 0 brings the last one back. Colors mean time and nothing else, and a new order flashes mint so new never looks like late. A chime means a new order. A low tone and a red banner mean the board has lost Square, and the kitchen printer, which never stopped printing, is the backup.

It also talks back. When a cook clears an online or DoorDash order, the board waits ten seconds in case it was a mistake, then marks the order Ready in Square, which texts the customer or tells DoorDash. When the counter hands an order over, the board marks it picked up and closes it. Its writes to Square carry idempotency keys, and it retries a minute later if Square refuses.

Online orders reach the cooks based on how long orders of that size have taken over the last eight weeks (the median, plus five minutes), so a ten-sandwich order starts early and a coffee doesn't sit. DoorDash deliveries wait until a driver has taken them, or fifteen minutes at most. Each morning the board reads the day's specials from the website and puts that day's plate and soup into Square, so online ordering always shows the right special.

The PC updates itself from the `main` branch when it starts, backs its data up to a private GitHub repository during the day, and turns itself off at 9pm.

## Menus, signs, and posts from one set of data

The menu lives in one JSON file and the specials in another. The same files build the website menu, the TV board, the printed menus, the counter signs, the weekly Facebook post, and the import file for Square's catalog (a small Python script). There are 39 printed and social pieces, rendered as web pages and exported to PNG and PDF with headless Chrome during the build. A piece nobody has touched in two weeks archives itself, dated from git history.

## What the kitchen taught me

Most of the work came from watching service, not from the API documentation:

- On a restaurant POS, a counter order is marked completed the moment it's paid. The board can't go by Square's status for those, so they stay up until a cook clears them.
- Square keeps the first 30 characters of a ticket name. Phone orders put the pickup time first ("11:30 Sue"), and the board reads it.
- Not every DoorDash order is a delivery. One pickup waited fifteen minutes for a driver who was never coming while the customer stood at the counter. The board now checks where each order came from, and the counter has a Send to kitchen now button for anything it's holding.
- Square doesn't close a picked-up order by itself, and those open orders were missing from the sales reports until the board started closing them.

Each of these is written into the board's README with the date it changed, so whoever looks after it next doesn't have to learn it again.

## Both sides of the counter

During service I'm usually at the register: taking orders in person and on the phone, ringing one in while the next customer is already talking, handing bags to DoorDash drivers, and telling people how long their food will be. That's where most of the fixes came from. When a ticket shows up late or in the wrong place, I'm the one standing there with the customer, so it gets fixed that afternoon.

It also changed what I built. The front counter got its own screen with the same orders as the kitchen, a button to send a DoorDash order to the cooks early, and a practice mode with demo orders for training new staff.

I also run the cafe's Facebook page. The day's special goes to the Facebook Story every service day, and Photo post, a tool on the kitchen PC's front page, makes that a one-minute job: take a photo on the phone, and it already knows the special, draws the branded picture with the hours and phone number, and writes the caption. Questions and comments come in at all hours. Every reply is public, so each one is written for everyone reading.

On the catering side I help Dalton, who runs the cafe's event catering. His guide became data that prints the folded catering menu he hands out, and the website has a catering request form. Next is a catering calendar the owners keep in their own Google Calendar, so the website can show which days are open.

## Results and lessons

The cafe opened to the public on schedule, and every kitchen order, from the counter, online, and DoorDash, goes across the board. It added no new monthly infrastructure cost: ordering is on Square's free plan and the site stays on hosting the cafe already had.

By November the board had settled. What's left is about people, not software: how the team runs the counter and the kitchen with and without particular people on shift.

The lesson I keep coming back to: decide from how the business actually runs (who's working, what hours, how much money, whether the power stays on), then pick the technology. The one custom system I did build fails safe. If the board is ever off, the kitchen printer still prints.

## Media

{% projectGallery %}
