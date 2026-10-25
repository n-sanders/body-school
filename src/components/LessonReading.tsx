import { useEffect, useRef, useState, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { content } from "../content/loader";
import { useProgress } from "../hooks/useProgress";
import { activityCard } from "../lib/cards";
import { ActivityPlayer } from "./ActivityPlayer";
import { isActivityCompleted } from "../lib/progress";

function LessonFigure({ src, alt, title }: { src: string; alt: string; title?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const ignoreClose = useRef(false);
  const [open, setOpen] = useState(false);
  const label = alt || title || "Full-size illustration";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (!dialog.open) return;
      ignoreClose.current = true;
      dialog.close();
      ignoreClose.current = false;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="lesson-figure-link"
        aria-label={`View full size: ${label}`}
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} width="1536" height="1024" loading="lazy" decoding="async" />
      </button>
      <figcaption>
        {title}{" "}
        <button type="button" onClick={() => setOpen(true)}>
          View full size
        </button>
      </figcaption>
      <dialog
        ref={dialogRef}
        className="figure-lightbox"
        aria-label={label}
        onClose={() => {
          if (!ignoreClose.current) setOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <button type="button" className="figure-lightbox-close" aria-label="Close" onClick={() => setOpen(false)}>
          ×
        </button>
        <img src={src} alt={alt} />
      </dialog>
    </>
  );
}

const illustratedComponents: Components = {
  p({ node, children }) {
    const isFigure = node?.children.some((child) => child.type === "element" && child.tagName === "img")
      && node.children.every((child) =>
        child.type === "element" ? child.tagName === "img" : child.type === "text" && !child.value.trim(),
      );
    return isFigure ? <figure className="lesson-figure">{children}</figure> : <p>{children}</p>;
  },
  img({ src, alt, title }) {
    if (!src) return null;
    return <LessonFigure src={src} alt={alt ?? ""} title={title} />;
  },
};

const placements = new Set(["image-right", "image-left", "stack"]);
const ratios = new Set(["1-2", "1-1", "2-1"]);

function sectionLayout(section: string): { markdown: string; className: string } {
  const lines = section.split("\n");
  const headingIndex = lines.findIndex((line) => line.startsWith("## "));
  let placement: string | null = null;
  let ratio: string | null = null;
  let titleInImage = false;
  if (headingIndex >= 0) {
    const marker = lines[headingIndex].match(/^(##\s+.*?)\s+\{([^}]*)\}\s*$/);
    if (marker) {
      for (const token of marker[2].trim().split(/\s+/)) {
        if (placements.has(token)) placement = token;
        else if (ratios.has(token)) ratio = token;
        else if (token === "title-in-image") titleInImage = true;
      }
      lines[headingIndex] = marker[1];
    }
  }
  const markdown = lines.join("\n");
  const hasFigure = markdown.includes("![");
  const titleClass = titleInImage && hasFigure ? "title-in-image " : "";
  if (!hasFigure || placement === "stack") return { markdown, className: `${titleClass}layout-stack` };
  const side = placement === "image-left" ? "layout-image-left" : "layout-image-right";
  return { markdown, className: `${titleClass}${side} layout-ratio-${ratio ?? "1-2"}` };
}

function ActivityEmbed({ id }: { id: string }) {
  const activity = content.activities.get(id);
  const { progress, store } = useProgress();
  if (!activity) return <p className="muted">This activity is not available.</p>;
  return (
    <div className="lesson-activity">
      <ActivityPlayer
        activity={activity}
        completed={isActivityCompleted(progress, activity.id)}
        onComplete={(correct) => store.recordAnswer(activityCard(activity.id), correct)}
      />
    </div>
  );
}

function proseWithActivities(markdown: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  const activityLine = /^\{activity\s+([a-z0-9-]+)\}\s*$/gm;
  for (const match of markdown.matchAll(activityLine)) {
    const start = match.index ?? 0;
    const before = markdown.slice(last, start).trim();
    if (before) {
      nodes.push(
        <Markdown key={`${keyPrefix}-md-${start}`} remarkPlugins={[remarkGfm]} components={illustratedComponents}>
          {before}
        </Markdown>,
      );
    }
    nodes.push(<ActivityEmbed key={`${keyPrefix}-activity-${match[1]}`} id={match[1]} />);
    last = start + match[0].length;
  }
  const after = markdown.slice(last).trim();
  if (after) {
    nodes.push(
      <Markdown key={`${keyPrefix}-md-end`} remarkPlugins={[remarkGfm]} components={illustratedComponents}>
        {after}
      </Markdown>,
    );
  }
  return nodes;
}

export function LessonReading({ body }: { body: string }) {
  // Illustrated lessons use level-two headings to separate their reading panels.
  // Keep the original Markdown rendering for lessons without this structure.
  if (!body.includes("![") || !/^## /m.test(body)) {
    return <section className="card prose">{proseWithActivities(body, "lesson")}</section>;
  }

  const sections = body.trim().split(/\n(?=## )/);
  return (
    <div className="lesson-reading">
      {sections.map((section, index) => {
        const layout = sectionLayout(section);
        return (
          <section className={`card prose lesson-panel lesson-panel-${index + 1} ${layout.className}`} key={index}>
            {proseWithActivities(layout.markdown, `section-${index}`)}
          </section>
        );
      })}
    </div>
  );
}
