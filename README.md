# Body School

A middle-school foundation in how the human body is organized and how its major systems work, for learners around 11–13. Each lesson takes about 10 minutes: read a short explanation, notice the activity ideas, and answer five concept questions. A score of 80% or more unlocks the next lesson.

The course has nine lessons:

1. **Cells, tissues, organs, and systems** — how cells form tissues, tissues form organs, and organs form systems.
2. **Bones, joints, and muscles** — how the skeletal and muscular systems protect organs, support the body, and move it.
3. **Lungs, heart, and blood** — how the respiratory and circulatory systems deliver oxygen and remove carbon dioxide.
4. **Stomach, intestines, and liver** — how the digestive system breaks down food and removes solid waste.
5. **Kidneys and the bladder** — how the urinary system filters the blood and balances water.
6. **Brain and nerves** — how the nervous system carries information and creates responses.
7. **Reproductive organs** — how the reproductive system makes it possible for a new baby to begin and grow.
8. **The immune system** — how white blood cells and their organs find and fight germs.
9. **Systems working together** — how the systems depend on one another to keep the body alive.

Activity ideas are written in the lessons as placeholders. They are not interactive yet. Lesson 1 includes three original teaching illustrations; their provenance is recorded in [image credits](IMAGE_CREDITS.md).

Practice and spaced Review use the lesson questions. Progress is saved only in this browser, under `body-school.progress.v2`.

## Run and check

```sh
npm install
npm run dev
npm run build
npm test
npm run validate:offline
npm run validate
npm run audit
```

`content/curriculum.yaml` defines the sequence. Lesson files are in `content/lessons/`. How a section places its illustration, and the image width to export for that layout, is documented in [lesson layouts](docs/lesson-layouts.md). Structure references, when added, belong in `content/items/`. Artwork, when added, belongs in `public/images/`. `docs/image-manifest.json` records download URLs and licenses.

Do not run `scripts/make-body-images.py` or `scripts/download-sourced-images.py` to create figures. Those scripts are retired.

Deployment is separate from local content work.
