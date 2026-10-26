import { useState } from "react";
import { useTextSize } from "../hooks/useTextSize";
import { stepTextSize, type TextSizeDirection } from "../lib/text-size";

export function TextSizeControl() {
  const { size, store } = useTextSize();
  const [announcement, setAnnouncement] = useState("");

  const change = (direction: TextSizeDirection) => {
    const next = stepTextSize(size, direction);
    if (next === size) return;
    store.set(next);
    setAnnouncement(`Text size: ${next}`);
  };

  return (
    <div className="text-size" role="group" aria-label="Text size">
      <button
        type="button"
        className="text-size-btn smaller"
        aria-label="Smaller text"
        disabled={size === "default"}
        onClick={() => change(-1)}
      >
        A−
      </button>
      <button
        type="button"
        className="text-size-btn larger"
        aria-label="Larger text"
        disabled={size === "largest"}
        onClick={() => change(1)}
      >
        A+
      </button>
      <span className="visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
