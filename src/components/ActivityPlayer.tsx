import { useRef, useState, type DragEvent } from "react";
import type { Activity, ActivityCard } from "../content/schema";
import { activityComplete, applyActivityDrop, type ActivityDrop, type ActivityState } from "../lib/activity";
import { shuffle } from "../lib/random";

interface Props {
  activity: Activity;
  completed?: boolean;
  /** Called once after all answers are correct. True if no incorrect drops were made. */
  onComplete?: (correct: boolean) => void;
}

/** What is being dragged: a picture, a label from the list, or a label already on a picture. */
type Payload = { kind: "card"; id: string } | { kind: "label"; text: string } | { kind: "duty"; cardId: string };

/** Where pictures can sit when the activity has no categories. */
const BOARD = "";

function imageSrc(url: string) {
  return url.startsWith("http") || url.startsWith("/") ? url : `/${url}`;
}

export function ActivityPlayer({ activity, onComplete, completed = false }: Props) {
  const [finished, setFinished] = useState(false);

  return (
    <section className="activity" aria-label={activity.title} data-completed={finished || completed}>
      <h3>{activity.title}</h3>
      <ActivityBoard
        activity={activity}
        completed={finished || completed}
        onPass={(correct) => {
          setFinished(true);
          onComplete?.(correct);
        }}
      />
    </section>
  );
}

function ActivityBoard({ activity, onPass, completed }: { activity: Activity; onPass: (correct: boolean) => void; completed: boolean }) {
  const categories = activity.categories;
  const [order] = useState(() => shuffle(activity.cards));
  const [labels] = useState(() => shuffle(activity.labels));
  const [board, setBoard] = useState<ActivityState>(() => ({
    placed: categories ? {} : Object.fromEntries(activity.cards.map((c) => [c.id, BOARD])),
    duties: {},
  }));
  // Reconstruct the solved board for activities completed on an earlier visit.
  const { placed, duties } = completed ? {
    placed: Object.fromEntries(activity.cards.map((c) => [c.id, c.category ?? BOARD])),
    duties: Object.fromEntries(activity.cards.map((c) => [c.id, c.duty])),
  } : board;
  const [hover, setHover] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackGood, setFeedbackGood] = useState(false);
  const missed = useRef(false);
  const passed = useRef(false);
  // dataTransfer contents are hidden until drop, so drop targets read the payload from here while hovering.
  const payload = useRef<Payload | null>(null);

  const startDrag = (e: DragEvent, p: Payload, key: string) => {
    if (completed) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    payload.current = p;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", key);
    setDragging(key);
  };

  const endDrag = () => {
    payload.current = null;
    setDragging(null);
    setHover(null);
  };

  /** Props for a drop zone that takes payloads `accepts` allows; others fall through to the zone behind it. */
  const dropZone = (zone: string, accepts: (p: Payload) => boolean, drop: (p: Payload) => void) => ({
    onDragOver: (e: DragEvent) => {
      const p = payload.current;
      if (!p || !accepts(p)) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "move";
      setHover(zone);
    },
    onDragLeave: (e: DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHover((h) => (h === zone ? null : h));
    },
    onDrop: (e: DragEvent) => {
      const p = payload.current;
      if (!p || !accepts(p)) return;
      e.preventDefault();
      e.stopPropagation();
      drop(p);
      endDrag();
    },
  });

  const applyDrop = (drop: ActivityDrop) => {
    if (completed || passed.current) return;
    const result = applyActivityDrop(activity, board, drop);
    setBoard(result.state);
    setFeedback(result.feedback);
    setFeedbackGood(result.correct);
    setWrong(result.correct ? new Set() : new Set([drop.cardId]));
    if (!result.correct) missed.current = true;
    if (activityComplete(activity, result.state)) {
      passed.current = true;
      onPass(!missed.current);
    }
  };

  const placeCard = (category: string | null) => (p: Payload) => {
    if (p.kind === "card") applyDrop({ kind: "place", cardId: p.id, category });
  };

  const setDuty = (cardId: string) => (p: Payload) => {
    const text = p.kind === "label" ? p.text : p.kind === "duty" ? duties[p.cardId] : undefined;
    if (text) applyDrop({ kind: "duty", cardId, text, sourceId: p.kind === "duty" ? p.cardId : undefined });
  };

  const clearDuty = (p: Payload) => {
    if (p.kind === "duty") applyDrop({ kind: "duty", cardId: p.cardId, text: null });
  };

  const pictureCard = (card: ActivityCard) => {
    const isPlaced = placed[card.id] !== undefined;
    const duty = duties[card.id];
    const zone = `card:${card.id}`;
    const cardDrop = isPlaced
      ? dropZone(zone, (p) => p.kind === "label" || (p.kind === "duty" && p.cardId !== card.id), setDuty(card.id))
      : {};
    const className = [
      "activity-card",
      categories && !completed ? "draggable" : "",
      dragging === zone ? "dragging" : "",
      hover === zone ? "drop-hover" : "",
      wrong.has(card.id) ? "wrong" : "",
      duty === card.duty && (!categories || placed[card.id] === card.category) ? "right" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div
        key={card.id}
        className={className}
        draggable={!!categories && !completed}
        onDragStart={(e) => startDrag(e, { kind: "card", id: card.id }, zone)}
        onDragEnd={endDrag}
        {...cardDrop}
      >
        <img src={imageSrc(card.image)} alt="" draggable={false} />
        <span className="activity-card-name">{card.label}</span>
        {isPlaced &&
          (duty ? (
            <span
              className={`activity-label on-card${dragging === `duty:${card.id}` ? " dragging" : ""}`}
              draggable={!completed}
              onDragStart={(e) => startDrag(e, { kind: "duty", cardId: card.id }, `duty:${card.id}`)}
              onDragEnd={endDrag}
            >
              {duty}
            </span>
          ) : (
            <span className="activity-label-slot">Drop a job here</span>
          ))}
      </div>
    );
  };

  const unplaced = order.filter((c) => placed[c.id] === undefined);
  const zoneClass = (base: string, zone: string) => `${base}${hover === zone ? " drop-hover" : ""}`;

  return (
    <>
      <p>{activity.prompt}</p>
      {categories && (
        <div
          className={zoneClass("activity-bank", "bank")}
          {...dropZone("bank", (p) => p.kind === "card" && placed[p.id] !== undefined, placeCard(null))}
        >
          <h4>Pictures</h4>
          <div className="activity-cards">
            {unplaced.length ? unplaced.map(pictureCard) : <p className="muted small">All pictures are placed.</p>}
          </div>
        </div>
      )}
      <div
        className={zoneClass("activity-labels", "labels")}
        {...dropZone("labels", (p) => p.kind === "duty", clearDuty)}
      >
        <h4>Jobs</h4>
        <div className="activity-label-list">
          {labels.map((text) => (
            <span
              key={text}
              className={`activity-label${dragging === `label:${text}` ? " dragging" : ""}`}
              draggable={!completed}
              onDragStart={(e) => startDrag(e, { kind: "label", text }, `label:${text}`)}
              onDragEnd={endDrag}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
      <div className="activity-groups">
        {(categories ?? [BOARD]).map((category) => {
          const zone = `category:${category}`;
          return (
            <div
              key={category}
              className={zoneClass("activity-group", zone)}
              {...(categories
                ? dropZone(zone, (p) => p.kind === "card" && placed[p.id] !== category, placeCard(category))
                : {})}
            >
              {categories && <h4>{category}</h4>}
              <div className="activity-cards">{order.filter((c) => placed[c.id] === category).map(pictureCard)}</div>
            </div>
          );
        })}
      </div>
      <p role="status" aria-live="polite" className={`activity-feedback ${completed || feedbackGood ? "good" : "bad"}`}>
        {completed ? "You finished this activity." : feedback}
      </p>
    </>
  );
}
