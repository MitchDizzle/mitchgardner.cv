---
title: "The Cafe: opening a restaurant to the public"
date: 2026-11-06
description: "Everything a Leavenworth restaurant needed to open to the public on October 5, 2026: the store's IT and point of sale, a kitchen order board, the website, staff training, and a spot at the front counter."
category: Software
keywords: [Node.js, Square API, kitchen display, point of sale, restaurant, small business IT, Google Workspace, staff training, Eleventy, GitHub Actions, headless Chrome, Google Apps Script, Python]
featured: true
order: 2
# On both sites: edit here, then `npm run sync -- --to-mtch` (or the other way).
shared: true
image: "/assets/img/projects/the-cafe/website.webp"
imageAlt: "The Cafe's home page: the script wordmark on a dark teal background, with Order Online, Menu & Specials, and Catering buttons and the hours below."
github_url: "https://github.com/MitchDizzle/TheCafeSite"
live_url: "https://lvcafetogo.com"
# When the game entry is public, link it from "Both sides of the counter".
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

The website is the part people see, and it's the smallest part. The job is:

- **The store's IT**: internet, the point of sale, the kitchen PC, email and calendars.
- **The kitchen board**: the program that shows every order to the cooks and talks back to Square. It has [its own write-up](/projects/kitchen-board/).
- **The website and print**: menus, signs, and posts, all from one set of data.
- **The people**: training the staff, writing their routine sheet, and working the counter myself.
- **The cafe's Facebook page and catering**, with the owners.

## What it had to do

When the meal contract ended in September, the cafe had to open to the public in October, and that date couldn't move. The staff are cooks and counter staff, the software budget was close to nothing, and the building gets the occasional power flicker. Everything had to work for them, on those terms.

## Rent before you build

The first plan was a custom web application on a VPS: customer accounts, a cart, an admin panel. I costed it against Square Online and dropped it. Square Online's free plan costs nothing a month. Its card fee is a little higher than a custom checkout's, which at the volume we expected came to a few dollars a month. A custom cart would have been mine to host, patch, and keep running. I also ruled out a server in the store: no fixed IP, no inbound HTTPS, and a power flicker would take online ordering down with it.

So the business runs on Square: POS at the counter, Square Online for pickups, and DoorDash through Square. The website is static and links to the ordering site. The custom path is written down for later, if the volume ever justifies it.

## Setting up the store

Before any software, the store needed the basics, and I set them up: 5G business internet, the Square POS at the counter, and the mini PC behind the kitchen's wall screen. That PC signs into Windows by itself at power-on and opens the kitchen board, so each morning the cooks press one button and nothing else.

I help run the cafe's Google Workspace, where its email and catering requests come in, and I'm moving catering appointments into Google Calendar with each client's details, so the owners have one place to look.

## The kitchen board

Once the doors opened, the kitchen needed to see orders from the counter, online, and DoorDash in one place. Square's kitchen display and DoorDash's tablet would have cost about $100 a month, so I wrote a board instead: a Node.js program on a mini PC behind the kitchen's wall screen that reads orders from Square, shows them as tickets the cooks clear from a number pad, and marks them Ready in Square, which texts the customer. The kitchen printer never stopped printing, so if the board is ever off, nothing is lost. How it works, and the plan to make it its own project, is in [A kitchen order board for Square](/projects/kitchen-board/).

## The website

[lvcafetogo.com](https://lvcafetogo.com) is built with Eleventy 3 and Nunjucks and served as static files from Apache shared hosting. It has the menu with today's special at the top, catering packages, table reservations, a customer survey, a page that publishes what customers said (good and bad), a gallery, and an unlisted menu board sized for the 1920×1080 TV in the dining room. GitHub Actions builds and uploads it on every push to `main`. Work happens on a `dev` branch first.

The customers skew older, so the type is large, the wording is plain, and the phone number is never far away.

Reservations post to a Google Apps Script that keeps a Google Sheet, emails the cafe and the customer, and passes the request to the kitchen PC.

## Menus, signs, and posts from one set of data

The menu lives in one JSON file and the specials in another. The same files build the website menu, the TV board, the printed menus, the counter signs, the weekly Facebook post, and the import file for Square's catalog (a small Python script). There are 39 printed and social pieces, rendered as web pages and exported to PNG and PDF with headless Chrome during the build. A piece nobody has touched in two weeks archives itself, dated from git history.

## Both sides of the counter

During service I'm usually at the register: taking orders in person and on the phone, ringing one in while the next customer is already talking, handing bags to DoorDash drivers, and telling people how long their food will be. That's where most of the fixes came from. When a ticket shows up late or in the wrong place, I'm the one standing there with the customer, so it gets fixed that afternoon.

It also changed what I built. The front counter got its own screen with the same orders as the kitchen, a button to send a DoorDash order to the cooks early, and a practice mode with demo orders for training new staff.

I trained the staff on the POS and the board, and wrote the counter's daily routine and troubleshooting sheet, so a normal day doesn't depend on me being the one who knows how it works.

I also run the cafe's Facebook page. The day's special goes to the Facebook Story every service day, and Photo post, a tool on the kitchen PC's front page, makes that a one-minute job: take a photo on the phone, and it already knows the special, draws the branded picture with the hours and phone number, and writes the caption. Questions and comments come in at all hours. Every reply is public, so each one is written for everyone reading.

On the catering side I help Dalton, who runs the cafe's event catering. His guide became data that prints the folded catering menu he hands out, and the website has a catering request form. Next is a catering calendar the owners keep in their own Google Calendar, so the website can show which days are open.

## Results and lessons

The cafe opened to the public on schedule, and every kitchen order, from the counter, online, and DoorDash, goes across the board. It added no new monthly infrastructure cost: ordering is on Square's free plan and the site stays on hosting the cafe already had.

By November the board had settled. What's left is about people, not software: how the team runs the counter and the kitchen with and without particular people on shift.

The lesson I keep coming back to: decide from how the business actually runs (who's working, what hours, how much money, whether the power stays on), then pick the technology. The one custom system I did build fails safe. If the board is ever off, the kitchen printer still prints.

## Media

{% projectGallery %}
