import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { allItems, content } from "../content/loader";
import { ActivityPlayer } from "../components/ActivityPlayer";
import { useProgress } from "../hooks/useProgress";
import { PracticeSession } from "../components/PracticeSession";
import { knownDueCards, studiedItems, practiceCardEnabled } from "../lib/learning";
import { BOX_INTERVAL_DAYS, MAX_BOX, nextDue } from "../lib/progress";
import { parseCard } from "../lib/cards";
import { cardExists, cardLabel } from "../lib/quiz";

export function ReviewPage() {
  const { progress, store } = useProgress();
  const [session, setSession] = useState(0);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const due = knownDueCards(content, progress);
  const dueQuestions = due.filter((card) => parseCard(card)?.kind !== "activity");
  const dueActivities = due.filter((card) => parseCard(card)?.kind === "activity");
  const queue = useRef<string[]>([]);

  const studied = studiedItems(content, progress);
  // Fixed for the length of a session so answering doesn't restart it.
  const pool = useMemo(() => (studied.length >= 4 ? studied : allItems()), [session]);

  const nextTarget = useCallback(() => queue.current.shift() ?? null, []);

  const start = () => {
    queue.current = [...dueQuestions];
    setActiveActivity(null);
    setSession((s) => s + 1);
  };

  const reviewProgress = { ...progress, cards: Object.fromEntries(Object.entries(progress.cards).filter(([key]) => practiceCardEnabled(key) && cardExists(content, key))) };
  const upcoming = nextDue(reviewProgress);
  const boxes = Array.from({ length: MAX_BOX }, (_, i) => i + 1).map((box) => ({
    box,
    cards: Object.entries(progress.cards)
      .filter(([key, s]) => s.box === box && cardExists(content, key) && practiceCardEnabled(key))
      .map(([key]) => cardLabel(content, key)),
  }));

  return (
    <div>
      <h1>Review</h1>
      <p className="muted">
        Everything you answer goes into a review box. Right answers move it up a box so it comes back less often; a
        wrong answer sends it back to box 1, so it comes back right away.
      </p>

      {session > 0 ? (
        <PracticeSession
          key={session}
          pool={pool}
          itemMode="identify"
          nextTarget={nextTarget}
          onAnswered={(card, correct) => {
            if (!correct) queue.current.push(card);
          }}
          emptyMessage={
            <>
              <h3>Review complete!</h3>
              <p>
                Nice work. <button className="btn small" onClick={() => setSession(0)}>Back to review overview</button>
              </p>
            </>
          }
        />
      ) : dueQuestions.length ? (
        <div className="card">
          <p>
            <strong>{dueQuestions.length}</strong> question{dueQuestions.length === 1 ? " is" : "s are"} due for review.
          </p>
          <button className="btn primary" onClick={start}>
            Start review
          </button>
        </div>
      ) : dueActivities.length === 0 ? (
        <div className="card">
          {Object.keys(progress.cards).length === 0 ? (
            <p>
              Nothing to review yet. Answer some questions in a <Link to="/learn">lesson</Link> or in{" "}
              <Link to="/practice">Practice</Link> first.
            </p>
          ) : (
            <p>
              Nothing is due right now.{" "}
              {upcoming && <>The next review is due {upcoming.toLocaleString()}.</>}
            </p>
          )}
        </div>
      ) : null}

      {session === 0 && dueActivities.length > 0 && (
        <div className="card">
          <h2>Activities to try again</h2>
          {activeActivity && content.activities.get(activeActivity) ? (
            <>
              <button type="button" className="btn small" onClick={() => setActiveActivity(null)}>
                All activities
              </button>
              <ActivityPlayer
                key={activeActivity}
                activity={content.activities.get(activeActivity)!}
                onComplete={(correct) => store.recordAnswer(`activity:${activeActivity}`, correct)}
              />
            </>
          ) : (
            <ul className="activity-list">
              {dueActivities.map((card) => {
                const ref = parseCard(card);
                const activity = ref?.kind === "activity" ? content.activities.get(ref.id) : undefined;
                if (!activity || ref?.kind !== "activity") return null;
                return (
                  <li key={card}>
                    <button type="button" className="btn" onClick={() => setActiveActivity(ref.id)}>
                      {activity.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <section className="card">
        <h2>Your review boxes</h2>
        <div className="boxes">
          {boxes.map(({ box, cards }) => (
            <div key={box} className="box">
              <h3>Box {box}</h3>
              <p className="muted small">
                {BOX_INTERVAL_DAYS[box] === 0 ? "Due right away" : `Due every ${BOX_INTERVAL_DAYS[box]} day(s)`}
              </p>
              {cards.length ? (
                <ul>
                  {cards.sort().map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted small">Empty</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
