# mitchgardner.cv

Portfolio and resume site for Mitchell Gardner. Eleventy 3 and Nunjucks; the resume page and its PDFs are built from one JSON file.

## Run it
Needs Node.js 18 or newer, and Chrome or Edge for the PDFs.

```
npm install
npm start        # http://localhost:8080
npm run build    # _site/, plus the public resume PDF
npm run pdf      # _pdf/: one PDF per resume version, with the phone number from private.json
```

## Where things are
- `src/_data/resume.json`: the resume. Every bullet lists the versions it appears in.
- `src/projects/*.md`: case studies, in the same format as mtch.tech's projects.
- `docs/PLAN.md`: hosting, launch steps, and the move from mtch.tech.
