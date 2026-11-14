# mitchgardner.cv plan

## What it is
- **mitchgardner.cv**: the professional site. Resume, case studies, contact. The address that goes on resumes and LinkedIn.
- **mtch.tech** stays the gaming and hobby site (Mitchtopia: game projects, stream overlays, the game prototype). The new site links to it once, in the footer.

## Status (2026-11-06)
- Built and checked locally: home, /projects/ with four case studies, /resume/ (plus unlisted /resume/backend/, /product/, /support/, /federal/), 404, sitemap, robots.txt.
- `npm run build` and `npm run pdf` both work. Platform, backend, product, and support PDFs are one page each; federal is two (USAJOBS's limit). The public PDF has no phone number and none of the cafe's own numbers.
- A one-off version for a single posting comes from tailor.json (see tailor.example.json); CareerWork's applications/PIPELINE.md says when to use it.
- `git init` done, nothing committed, no GitHub repo yet. Not deployed.
- Entries on both sites have `shared: true` in front matter. `npm run sync` says which differ; `-- --to-mtch` or `-- --from-mtch` copies them (and their image folders). Each site still builds and deploys from its own repo. Shared now: the-cafe, order-up (a draft until the owners clear the game).

## Before launch
- [ ] Fill the blanks: the apprenticeship's hours per week (`hours` on that role in resume.json, for the federal version), and ask the owners about the cafe's numbers (they print only on the PDFs you send now, never on the site).
- [ ] Read every page on your phone. The three Oracle and Cerner case studies were written from resume notes: each has a comment in its front matter saying what to add. Change anything that isn't how you'd say it.
- [ ] `npm run pdf`, open all three PDFs, check each is one page and reads right.
- [ ] No phone number, sales numbers, or order counts anywhere in src/.
- [ ] Cafe blanks only you can fill (FACTS.md marks them [fill] or check). Each one, once written down, can become a resume bullet or a line in the-cafe.md:
  - Local outreach: who you reached out to (businesses, catering leads), how, and what came of it.
  - Catering work beyond the guide and form: quotes, calls, deliveries, setups.
  - Facebook Story views: a real week of numbers from Meta Business Suite before "hundreds a day" goes anywhere public (today it prints only on the PDFs you send).
  - Your handover plan, for "who keeps it running when you go?"
- [ ] Security+ (SY0-801) shows as "in progress, exam expected December 2026" on the home page and every resume (your call, 2026-11-08). The day you pass, change the line in resume.json's `certifications` and in src/index.njk to the pass month, and update CareerWork/FACTS.md and LinkedIn. If the exam slips past December, change the month the same day.
- [ ] Optional: a photo or screenshot of the kitchen board for the cafe case study. In TheCafeSite, the "kitchen-mock" preview (or kitchen/start-dev.bat) runs it on demo orders. Add it to the `gallery` in both copies of the-cafe.md.

## Go live
Mirrors how lvcafetogo.com is hosted: an added domain on the existing NFO shared hosting, deployed by GitHub Actions over FTP.
1. NFO control panel: add mitchgardner.cv as a domain with its own folder, the same way lvcafetogo.com was added. Note the folder path.
2. At the registrar where you bought mitchgardner.cv: point DNS at NFO (copy whatever lvcafetogo.com uses: nameservers or an A record).
3. HTTPS: set up the certificate for mitchgardner.cv the same way as for lvcafetogo.com. Done: the host sends http to https itself, and src/.htaccess sends www to the bare domain, hides dotfiles (the FTP deploy's sync-state file), and sets the security headers.
4. GitHub: create a public repo named mitchgardner.cv. In Settings, Secrets and variables, Actions, add FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, and FTP_SERVER_DIR (the folder from step 1). TheCafeSite has the same four.
5. Commit and push to main. The Action builds the site and the public PDF and uploads them.
6. Check: the home page, /resume/, /Mitchell_Gardner_Resume.pdf, a missing page (should show the 404), and that the phone number appears nowhere. The deploy's last step, "Check the live site", now checks the first three plus the www redirect and the hidden sync-state file after every upload.
7. Then: LinkedIn (Contact info and Featured), GitHub profile README, email signature. See CareerWork/profiles/.

Email: the site and every PDF use contact@mitchgardner.cv, which forwards to Mitch's personal inbox. Only that one address exists; catch-all stays off so guessed addresses (info@, admin@) bounce. Test the forward before pushing any change to `email` in resume.json.

## Moving professional work off mtch.tech
- Moves (or is shared): The Cafe entry. Any future work write-up goes here, in the same format, so it can also live on mtch.tech if you want it there.
- Stays on mtch.tech: Sandbox Build, MatM, the mtch.tech project itself, overlays, stream control, /play.
- After launch, in mtch.tech:
  - src/_data/site.json `profiles`: add a "Portfolio" entry for https://mitchgardner.cv (footer and contact page build from that list).
  - If the cafe entry should live only here: delete src/projects/the-cafe.md there and add `Redirect 301 /projects/the-cafe/ https://mitchgardner.cv/projects/the-cafe/` to its src/.htaccess. Keeping it on both is also fine.

## Working on both sites
- One editor: open mitch-sites.code-workspace (this repo and ../mtch.tech side by side).
- A project for both: write it in either repo with `shared: true`, then `npm run sync -- --to-mtch` (or `--from-mtch` from here). Commit and push each repo on its own; each one's push to main deploys only that site.
- `draft: true` keeps an entry off this site entirely (no page, no list, no sitemap) and out of the sync, so a write-up can wait for an OK.
- Order Up (the cafe's phone game) is its own entry so the game work is logged apart from the restaurant's systems. When the owners say go: remove `draft`, add `live_url` and screenshots, link it from the-cafe.md, sync.

## Later, only if there's new material
The vault's warning holds: polishing a personal site feels like career work and mostly isn't. Make it good enough, then apply. Things worth adding only when they exist:
- A kitchen board deep dive with real screenshots.
- A short "How I work" page from the WebsitePlaybook principles, if that repo goes public.
- A write-up of the next real project.

## Decisions
- 2026-11-06: separate professional site on mitchgardner.cv; mtch.tech stays hobby and gaming.
- 2026-11-06: Eleventy 3 and Nunjucks, same as the other two sites; NFO shared hosting and GitHub Actions FTP deploy, same as TheCafeSite.
- 2026-11-06: resume.json is the resume's one source, with three versions picked per bullet; PDFs printed by headless Chrome (the cafe's /studio/ export method); the phone number only in the gitignored private.json.
- 2026-11-06: project files share mtch.tech's front matter and shortcodes so they move between the sites unchanged.
- 2026-11-08: Security+ is listed as in progress on the site and resumes, replacing CareerWork's earlier "no cert until you pass" rule. It sits under the Education heading so it costs one line.
- 2026-11-14: shared entries sync between the two repos by script (`npm run sync`), not a submodule or shared package, so each site's deploy stays exactly as it is. The cafe's game is the exception to "game projects stay off": it's work for the cafe, so it gets its own entry here.
- 2026-11-06: game projects stay off this site except one footer link; the SourcePawn line is in resume.json's bank (`for: []`) if a role makes it worth adding.
