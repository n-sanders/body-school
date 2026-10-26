import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ActivityPlayer } from "../src/components/ActivityPlayer";
import { content } from "../src/content/loader";
import { activityComplete, applyActivityDrop, type ActivityState } from "../src/lib/activity";
import { activityCard } from "../src/lib/cards";
import { ProgressStore, memoryStorage, unfinishedLessonActivities } from "../src/lib/progress";

const sort = content.activities.get("movable-and-fixed-joints")!;
const labels = content.activities.get("bone-protection-jobs")!;
const textLabels = content.activities.get("reproductive-organ-jobs")!;
const empty = (): ActivityState => ({ placed: {}, duties: {} });

describe("completed activity display", () => {
  for (const activity of [labels, sort, textLabels]) {
    it(`keeps ${activity.id} visible with correct answers after a saved completion`, () => {
      const html = renderToStaticMarkup(createElement(ActivityPlayer, { activity, completed: true }));
      expect(html).toContain("You finished this activity.");
      for (const card of activity.cards) {
        if (card.image) expect(html).toContain(card.image);
        expect(html).toContain(card.duty);
      }
      expect(html.match(/activity-card right/g)).toHaveLength(activity.cards.length);
      expect(html).not.toContain('draggable="true"');
      expect(html).not.toContain("Drop a job here");
    });
  }
});

describe("immediate activity feedback", () => {
  it("renders text-only organ cards and completes them with the same drop feedback", () => {
    const html = renderToStaticMarkup(createElement(ActivityPlayer, { activity: textLabels }));
    expect(html).not.toContain("<img");
    for (const card of textLabels.cards) expect(html).toContain(card.label);
    let state: ActivityState = { placed: Object.fromEntries(textLabels.cards.map((c) => [c.id, ""])), duties: {} };
    const wrong = applyActivityDrop(textLabels, state, { kind: "duty", cardId: "ovaries", text: "Make sperm cells" });
    expect(wrong.correct).toBe(false);
    expect(wrong.state).toBe(state);
    for (const card of textLabels.cards) {
      state = applyActivityDrop(textLabels, state, { kind: "duty", cardId: card.id, text: card.duty }).state;
    }
    expect(activityComplete(textLabels, state)).toBe(true);
  });

  it("rejects an incorrect group and accepts a correct group immediately", () => {
    const state = empty();
    const wrong = applyActivityDrop(sort, state, { kind: "place", cardId: "knee-joint", category: "Stays fixed" });
    expect(wrong.correct).toBe(false);
    expect(wrong.feedback).toContain("Try another group");
    expect(wrong.state).toBe(state);
    const right = applyActivityDrop(sort, state, { kind: "place", cardId: "knee-joint", category: "Allows movement" });
    expect(right.correct).toBe(true);
    expect(right.state.placed["knee-joint"]).toBe("Allows movement");
    expect(activityComplete(sort, right.state)).toBe(false);
  });

  it("keeps correct labels when an incorrect replacement is dropped", () => {
    const state = { placed: { skull: "" }, duties: { skull: "Protects the brain" } };
    const result = applyActivityDrop(labels, state, { kind: "duty", cardId: "skull", text: "Protects the spinal cord" });
    expect(result.correct).toBe(false);
    expect(result.feedback).toContain("Try another job");
    expect(result.state.duties.skull).toBe("Protects the brain");
  });

  it("finishes a label-only activity on the last correct drop", () => {
    let state: ActivityState = { placed: Object.fromEntries(labels.cards.map((c) => [c.id, ""])), duties: {} };
    for (const [i, card] of labels.cards.entries()) {
      state = applyActivityDrop(labels, state, { kind: "duty", cardId: card.id, text: card.duty }).state;
      expect(activityComplete(labels, state)).toBe(i === labels.cards.length - 1);
    }
  });

  it("requires both groups and jobs, supports reused labels, and allows undo", () => {
    let state = empty();
    for (const card of sort.cards) {
      state = applyActivityDrop(sort, state, { kind: "place", cardId: card.id, category: card.category! }).state;
    }
    expect(activityComplete(sort, state)).toBe(false);
    for (const card of sort.cards) {
      state = applyActivityDrop(sort, state, { kind: "duty", cardId: card.id, text: card.duty }).state;
    }
    expect(activityComplete(sort, state)).toBe(true);
    const removed = applyActivityDrop(sort, state, { kind: "place", cardId: "knee-joint", category: null });
    expect(activityComplete(sort, removed.state)).toBe(false);
    const moved = applyActivityDrop(sort, state, { kind: "duty", cardId: "elbow-joint", text: "Bends and straightens", sourceId: "knee-joint" });
    expect(moved.state.duties["knee-joint"]).toBeUndefined();
    expect(activityComplete(sort, moved.state)).toBe(false);
  });
});

describe("lesson activity quiz gate", () => {
  const body = content.lessons.get("bones-joints-and-muscles")!.body;

  it("requires every embedded activity and preserves completion after retries and reload", () => {
    const storage = memoryStorage();
    const store = new ProgressStore(storage);
    expect(unfinishedLessonActivities(store.getSnapshot(), body)).toHaveLength(2);
    store.recordAnswer(activityCard(labels.id), false);
    expect(unfinishedLessonActivities(store.getSnapshot(), body)).toEqual([sort.id]);
    store.recordAnswer(activityCard(sort.id), true);
    expect(unfinishedLessonActivities(new ProgressStore(storage).getSnapshot(), body)).toEqual([]);
    store.reset();
    expect(unfinishedLessonActivities(store.getSnapshot(), body)).toHaveLength(2);
  });

  it("does not gate lessons without activities or count unrelated activity completions", () => {
    const store = new ProgressStore(memoryStorage());
    expect(unfinishedLessonActivities(store.getSnapshot(), "## Reading only")).toEqual([]);
    store.recordAnswer(activityCard("immune-organ-jobs"), true);
    expect(unfinishedLessonActivities(store.getSnapshot(), body)).toHaveLength(2);
  });
});
