import type { Activity } from "../content/schema";

export interface ActivityState {
  placed: Record<string, string>;
  duties: Record<string, string>;
}

export type ActivityDrop =
  | { kind: "place"; cardId: string; category: string | null }
  | { kind: "duty"; cardId: string; text: string | null; sourceId?: string };

export function activityComplete(activity: Activity, state: ActivityState): boolean {
  return activity.cards.every((card) =>
    state.placed[card.id] !== undefined &&
    (!activity.categories || state.placed[card.id] === card.category) &&
    state.duties[card.id] === card.duty,
  );
}

/** Reject wrong answers without disturbing earlier correct work. */
export function applyActivityDrop(activity: Activity, state: ActivityState, drop: ActivityDrop) {
  const card = activity.cards.find((c) => c.id === drop.cardId)!;
  const correct = drop.kind === "place"
    ? drop.category === null || drop.category === card.category
    : drop.text === null || drop.text === card.duty;
  if (!correct) {
    return { state, correct: false, feedback: `Not quite. Try another ${drop.kind === "place" ? "group" : "job"} for ${card.label}.` };
  }
  const next = { placed: { ...state.placed }, duties: { ...state.duties } };
  if (drop.kind === "place") {
    if (drop.category === null) delete next.placed[card.id];
    else next.placed[card.id] = drop.category;
  } else {
    if (drop.sourceId && drop.sourceId !== card.id) delete next.duties[drop.sourceId];
    if (drop.text === null) delete next.duties[card.id];
    else next.duties[card.id] = drop.text;
  }
  const feedback = drop.kind === "place"
    ? drop.category === null ? null : `That's right. ${card.label} belongs in ${drop.category}.`
    : drop.text === null ? null : `That's right. ${card.label}: ${drop.text}.`;
  return { state: next, correct: true, feedback };
}

export function lessonActivityIds(body: string): string[] {
  return [...new Set([...body.matchAll(/^\{activity\s+([a-z0-9-]+)\}\s*$/gm)].map((match) => match[1]))];
}
