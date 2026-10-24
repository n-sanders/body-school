# Body School

A middle-school course on human anatomy and physiology, built on the StudyKit skeleton. Learners move through seven units, from cells and tissues to the way organ systems work together. Reproductive systems are intentionally left out.

The site includes:

- a **curriculum** of 21 lessons, unlocked one after another by prerequisites
- **lesson quizzes** with a pass mark
- a **catalog** of major organs and structures, with unlabeled diagrams for recognition questions
- **Practice** and **Review** (Leitner spaced repetition) over the catalog and the text questions
- progress stored only in this browser

The planning notes that started the course are in `README-starting-point.md`, `proposed-curriculum.yaml`, and `Unit-1-Plan.txt` through `Unit-7-Plan.txt`.

## Running it

```sh
npm install
npm run dev          # http://localhost:5173
npm run build        # static site in dist/
npm test             # unit tests
npm run validate     # check content, including source URLs
npm run validate:offline
npm run audit        # write docs/audit/content-report.md
npm run deploy       # build and deploy to Cloudflare
```

Regenerate the original diagrams with `python scripts/make-body-images.py`. Download the open-licensed reference figures with `python scripts/download-sourced-images.py`. Credits for every figure are in `IMAGE_CREDITS.md`.

## Content layout

```
content/curriculum.yaml          seven units and the lesson order
content/items/<slug>.yaml        one catalog file per organ or structure
content/lessons/<id>.md          YAML frontmatter plus the lesson text
public/images/organs/            unlabeled diagrams used for recognition
public/images/lessons/           labeled lesson diagrams and sourced figures
```

Progress is stored under `body-school.progress.v2`.
