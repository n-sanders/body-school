# Body School

A middle-school foundation in major organs and body systems for learners around 11–13. Built on StudyKit. Reproductive organs and systems are outside scope.

The curriculum has **42 short lessons in seven units**: 28 focused core lessons, seven introductions, and seven reviews. Each targets **about 10 minutes**, including an independent reflection prompt and five concept questions. Pacing is an estimate to check with learners; there is no long vocabulary memorization requirement.

Every lesson has at least one main teaching picture and a focused visual-reading task. Introductions and reviews use pictures too; some lessons compare two or three figures. See [visual coverage](docs/VISUAL-TEACHING.md).

Lessons include visible Go deeper sections with structure facts and credited educational artwork. The separate structure catalog also provides reference reading. Practice and spaced Review focus on lesson concepts. Browser-local progress is retained by the existing app.

See [the revision notes](docs/CURRICULUM-REVISION.md) for pacing, coverage, assessment choices, and existing-progress considerations; [the image backlog](docs/IMAGE-BACKLOG.md) for figures to improve later; and [image credits](IMAGE_CREDITS.md) for every current asset.

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

`content/curriculum.yaml` defines sequence and units. Lesson files are in `content/lessons/`; structure references are in `content/items/`. Found artwork lives in `public/images/servier/` and `public/images/lessons/`. `docs/image-manifest.json` records original Servier download URLs and licenses.

The old `scripts/make-body-images.py` is retired and exits without generating placeholder art. The historical `scripts/download-sourced-images.py` describes the first-pass Commons collection; do not run it to restore removed figures. Use the current manifest and credits when maintaining the selected artwork.

The numbered original planning files remain historical drafts. The current lesson sequence is `content/curriculum.yaml`; the revision notes supersede the earlier pacing and image-generation approach. The archived independent audit describes the first pass, not current content.

Progress remains under `body-school.progress.v2`; no learner data was reset. Deployment is separate from local content work.
