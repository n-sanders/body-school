import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { allItems, content } from "../content/loader";
import { ActivityPlayer } from "../components/ActivityPlayer";
import { parseCard } from "../lib/cards";
import { useProgress } from "../hooks/useProgress";
import { PracticeSession } from "../components/PracticeSession";
import {
  allCards,
  availableModes,
  cardsForMode,
  itemModeFor,
  studiedCards,
  studiedItems,
  type PracticeMode,
} from "../lib/learning";
import { getProgressStore, accuracy } from "../lib/progress";
import { pickPracticeTarget } from "../lib/quiz";
import { noun, site } from "../lib/site";

type Scope = "studied" | "all";

const MODE_LABELS: Record<PracticeMode, string> = {
  identify: `Identify: image → ${noun.one} name`,
  find: `Find: ${noun.one} name → image`,
  mixed: `Mixed ${noun.one} questions`,
  questions: "Lesson questions",
  all: "Everything",
  activities: "Activities",
};

export function PracticePage() {
  const { progress } = useProgress();
  const modes = availableModes(site.catalog.enabled && site.catalog.practice !== false);
  const [mode, setMode] = useState<PracticeMode>(modes[0]);
  const [scope, setScope] = useState<Scope>("studied");
  const [started, setStarted] = useState(false);

  const studied = studiedCards(content, progress);
  const studiedKey = cardsForMode(studied, mode).join(",");
  // Only rebuild the card list when the set of cards changes, not on every answer.
  const cards = useMemo(
    () => (scope === "all" ? cardsForMode(allCards(content), mode) : studiedKey ? studiedKey.split(",") : []),
    [scope, mode, studiedKey],
  );
  const studiedItemSlugs = studiedItems(content, progress)
    .map((b) => b.slug)
    .join(",");
  const pool = useMemo(
    () =>
      scope === "studied" && studiedItemSlugs
        ? studiedItemSlugs.split(",").map((s) => content.items.get(s)!)
        : allItems(),
    [scope, studiedItemSlugs],
  );

  const nextTarget = useCallback(
    (previous: string | undefined) =>
      cards.length ? pickPracticeTarget(cards, (c) => accuracy(getProgressStore().getSnapshot(), c), previous) : null,
    [cards],
  );

  const totalForMode = cardsForMode(allCards(content), mode).length;
  const firstLesson = content.lessons.get(content.lessonOrder[0])!;

  return (
    <div>
      <h1>Practice</h1>
      <p className="muted">
        Practice as much as you like. Questions you get wrong come up more often.
      </p>

      <div className="card controls">
        {modes.length > 1 && (
          <fieldset>
            <legend>Question type</legend>
            {modes.map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="mode"
                  checked={mode === value}
                  onChange={() => {
                    setMode(value);
                    setStarted(false);
                  }}
                />{" "}
                {MODE_LABELS[value]}
              </label>
            ))}
          </fieldset>
        )}
        <fieldset>
          <legend>Questions from</legend>
          <label>
            <input type="radio" name="scope" checked={scope === "studied"} onChange={() => setScope("studied")} />{" "}
            Lessons I have completed ({studiedKey ? studiedKey.split(",").length : 0})
          </label>
          <label>
            <input type="radio" name="scope" checked={scope === "all"} onChange={() => setScope("all")} /> The whole
            course ({totalForMode}, challenge)
          </label>
        </fieldset>
        {!started && mode !== "activities" && (
          <button className="btn primary" onClick={() => setStarted(true)} disabled={cards.length < 1}>
            Start practicing
          </button>
        )}
        {mode === "activities" && !started && (
          <button className="btn primary" onClick={() => setStarted(true)} disabled={cards.length < 1}>
            Show activities
          </button>
        )}
      </div>

      {cards.length < 1 ? (
        <div className="card">
          Complete a lesson (starting with <Link to={`/lesson/${firstLesson.id}`}>{firstLesson.title}</Link>) to
          practice what it taught, or choose <em>The whole course</em>.
        </div>
      ) : started && mode === "activities" ? (
        <ActivityPractice cards={cards} />
      ) : (
        started && (
          <PracticeSession key={`${mode}:${scope}`} pool={pool} itemMode={itemModeFor(mode)} nextTarget={nextTarget} />
        )
      )}
    </div>
  );
}

function ActivityPractice({ cards }: { cards: string[] }) {
  const { store } = useProgress();
  const [active, setActive] = useState<string | null>(null);
  const activeRef = active ? parseCard(active) : null;
  const activity = activeRef?.kind === "activity" ? content.activities.get(activeRef.id) : undefined;

  if (activity && active) {
    return (
      <div>
        <button type="button" className="btn small" onClick={() => setActive(null)}>
          All activities
        </button>
        <ActivityPlayer
          key={activity.id}
          activity={activity}
          onComplete={(correct) => store.recordAnswer(active, correct)}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Choose an activity</h2>
      <ul className="activity-list">
        {cards.map((card) => {
          const ref = parseCard(card);
          const item = ref?.kind === "activity" ? content.activities.get(ref.id) : undefined;
          if (!item) return null;
          return (
            <li key={card}>
              <button type="button" className="btn" onClick={() => setActive(card)}>
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
