# mitchgardner.cv

Portfolio and resume site for Mitchell Gardner. Eleventy 3 and Nunjucks; the resume page and its PDFs are built from one JSON file.

## Run it
Needs Node.js 22 (what the deploy uses; 18 or newer works), and Chrome or Edge for the PDFs.

```
npm install
npm start        # http://localhost:8080
npm run build    # _site/, plus the public resume PDF, then the leak check
npm run pdf      # _pdf/: one PDF per resume version, with the phone number from private.json
```

## Where things are
- `src/_data/resume.json`: the resume. Every bullet lists the versions it appears in.
- `src/projects/*.md`: case studies, in the same format as mtch.tech's projects.
- `scripts/check-resume.js`: runs before every build; a typo in resume.json (an unknown version in `for`, a missing skills group) stops it.
- `scripts/leak-check.js`: runs at the end of `npm run build`; a phone number, Gmail address, private bullet, or local path in `_site/` fails the build, so nothing deploys.
- `docs/PLAN.md`: hosting, launch steps, and the move from mtch.tech.
