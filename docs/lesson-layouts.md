# Lesson layouts

A lesson reading is split into sections by `##` headings. End a heading with a marker in braces to choose how that section places its illustration. The marker is not shown to learners.

```markdown
## Cells: the smallest building blocks {image-right 1-2}
```

The first word places the image. The ratio is the left column, then the right column. A section with a figure and no marker uses `{image-right 1-2}`. A section with no figure, such as a recap, stacks and uses the full card width.

- `{image-right 1-2}` — text on the left (one third), image on the right (two thirds).
- `{image-left 2-1}` — image on the left (two thirds), text on the right (one third).
- `{image-right 1-1}` or `{image-left 1-1}` — half and half.
- `{image-right 2-1}` or `{image-left 1-2}` — the image is the narrow third.
- `{stack}` — the copy, then the figure underneath. Paragraphs, lists, and the image use the full card width.

Below a viewport width of 960px, every side-by-side section stacks, and the text uses the full card width.

## Titles included in illustrations

Add `title-in-image` when the illustration already contains the section title:

```markdown
## Your body's framework {image-right 1-1 title-in-image}
## Muscles pull to make movement {stack title-in-image}
```

The section heading stays in the document for screen readers but is visually hidden. This is an explicit author choice; the page does not detect text inside images. Without this marker, headings remain visible. The marker is ignored when the section has no image. Keep the Markdown heading descriptive and use the marker only when the image provides an equivalent visible title.

## Target image widths

Widths below are the displayed size on the 1200px lesson page. Export a WebP at about twice that width so it stays sharp. Choose the image's shape to suit its content: square for a focused diagram, portrait for a vertical route, or wide for a process with several steps. The layout ratios above control column widths, not the image's shape. Images keep their natural proportions.

The dimensions below are examples for 3:2 illustrations. Adjust the height for square, portrait, or wider images. One 2100×1400 landscape master covers every column width, and smaller layouts scale it down.

- Image in the two-thirds column (`image-right 1-2`, `image-left 2-1`): about 700px wide. Export about 1400×930.
- Image in a half column (`1-1`): about 520px wide. Export about 1040×690.
- Image in the one-third column (`image-right 2-1`, `image-left 1-2`): about 350px wide. Export about 700×470. Use this for a simple picture, not a diagram with many labels.
- Stacked image: the full content width, about 1070px. Export about 2100×1400.

Record each file's source and license in `IMAGE_CREDITS.md` and `docs/image-manifest.json`.
