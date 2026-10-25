import { site } from "../lib/site";
import { buildContent, checkIntegrity, parseActivity, parseCurriculum, parseItem, parseLesson } from "./parse";

const itemFiles = import.meta.glob<string>("/content/items/*.yaml", {
  query: "?raw",
  import: "default",
  eager: true,
});
const lessonFiles = import.meta.glob<string>("/content/lessons/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
const curriculumFiles = import.meta.glob<string>("/content/curriculum.yaml", {
  query: "?raw",
  import: "default",
  eager: true,
});
const activityFiles = import.meta.glob<string>("/content/activities/*.yaml", {
  query: "?raw",
  import: "default",
  eager: true,
});

function load() {
  const [curriculumFile, curriculumRaw] = Object.entries(curriculumFiles)[0];
  const curriculum = parseCurriculum(curriculumRaw, curriculumFile);
  const items = Object.entries(itemFiles).map(([file, raw]) => parseItem(raw, file));
  const lessons = Object.entries(lessonFiles).map(([file, raw]) => parseLesson(raw, file));
  const activities = Object.entries(activityFiles).map(([file, raw]) => parseActivity(raw, file));
  const problems = checkIntegrity(curriculum, items, lessons, { catalogEnabled: site.catalog.enabled, activities });
  if (problems.length) {
    throw new Error(`Content failed integrity checks:\n${problems.join("\n")}`);
  }
  return buildContent(curriculum, items, lessons, activities);
}

export const content = load();

export function getLesson(id: string) {
  return content.lessons.get(id);
}

export function getItem(slug: string) {
  return content.items.get(slug);
}

export function allItems() {
  return [...content.items.values()].sort((a, b) => a.name.localeCompare(b.name));
}
