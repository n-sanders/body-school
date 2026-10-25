import { useRef, useState, type DragEvent } from "react";
import type { Activity, ActivityCard } from "../content/schema";
import { shuffle } from "../lib/random";

interface Props {
  activity: Activity;
  /** Called once, when the learner finishes. True if the first check was right. */
  onComplete?: (correct: boolean) => void;
}

/** What is being dragged: a picture, a label from the list, or a label already on a picture. */
type Payload = { kind: "card"; id: string } | { kind: "label"; text: string } | { kind: "duty"; cardId: string };

/** Where pictures can sit when the activity has no categories. */
const BOARD = "";

function imageSrc(url: string) {
  return url.startsWith("http") || url.startsWith("/") ? url : `/${url}`;
}

export function ActivityPlayer({ activity, onComplete }: Props) {
  const [finished, setFinished] = useState(false);

  return (
    <section className="activity" aria-label={activity.title}>
      <h3>{activity.title}</h3>
      {finished ? (
        <p className="activity-feedback good">You finished this activity.</p>
      ) : (
        <ActivityBoard
          activity={activity}
          onPass={(correct) => {
            setFinished(true);
            onComplete?.(correct);
          }}
        />
      )}
    </section>
  );
}

function ActivityBoard({ activity, onPass }: { activity: Activity; onPass: (correct: boolean) => void }) {
  const categories = activity.categories;
  const [order] = useState(() => shuffle(activity.cards));
  const [labels] = useState(() => shuffle(activity.labels));
  const [placed, setPlaced] = useState<Record<string, string>>(() =>
    categories ? {} : Object.fromEntries(activity.cards.map((c) => [c.id, BOARD])),
  );
  const [duties, setDuties] = useState<Record<string, string>>({});
  const [hover, setHover] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [missed, setMissed] = useState(false);
  // dataTransfer contents are hidden until drop, so drop targets read the payload from here while hovering.
  const payload = useRef<Payload | null>(null);

  const changed = () => {
    setFeedback(null);
    setWrong(new Set());
  };

  const startDrag = (e: DragEvent, p: Payload, key: string) => {
    if (ok) {
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
      changed();
      endDrag();
    },
  });

  const placeCard = (category: string | null) => (p: Payload) => {
    if (p.kind !== "card") return;
    setPlaced((prev) => {
      const next = { ...prev };
      if (category === null) delete next[p.id];
      else next[p.id] = category;
      return next;
    });
  };

  const setDuty = (cardId: string) => (p: Payload) => {
    const text = p.kind === "label" ? p.text : p.kind === "duty" ? duties[p.cardId] : undefined;
    if (!text) return;
    setDuties((prev) => {
      const next = { ...prev, [cardId]: text };
      if (p.kind === "duty" && p.cardId !== cardId) delete next[p.cardId];
      return next;
    });
  };

  const clearDuty = (p: Payload) => {
    if (p.kind !== "duty") return;
    setDuties((prev) => {
      const next = { ...prev };
      delete next[p.cardId];
      return next;
    });
  };

  const check = () => {
    if (order.some((c) => placed[c.id] === undefined)) {
      setFeedback("Drag every picture into a group before you check.");
      return;
    }
    if (order.some((c) => !duties[c.id])) {
      setFeedback("Drag a job onto every picture before you check.");
      return;
    }
    const mistakes: string[] = [];
    const bad = new Set<string>();
    for (const card of order) {
      if (categories && placed[card.id] !== card.category) {
        mistakes.push(`${card.label} belongs in ${card.category}.`);
        bad.add(card.id);
      }
      if (duties[card.id] !== card.duty) {
        mistakes.push(`${card.label}'s job is "${card.duty}".`);
        bad.add(card.id);
      }
    }
    setWrong(bad);
    if (mistakes.length) {
      setMissed(true);
      setFeedback(`Not quite. ${mistakes.join(" ")} Move them and check again.`);
      return;
    }
    setOk(true);
    setFeedback("That's right.");
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
      categories ? "draggable" : "",
      dragging === zone ? "dragging" : "",
      hover === zone ? "drop-hover" : "",
      wrong.has(card.id) ? "wrong" : "",
      ok ? "right" : "",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div
        key={card.id}
        className={className}
        draggable={!!categories && !ok}
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
              draggable={!ok}
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
              draggable={!ok}
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
      {feedback && <p className={`activity-feedback ${ok ? "good" : "bad"}`}>{feedback}</p>}
      {ok ? (
        <button type="button" className="btn primary" onClick={() => onPass(!missed)}>
          Finish
        </button>
      ) : (
        <button type="button" className="btn primary" onClick={check}>
          Check
        </button>
      )}
    </>
  );
}
